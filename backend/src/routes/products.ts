import { Router } from "express";
import { prisma } from "../prisma";
import { requireAdmin, requireAuth } from "../middleware/auth";

const router = Router();

// Get all products (public)
router.get("/", async (_req, res) => {
  const products = await prisma.product.findMany({
    include: { variants: true },
    orderBy: { createdAt: "desc" },
  });
  res.json(products);
});

// Get single product (public)
router.get("/:id", async (req, res) => {
  const product = await prisma.product.findUnique({
    where: { id: req.params.id },
    include: { variants: true },
  });
  if (!product) {
    res.status(404).json({ error: "Product not found" });
    return;
  }
  res.json(product);
});

// Create product (admin)
router.post("/", requireAuth, requireAdmin, async (req, res) => {
  const { title, description, imageUrl, variants } = req.body as {
    title?: string;
    description?: string;
    imageUrl?: string;
    variants?: Array<{
      name: string;
      price: number;
      stock?: number;
      sku?: string;
    }>;
  };

  if (!title || !description) {
    res.status(400).json({ error: "title and description are required" });
    return;
  }

  const product = await prisma.product.create({
    data: {
      title,
      description,
      imageUrl,
      variants: {
        create:
          variants?.map((v) => ({
            name: v.name,
            price: v.price,
            stock: v.stock ?? 0,
            sku: v.sku,
          })) ?? [],
      },
    },
    include: { variants: true },
  });

  res.status(201).json(product);
});

// Update product (admin)
router.put("/:id", requireAuth, requireAdmin, async (req, res) => {
  const { title, description, imageUrl } = req.body as {
    title?: string;
    description?: string;
    imageUrl?: string;
  };

  try {
    const product = await prisma.product.update({
      where: { id: req.params.id },
      data: {
        title,
        description,
        imageUrl,
      },
    });
    res.json(product);
  } catch {
    res.status(404).json({ error: "Product not found" });
  }
});

// Delete product (admin)
router.delete("/:id", requireAuth, requireAdmin, async (req, res) => {
  try {
    await prisma.product.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch {
    res.status(404).json({ error: "Product not found" });
  }
});

export default router;

