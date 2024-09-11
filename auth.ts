import express from "express";
import jwt from "jsonwebtoken";
import { env } from "./env";

type User = {
  name: string;
};

const app = express();

app.use(express.json());

let refreshTokens: string[] = [];

app.delete("/logout", (req, res) => {
  refreshTokens = refreshTokens.filter((token) => token !== req.body.token);

  res.sendStatus(204);
});

app.post("/token", (req, res) => {
  const refreshToken = req.body.token;

  if (!refreshToken) return res.sendStatus(401);
  if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403);

  jwt.verify(refreshToken, env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);

    const accessToken = generateAccessToken({ name: user.name });
    res.json({ accessToken });
  });
});

app.post("/login", (req, res) => {
  const username = req.body.username;
  const user: User = { name: username };

  const accessToken = generateAccessToken(user);
  const refreshToken = jwt.sign(user, env.REFRESH_TOKEN_SECRET);

  refreshTokens.push(refreshToken);

  res.json({ accessToken, refreshToken });
});

const generateAccessToken = (user: User) => {
  return jwt.sign(user, env.ACCESS_TOKEN_SECRET, { expiresIn: "15s" });
};

app.listen(4000, () => {
  console.log("Server running on port 4000");
});
