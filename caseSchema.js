export const CASE_SCHEMA_VERSION = "1.0.0";

// Changed to a function to ensure fresh timestamps and unique IDs per call
export const createDefaultSchema = () => ({
  version: CASE_SCHEMA_VERSION,
  case_id: crypto.randomUUID?.() || Math.random().toString(36).substring(2, 15),
  created_at: new Date().toISOString(),
  client_information: {
    full_name: "",
    email: "",
    phone: "",
    address: "",
    country: ""
  },
  counterparty: {
    name: "",
    type: "business",
    contact_info: "",
    relationship_to_client: ""
  },
  case_overview: {
    issue_type: "",
    issue_start_date: "",
    brief_description: "",
    is_urgent: false
  },
  chronology: [],
  evidence: [],
  previous_resolution_attempts: [],
  requested_outcome: {
    primary_request: "",
    specific_details: ""
  },
  normalized_summary: "",
  event_description_structured: "",
  structured_issue_statement: "",
  escalation_guidance: "",
  closing_statement: ""
});

// Validation helpers remain same
export const validateSection = (sectionName, data) => {
  if (!data) return false;
  switch (sectionName) {
    case 'client_information': return !!(data.full_name && data.email);
    case 'counterparty': return !!(data.name);
    case 'case_overview': return !!(data.brief_description);
    default: return true;
  }
};

export const validateFullSchema = (schema) => {
  if (!schema || typeof schema !== 'object') return { valid: false, error: "Invalid schema object" };
  const requiredSections = ['client_information', 'counterparty', 'case_overview'];
  for (const section of requiredSections) {
    if (!validateSection(section, schema[section])) {
      return { valid: false, error: `Invalid or missing section: ${section}` };
    }
  }
  return { valid: true };
};