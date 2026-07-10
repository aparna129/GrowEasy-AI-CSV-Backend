import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { AI_BATCH_SIZE } from "../constants";
import { logger } from "../utils/logger";

import { parseCsvFile } from "../services/csv.service";

import {
  getFileRows,
  deleteFileRows,
  saveFileRows,
} from "../services/fileStorage.service";

import { processRecords } from "../services/ai.service";

import { batchRecords } from "../utils/batchRecords";

export const uploadCsv = async (req: Request, res: Response): Promise<void> => {
  try {
    const file = (req as any).file;

    if (!file) {
      res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
      return;
    }

    const rows = await parseCsvFile(file.path);

    const fileId = uuidv4();

    saveFileRows(fileId, rows);

    res.status(200).json({
      success: true,
      fileId,
      totalRows: rows.length,
      previewRows: rows.slice(0, 5),
    });
  } catch (error) {
    logger.error(error);
    
    res.status(500).json({
      success: false,
      message: "Failed to parse CSV",
    });
  }
};

export const processCsv = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const startTime = Date.now();

    const fileId = req.params.fileId as string;

    const rows = getFileRows(fileId);

    if (!rows) {
      res.status(404).json({
        success: false,
        message: "File not found",
      });
      return;
    }

    const batches = batchRecords(rows, AI_BATCH_SIZE);

    const processedRows = [];

    for (const batch of batches) {
      const processedBatch = await processRecords(batch);

      processedRows.push(...processedBatch);
    }

    deleteFileRows(fileId);

    const processingTimeMs = Date.now() - startTime;

    const totalRecords = rows.length;
    const imported = processedRows.length;
    const skipped = totalRecords - imported;

    const skippedRows = rows.filter((row) => {
      const values = Object.values(row);

      const hasEmail = values.some(
        (value) => typeof value === "string" && value.includes("@"),
      );

      const hasPhone = values.some(
        (value) => typeof value === "string" && /\d{10}/.test(value),
      );

      return !hasEmail && !hasPhone;
    });

    res.status(200).json({
      success: true,
      processedAt: new Date().toISOString(),
      processingTimeMs,
      totalRecords,
      imported,
      skipped,
      records: processedRows,
      skippedRecords: skippedRows,
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to process CSV",
    });
  }
};
