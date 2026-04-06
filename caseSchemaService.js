import { supabase } from '@/lib/customSupabaseClient';
import { validateFullSchema } from './caseSchema';

export const caseSchemaService = {
  saveCaseSchema: async (deliverableId, schema) => {
    if (!deliverableId) return { success: false, error: "No Deliverable ID provided" };

    try {
      const validation = validateFullSchema(schema);
      if (!validation.valid) throw new Error(`Schema Validation Failed: ${validation.error}`);

      const { data, error } = await supabase
        .from('case_deliverables')
        .update({
          case_schema: schema,
          updated_at: new Date().toISOString() // Ensure ISO format for Postgres
        })
        .eq('id', deliverableId)
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error saving case schema:', error);
      return { success: false, error: error.message };
    }
  },

  getCaseSchema: async (deliverableId) => {
    try {
      const { data, error } = await supabase
        .from('case_deliverables')
        .select('case_schema, case_title')
        .eq('id', deliverableId)
        .single();

      if (error) throw error;
      return { success: true, schema: data.case_schema, title: data.case_title };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  exportSchemaAsJSON: (schema, filename = `Case_${Date.now()}.json`) => {
    const blob = new Blob([JSON.stringify(schema, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url); // Clean up memory
  }
};