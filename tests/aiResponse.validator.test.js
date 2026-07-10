const {
  validateAIResponse,
} = require("../dist/validators/aiResponse.validator");

describe("validateAIResponse", () => {
  test("returns empty array when input is not an array", () => {
    expect(validateAIResponse({})).toEqual([]);
  });

  test("keeps valid record", () => {
    const result = validateAIResponse([
      {
        name: "John",
        email: "john@example.com",
        crm_status: "SALE_DONE",
        data_source: "eden_park",
      },
    ]);

    expect(result).toHaveLength(1);
    expect(result[0].crm_status).toBe("SALE_DONE");
    expect(result[0].data_source).toBe("eden_park");
  });
});

test("skips records without email and mobile", () => {
  const result = validateAIResponse([
    {
      name: "John Doe",
    },
  ]);

  expect(result).toEqual([]);
});

test("invalid crm_status and data_source are converted to empty strings", () => {
  const result = validateAIResponse([
    {
      email: "john@example.com",
      crm_status: "RANDOM_STATUS",
      data_source: "RANDOM_SOURCE",
    },
  ]);

  expect(result[0].crm_status).toBe("");
  expect(result[0].data_source).toBe("");
});
