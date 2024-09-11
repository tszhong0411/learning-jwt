import express, { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "./env";

const app = express();

app.use(express.json());

const posts = [
  {
    username: "John",
    title: "Post 1",
  },
  {
    username: "John",
    title: "Post 2",
  },
  {
    username: "Jim",
    title: "Post 3",
  },
];

const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);

    req.body.user = user;
    next();
  });
};

app.get("/posts", authenticateToken, (req, res) => {
  res.json(posts.filter((post) => post.username === req.body.user.name));
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
