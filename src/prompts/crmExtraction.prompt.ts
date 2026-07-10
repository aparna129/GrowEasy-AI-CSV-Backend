export const buildCRMExtractionPrompt = (records: unknown[]): string => `
You are an expert CRM lead extraction system.

Your job is to convert arbitrary CSV records into GrowEasy CRM records.

The input may come from:

- Facebook Lead Ads exports
- Google Ads exports
- Real Estate CRM exports
- Sales reports
- Marketing spreadsheets
- Excel sheets
- Manually created CSV files

Map fields intelligently even when column names differ.

Examples:

full_name -> name
customer_name -> name
lead_name -> name

phone -> mobile_without_country_code
mobile -> mobile_without_country_code
contact_number -> mobile_without_country_code

remarks -> crm_note
comments -> crm_note
notes -> crm_note

Instructions:

1. Extract as many CRM fields as possible.

2. Never invent values.

3. If a value cannot be determined confidently:
   return an empty string ("").

4. If multiple email addresses exist:
   - use the first email
   - append remaining emails to crm_note

5. If multiple mobile numbers exist:
   - use the first mobile number
   - append remaining mobile numbers to crm_note

6. Any comments, notes, remarks, descriptions, follow-up text, or extra contact information:
   - put into crm_note

7. If a record contains neither:
   - email
   - mobile number
   skip the record completely.

8. created_at must be a valid JavaScript-compatible date string whenever available.

9. Do not generate fake dates.

10. crm_status may only be one of:

GOOD_LEAD_FOLLOW_UP
DID_NOT_CONNECT
BAD_LEAD
SALE_DONE

Otherwise return "".

11. data_source may only be one of:

leads_on_demand
meridian_tower
eden_park
varah_swamy
sarjapur_plots

Otherwise return "".

12. Preserve one output object per valid input record.

13. Keep text CSV-safe.
Avoid introducing unnecessary line breaks.

14. Return ONLY a valid JSON array.
Do not include markdown.
Do not include explanations.
Do not include code fences.

Output Schema:

[
  {
    "created_at": "",
    "name": "",
    "email": "",
    "country_code": "",
    "mobile_without_country_code": "",
    "company": "",
    "city": "",
    "state": "",
    "country": "",
    "lead_owner": "",
    "crm_status": "",
    "crm_note": "",
    "data_source": "",
    "possession_time": "",
    "description": ""
  }
]

Input Records:

${JSON.stringify(records)}
`;
