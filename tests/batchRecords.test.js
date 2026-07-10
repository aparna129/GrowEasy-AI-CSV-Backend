const { batchRecords } = require("../dist/utils/batchRecords");

describe("batchRecords", () => {
  test("splits records into batches of 2", () => {
    const result = batchRecords([1, 2, 3, 4, 5], 2);

    expect(result).toEqual([[1, 2], [3, 4], [5]]);
  });

  test("returns single batch when batch size is larger than array", () => {
    const result = batchRecords([1, 2, 3], 10);

    expect(result).toEqual([[1, 2, 3]]);
  });

  test("returns empty array when input is empty", () => {
    const result = batchRecords([], 2);

    expect(result).toEqual([]);
  });
});
