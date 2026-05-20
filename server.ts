import express from "express";
import path from "path";
import mongoose from "mongoose";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

const PRODUCT_SCHEMA = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  description: { type: String, required: true },
  priceINR: { type: Number, required: true },
  priceUSDT: { type: Number, required: true },
  sellerUsername: { type: String, required: true },
  category: { type: String, required: true },
  link: { type: String, required: false },
  tags: { type: [String], default: [] }
}, {
  timestamps: true
});

const Product = mongoose.models.Product || mongoose.model("Product", PRODUCT_SCHEMA);

// Mock DB for when Mongo isn't connected
const inMemoryProducts: any[] = [];

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  // Increase payload size for base64 images
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  // Connect to MongoDB if URI is provided
  if (process.env.MONGODB_URI) {
    mongoose.connect(process.env.MONGODB_URI)
      .then(() => console.log("Connected to MongoDB database"))
      .catch((err) => console.error("MongoDB connection error:", err));
  } else {
    console.log("No MONGODB_URI set, skipping real database connection (mock mode)");
  }

  // API Routes
  
  // Get all products
  app.get("/api/products", async (req, res) => {
    try {
      if (process.env.MONGODB_URI && mongoose.connection.readyState === 1) {
        const products = await Product.find().sort({ createdAt: -1 });
        // Map _id to id for the frontend
        res.json(products.map(p => ({
          id: p._id.toString(),
          name: p.name,
          image: p.image,
          description: p.description,
          priceINR: p.priceINR,
          priceUSDT: p.priceUSDT,
          sellerUsername: p.sellerUsername,
          category: p.category,
          link: p.link,
          tags: p.tags
        })));
      } else {
        // Return in-memory items if DB not connected
        res.json(inMemoryProducts);
      }
    } catch (e) {
      res.status(500).json({ error: "Failed to fetch products" });
    }
  });

  // Create a product
  app.post("/api/products", async (req, res) => {
    try {
      if (process.env.MONGODB_URI && mongoose.connection.readyState === 1) {
        const newProduct = new Product(req.body);
        await newProduct.save();
        res.status(201).json({ success: true, product: newProduct });
      } else {
        // Save to in-memory items
        const newProduct = {
          ...req.body,
          id: Date.now().toString(),
          createdAt: new Date()
        };
        inMemoryProducts.unshift(newProduct);
        res.status(201).json({ success: true, product: newProduct });
      }
    } catch (e: any) {
      res.status(500).json({ error: e.message || "Failed to create product" });
    }
  });

  // Get statistics
  app.get("/api/stats", async (req, res) => {
    try {
      let products = [];
      if (process.env.MONGODB_URI && mongoose.connection.readyState === 1) {
        products = await Product.find();
      } else {
        products = inMemoryProducts;
      }
      
      const totalProducts = products.length;
      const totalVolumeUsdt = products.reduce((sum: number, p: any) => sum + (p.priceUSDT || 0), 0);
      const uniqueSellers = new Set(products.map((p: any) => p.sellerUsername)).size;

      res.json({ totalProducts, totalVolumeUsdt, uniqueSellers });
    } catch (e) {
      res.status(500).json({ error: "Failed to fetch stats" });
    }
  });

  // Chatbot API
  app.post("/api/chat", async (req, res) => {
    try {
      if (!process.env.GEMINI_API_KEY) {
        return res.status(400).json({ error: "No AI configured found." });
      }
      
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const prompt = req.body.prompt || "";
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          systemInstruction: "You are the SNC Market AI support bot. You help users navigate the marketplace, find digital and physical products, and answer questions. Keep it brief and futuristic, with a cyberpunk tone.",
        }
      });
      
      res.json({ text: response.text() });
    } catch (e: any) {
      res.status(500).json({ error: "AI error: " + (e.message || "Unknown") });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
