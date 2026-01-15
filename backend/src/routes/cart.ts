import { Router } from "express";
import { prisma } from "../prisma";
import { requireAuth } from "../middleware/auth";

const router = Router();

// Helper: get or create active cart for current user
async function getOrCreateCart(userId: string) {
  let cart = await prisma.cart.findFirst({
    where: { userId, status: "ACTIVE" },
    include: { items: { include: { productVariant: { include: { product: true } } } } },
  });
  if (!cart) {
    cart = await prisma.cart.create({
      data: { userId, status: "ACTIVE" },
      include: { items: { include: { productVariant: { include: { product: true } } } } },
    });
  }
  return cart;
}

// Get current cart
router.get("/", requireAuth, async (req, res) => {
  const userId = req.user!.userId;
  const cart = await getOrCreateCart(userId);
  res.json(cart);
});

// Add to cart
router.post("/items", requireAuth, async (req, res) => {
  const userId = req.user!.userId;
  const { productVariantId, quantity } = req.body as {
    productVariantId?: string;
    quantity?: number;
  };

  if (!productVariantId || !quantity || quantity <= 0) {
    res.status(400).json({ error: "productVariantId and positive quantity are required" });
    return;
  }

  const cart = await getOrCreateCart(userId);

  const existing = await prisma.cartItem.findFirst({
    where: { cartId: cart.id, productVariantId },
  });

  if (existing) {
    const updated = await prisma.cartItem.update({
      where: { id: existing.id },
      data: { quantity: existing.quantity + quantity },
    });
    res.status(200).json(updated);
    return;
  }

  const item = await prisma.cartItem.create({
    data: {
      cartId: cart.id,
      productVariantId,
      quantity,
    },
  });

  res.status(201).json(item);
});

// Update item quantity
router.put("/items/:id", requireAuth, async (req, res) => {
  const userId = req.user!.userId;
  const { quantity } = req.body as { quantity?: number };

  if (!quantity || quantity <= 0) {
    res.status(400).json({ error: "Positive quantity is required" });
    return;
  }

  // Ensure the item belongs to the user's active cart
  const item = await prisma.cartItem.findUnique({
    where: { id: req.params.id },
    include: { cart: true },
  });

  if (!item || item.cart.userId !== userId || item.cart.status !== "ACTIVE") {
    res.status(404).json({ error: "Cart item not found" });
    return;
  }

  const updated = await prisma.cartItem.update({
    where: { id: item.id },
    data: { quantity },
  });

  res.json(updated);
});

// Remove item
router.delete("/items/:id", requireAuth, async (req, res) => {
  const userId = req.user!.userId;

  const item = await prisma.cartItem.findUnique({
    where: { id: req.params.id },
    include: { cart: true },
  });

  if (!item || item.cart.userId !== userId || item.cart.status !== "ACTIVE") {
    res.status(404).json({ error: "Cart item not found" });
    return;
  }

  await prisma.cartItem.delete({ where: { id: item.id } });
  res.status(204).send();
});

export default router;

