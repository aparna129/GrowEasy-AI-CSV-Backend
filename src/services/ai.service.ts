import { gemini } from "../config/gemini";
import { buildCRMExtractionPrompt } from "../prompts/crmExtraction.prompt";
import { validateAIResponse } from "../validators/aiResponse.validator";
import { CRMRecord } from "../types/crm.types";
import { logger } from "../utils/logger";
import { sleep } from "../utils/sleep";

export const processRecords = async (
  rows: CRMRecord[],
): Promise<CRMRecord[]> => {
  const prompt = buildCRMExtractionPrompt(rows);

  const MAX_RETRIES = 3;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await gemini.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        },
      });

      const text = response.text;

      if (!text) {
        return [];
      }

      const parsedRecords = JSON.parse(text);

      return validateAIResponse(parsedRecords);
    } catch (error) {
      logger.error(`Gemini attempt ${attempt}/${MAX_RETRIES} failed:`, error);

      if (attempt === MAX_RETRIES) {
        return [];
      }
      await sleep(1000);
    }
  }

  return [];
};
