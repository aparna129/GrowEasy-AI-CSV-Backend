import { CRMRecord } from "../types/crm.types";

const fileStorage = new Map<string, CRMRecord[]>();

export const saveFileRows = (
  fileId: string,
  rows: CRMRecord[]
) => {
  fileStorage.set(fileId, rows);
};

export const getFileRows = (
  fileId: string
): CRMRecord[] | undefined => {
  return fileStorage.get(fileId);
};

export const deleteFileRows = (
  fileId: string
) => {
  fileStorage.delete(fileId);
};