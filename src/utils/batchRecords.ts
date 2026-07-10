export const batchRecords = <T>(
  records: T[],
  batchSize: number
): T[][] => {
  const batches: T[][] = [];

  for (let i = 0; i < records.length; i += batchSize) {
    batches.push(records.slice(i, i + batchSize));
  }

  return batches;
};