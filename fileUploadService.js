import { supabase } from '@/lib/customSupabaseClient';

export const fileUploadService = {
  uploadIntakeFiles: async (files, referenceId) => {
    const uploadedUrls = [];
    const errors = [];

    for (const file of files) {
      // Validation
      if (file.size > 10 * 1024 * 1024) {
        errors.push(`File ${file.name} exceeds 10MB limit.`);
        continue;
      }
      
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        errors.push(`File ${file.name} has unsupported type.`);
        continue;
      }

      try {
        const filePath = `legal-complaint-intakes/${referenceId}/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
        
        const { data, error } = await supabase.storage
          .from('legal-complaint-intakes') // Assuming bucket exists or will be created
          .upload(filePath, file);

        if (error) throw error;

        // Get public URL
        const { data: urlData } = supabase.storage
          .from('legal-complaint-intakes')
          .getPublicUrl(filePath);
          
        uploadedUrls.push(urlData.publicUrl);
        
      } catch (error) {
        console.error(`Upload failed for ${file.name}:`, error);
        errors.push(`Failed to upload ${file.name}`);
      }
    }

    return { uploadedUrls, errors };
  },

  generateFileUrl: (filePath) => {
    const { data } = supabase.storage
      .from('legal-complaint-intakes')
      .getPublicUrl(filePath);
    return data.publicUrl;
  },

  deleteFile: async (filePath) => {
    const { error } = await supabase.storage
      .from('legal-complaint-intakes')
      .remove([filePath]);
    return { error };
  }
};