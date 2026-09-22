import express from "express";
import cors from "cors";
import urlRouter from "../routes/urlShortner.route.js";
import { urlRedirectController } from "../controllers/url.controller.js";
import cookieParser from "cookie-parser";
import config from "../config/config.js";

const app = express();

app.use(express.json());

app.use(cookieParser());

app.use(
  cors({
    origin: config.CLIENT_URL,
    credentials: true,
  }),
);

// app.get("/", (req, res) => {
//   res.send("server is working in url shortner");
// });

app.use("/api/url", urlRouter);

app.get("/:code", urlRedirectController);

export default app;
