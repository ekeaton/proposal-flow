import { Router } from "express";
import bcrypt from "bcrypt";
import db from "../lib/db.js";
import jwt from "jsonwebtoken";

const router = Router();

const generateToken = (userId: string) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });
};

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await db.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ error: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await db.user.create({
      data: { email, name, password: hashedPassword },
    });

    const token = generateToken(newUser.id);

    return res
      .status(201)
      .json({ id: newUser.id, email: newUser.email, token });
  } catch (error) {
    return res.status(500).json({ error: "Registration failed" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const foundUser = await db.user.findUnique({ where: { email } });

    if (!foundUser) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const passwordMatch = await bcrypt.compare(password, foundUser.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const token = generateToken(foundUser.id);

    return res.status(200).json({ token });
  } catch (error) {
    return res.status(500).json({ error: "Login failed" });
  }
});

export default router;
