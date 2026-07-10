import { z } from "zod";

const VALID_CRM_STATUS = [
  "GOOD_LEAD_FOLLOW_UP",
  "DID_NOT_CONNECT",
  "BAD_LEAD",
  "SALE_DONE",
] as const;

const VALID_DATA_SOURCE = [
  "leads_on_demand",
  "meridian_tower",
  "eden_park",
  "varah_swamy",
  "sarjapur_plots",
] as const;

const CRMRecordSchema = z.object({
  created_at: z.string().optional(),

  name: z.string().optional(),
  email: z.string().optional(),

  country_code: z.string().optional(),
  mobile_without_country_code: z.string().optional(),

  company: z.string().optional(),

  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),

  lead_owner: z.string().optional(),

  crm_status: z.string().optional(),
  crm_note: z.string().optional(),

  data_source: z.string().optional(),

  possession_time: z.string().optional(),
  description: z.string().optional(),
});

export const validateAIResponse = (records: unknown[]) => {
  if (!Array.isArray(records)) {
    return [];
  }

  return records
    .map((record) => {
      const result = CRMRecordSchema.safeParse(record);

      if (!result.success) {
        return null;
      }

      return result.data;
    })
    .filter(Boolean)
    .filter((record) => record!.email || record!.mobile_without_country_code)
    .map((record) => ({
      ...record!,

      crm_status: VALID_CRM_STATUS.includes(record!.crm_status as any)
        ? record!.crm_status
        : "",

      data_source: VALID_DATA_SOURCE.includes(record!.data_source as any)
        ? record!.data_source
        : "",
    }));
};
