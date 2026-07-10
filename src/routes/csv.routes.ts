import { Router } from "express";
import { upload } from "../middlewares/upload.middleware";
import { uploadCsv, processCsv } from "../controllers/csv.controller";

const router = Router();

router.post("/upload", upload.single("file"), uploadCsv);

router.post("/process/:fileId", processCsv);

export default router;
