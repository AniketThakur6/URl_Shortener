import { Router } from "express";
import {
  createShortUrlController,
  deleteUrlcontroller,
  getAllShortUrl,
} from "../controllers/url.controller.js";

const router = Router();

router.post("/", createShortUrlController);

router.get("/", getAllShortUrl);

router.delete("/:id", deleteUrlcontroller);

export default router;
