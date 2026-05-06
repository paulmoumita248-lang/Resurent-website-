import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", service: "Heritage Hearth Backend" });
  });

  app.post("/api/confirm-booking", (req, res) => {
    const { email, bookingDetails } = req.body;
    
    // In a production environment, you would use an email service here.
    // For this demonstration, we log the email that would be sent.
    console.log(`[EMAIL SYSTEM] Sending confirmation to ${email}`);
    console.log(`[EMAIL SYSTEM] Booking Details:`, bookingDetails);

    // Simulate success
    res.json({ 
      success: true, 
      message: "Confirmation email dispatched (Simulated)",
      timestamp: new Date().toISOString()
    });
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
