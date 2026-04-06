import { createDefaultSchema } from './caseSchema';

export const mapIntakeFormToSchema = (formData) => {
  // Use modern cloning and our new factory function
  const schema = structuredClone(createDefaultSchema());

  // 1. Client Information
  schema.client_information = {
    full_name: formData.full_name || "",
    email: formData.email || "",
    phone: formData.phone || "",
    address: formData.address || "",
    country: formData.country || ""
  };

  // 2. Counterparty
  schema.counterparty = {
    name: formData.complaint_against || "Unknown Party",
    type: formData.counterparty_type || "business",
    contact_info: formData.contacted_party ? "User indicated contact was made" : "Unknown",
    relationship_to_client: "Service Provider"
  };

  // 3. Case Overview
  schema.case_overview = {
    issue_type: formData.issue_type || "",
    issue_start_date: formData.issue_start_date || "",
    brief_description: formData.situation_description || "",
    is_urgent: formData.response_time === 'urgent'
  };

  // 4. Chronology
  schema.chronology = [
    {
      date: formData.issue_start_date || new Date().toISOString().split('T')[0],
      event: "Initial Incident",
      description: "Problem first identified."
    }
  ];

  // 5. Evidence Mapping
  if (formData.file_urls && Array.isArray(formData.file_urls)) {
    schema.evidence = formData.file_urls.map((url, index) => ({
      filename: url.split('/').pop() || `Evidence_${index + 1}`, // Extracts filename from URL
      url: url,
      type: "document"
    }));
  }

  // 6. Resolution Attempts
  if (formData.contacted_party) {
    schema.previous_resolution_attempts = [{
      date: "Prior to submission",
      method: Array.isArray(formData.contact_method) ? formData.contact_method.join(', ') : "Direct Contact",
      outcome: formData.party_response || "No response/Unsatisfactory"
    }];
  }

  // 7. Requested Outcome
  schema.requested_outcome = {
    primary_request: formData.desired_outcome_type || "resolution",
    specific_details: formData.desired_outcome || ""
  };

  return schema;
};