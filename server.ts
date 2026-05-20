```ts
import express from "express";
import path from "path";
import mongoose from "mongoose";
import { GoogleGenAI } from "@google/genai";

const PRODUCT_SCHEMA = new mongoose.Schema(
  {
    name: { type: String, required: true },
    image: { type: String, required: true },
    description: { type: String, required: true },
    priceINR: { type: Number, required: true },
    priceUSDT: { type: Number, required: true },
    sellerUsername: { type: String, required: true },
    category: { type: String, required: true },
    link: { type: String, required: false },
    tags: { type: [String], default: [] },
  },
  {
    timestamps: true,
  }
);

const Product =
  mongoose.models.Product ||
  mongoose.model("Product", PRODUCT_SCHEMA);

const inMemoryProducts: any[] = [];

async function startServer() {
  const app = express();

  const PORT = process.env.PORT || 3000;

  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ extended: true, limit: "50mb" }));

  // MongoDB Connection
  if (process.env.MONGODB_URI) {
    mongoose
      .connect(process.env.MONGODB_URI)
      .then(() => {
        console.log("Connected to MongoDB database");
      })
      .catch((err) => {
        console.error("MongoDB connection error:", err);
      });
  } else {
    console.log("Running without MongoDB");
  }

  // GET PRODUCTS
  app.get("/api/products", async (req, res) => {
    try {
      if (
        process.env.MONGODB_URI &&
        mongoose.connection.readyState === 1
      ) {
        const products = await Product.find().sort({
          createdAt: -1,
        });

        res.json(
          products.map((p: any) => ({
            id: p._id.toString(),
            name: p.name,
            image: p.image,
            description: p.description,
            priceINR: p.priceINR,
            priceUSDT: p.priceUSDT,
            sellerUsername: p.sellerUsername,
            category: p.category,
            link: p.link,
            tags: p.tags,
          }))
        );
      } else {
        res.json(inMemoryProducts);
      }
    } catch (err) {
      res.status(500).json({
        error: "Failed to fetch products",
      });
    }
  });

  // CREATE PRODUCT
  app.post("/api/products", async (req, res) => {
    try {
      if (
        process.env.MONGODB_URI &&
        mongoose.connection.readyState === 1
      ) {
        const product = new Product(req.body);

        await product.save();

        res.status(201).json({
          success: true,
          product,
        });
      } else {
        const product = {
          ...req.body,
          id: Date.now().toString(),
          createdAt: new Date(),
        };

        inMemoryProducts.unshift(product);

        res.status(201).json({
          success: true,
          product,
        });
      }
    } catch (err: any) {
      res.status(500).json({
        error: err.message || "Failed to create product",
      });
    }
  });

  // STATS
  app.get("/api/stats", async (req, res) => {
    try {
      let products: any[] = [];

      if (
        process.env.MONGODB_URI &&
        mongoose.connection.readyState === 1
      ) {
        products = await Product.find();
      } else {
        products = inMemoryProducts;
      }

      const totalProducts = products.length;

      const totalVolumeUsdt = products.reduce(
        (sum: number, p: any) => sum + (p.priceUSDT || 0),
        0
      );

      const uniqueSellers = new Set(
        products.map((p: any) => p.sellerUsername)
      ).size;

      res.json({
        totalProducts,
        totalVolumeUsdt,
        uniqueSellers,
      });
    } catch (err) {
      res.status(500).json({
        error: "Failed to fetch stats",
      });
    }
  });

  // AI CHAT
  app.post("/api/chat", async (req, res) => {
    try {
      if (!process.env.GEMINI_API_KEY) {
        return res.status(400).json({
          error: "Missing GEMINI_API_KEY",
        });
      }

      const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
      });

      const prompt = req.body.prompt || "";

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          systemInstruction:
            "You are SNC Market AI assistant.",
        },
      });

      res.json({
        text: response.text(),
      });
    } catch (err: any) {
      res.status(500).json({
        error: err.message || "AI Error",
      });
    }
  });

  // SERVE FRONTEND
  const distPath = path.join(process.cwd(), "dist");

  app.use(express.static(distPath));

  app.get("*", (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
```
