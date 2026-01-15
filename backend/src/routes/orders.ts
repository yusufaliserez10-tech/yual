import { Router } from "express";
import { prisma } from "../prisma";
import { requireAdmin, requireAuth } from "../middleware/auth";

const router = Router();

// Create order from current cart + fake payment
router.post("/", requireAuth, async (req, res) => {
  const userId = req.user!.userId;

  const cart = await prisma.cart.findFirst({
    where: { userId, status: "ACTIVE" },
    include: {
      items: {
        include: {
          productVariant: {
            include: { product: true },
          },
        },
      },
    },
  });

  if (!cart || cart.items.length === 0) {
    res.status(400).json({ error: "Cart is empty" });
    return;
  }

  // Calculate total
  const totalAmount = cart.items.reduce(
    (sum, item) => sum + item.quantity * item.productVariant.price,
    0
  );

  // Fake payment: always succeed for now
  const paymentSuccessful = true;

  if (!paymentSuccessful) {
    res.status(402).json({ error: "Payment failed" });
    return;
  }

  const order = await prisma.$transaction(async (tx) => {
    const createdOrder = await tx.order.create({
      data: {
        userId,
        cartId: cart.id,
        totalAmount,
        status: "PROCESSING",
        paymentStatus: "PAID",
        items: {
          create: cart.items.map((item) => ({
            productId: item.productVariant.productId,
            productVariantId: item.productVariantId,
            quantity: item.quantity,
            unitPrice: item.productVariant.price,
          })),
        },
      },
      include: { items: true },
    });

    // Mark cart as converted
    await tx.cart.update({
      where: { id: cart.id },
      data: { status: "CONVERTED" },
    });

    return createdOrder;
  });

  res.status(201).json(order);
});

// Get current user's orders
router.get("/mine", requireAuth, async (req, res) => {
  const userId = req.user!.userId;
  const orders = await prisma.order.findMany({
    where: { userId },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });
  res.json(orders);
});

// Admin: get all orders
router.get("/", requireAuth, requireAdmin, async (_req, res) => {
  const orders = await prisma.order.findMany({
    include: { items: true, user: true },
    orderBy: { createdAt: "desc" },
  });
  res.json(orders);
});

// Admin: update order status
router.patch("/:id/status", requireAuth, requireAdmin, async (req, res) => {
  const { status } = req.body as { status?: string };

  if (!status) {
    res.status(400).json({ error: "status is required" });
    return;
  }

  try {
    const updated = await prisma.order.update({
      where: { id: req.params.id },
      data: { status: status as any },
    });
    res.json(updated);
  } catch {
    res.status(404).json({ error: "Order not found" });
  }
});

export default router;

