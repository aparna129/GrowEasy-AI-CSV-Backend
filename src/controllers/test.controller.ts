import { Request, Response } from "express";
import { gemini } from "../config/gemini";
import { logger } from "../utils/logger";

export const testGemini = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const response = await gemini.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "Reply with exactly: Gemini Connected",
    });

    res.status(200).json({
      success: true,
      response: response.text,
    });
  } catch (error) {
    logger.error(error);

    res.status(500).json({
      success: false,
      error,
    });
  }
};
