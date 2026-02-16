import express from "express";
import "dotenv/config";
import cors from "cors";

const app = express();

const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "healthy",
    message: "Server is running smoothly",
  });
});

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
