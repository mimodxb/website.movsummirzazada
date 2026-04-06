import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Send, FileText, Download, Loader2, RefreshCw, Eye, Sparkles, Check, X, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { caseSchemaService } from '@/lib/caseSchemaService';
import { caseDeliverableService } from '@/lib/caseDeliverableService';
import { caseFileService } from '@/lib/caseFileService';
import { pdfService } from '@/lib/pdfService';
import { supabase } from '@/lib/customSupabaseClient';
import CaseDocumentRenderer from '@/components/CaseDocumentRenderer';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { aiCaseStructuringService } from '@/lib/aiCaseStructuringService';
import { aiValidation } from '@/lib/aiValidation';

const AIFieldControl = ({ fieldName, label, value, onChange, onAutoGenerate, isGenerating }) => {
  const [suggestion, setSuggestion] = useState(null);
  const { toast } = useToast();

  const handleGenerate = async () => {
    try {
      const result = await onAutoGenerate();
      if (result.success) {
        setSuggestion(result.content);
        // Optional validation
        const check = aiValidation.validateAIOutput(fieldName, result.content);
        if (!check.valid) {
          toast({ variant: "destructive", title: "Low Quality AI Output", description: check.issues.join(', ') });
        } else {
          toast({ title: "AI Generated", description: "Suggestion ready for review." });
        }
      } else {
        // Fallback
        toast({ variant: "destructive", title: "AI Error", description: "Using fallback template." });
        setSuggestion(aiCaseStructuringService.fallbacks[fieldName] ? aiCaseStructuringService.fallbacks[fieldName]() : "Fallback content");
      }
    } catch (e) {
      console.error(e);
      toast({ variant: "destructive", title: "Error", description: "Generation failed." });
    }
  };

  const acceptSuggestion = () => {
    onChange(suggestion);
    setSuggestion(null);
  };

  return (
    <div className="mb-6 border border-[#E0A995]/10 rounded-lg p-4 bg-[#13251E]/50">
      <div className="flex justify-between items-center mb-2">
        <label className="block text-sm font-medium text-[#E0A995]">{label}</label>
        <div className="flex gap-2">
           {isGenerating ? (
             <span className="flex items-center text-xs text-blue-400">
               <Loader2 className="w-3 h-3 animate-spin mr-1" /> AI Processing...
             </span>
           ) : (
             <Button 
               variant="ghost" 
               size="sm" 
               onClick={handleGenerate}
               className="h-7 text-xs text-blue-300 hover:text-blue-100 hover:bg-blue-900/20"
             >
               <Sparkles className="w-3 h-3 mr-1" /> {value ? 'Regenerate AI' : 'AI Assist'}
             </Button>
           )}
        </div>
      </div>
      
      {/* Suggestion Preview */}
      {suggestion && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }} 
          animate={{ opacity: 1, height: 'auto' }}
          className="mb-3 bg-blue-950/30 border border-blue-500/30 rounded p-3"
        >
          <div className="flex justify-between items-start mb-2">
             <span className="text-xs font-bold text-blue-400 uppercase">AI Suggestion</span>
             <div className="flex gap-1">
                <Button size="sm" variant="ghost" onClick={acceptSuggestion} className="h-6 w-6 p-0 bg-green-900/50 hover:bg-green-800 text-green-300">
                  <Check className="w-3 h-3" />
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setSuggestion(null)} className="h-6 w-6 p-0 bg-red-900/50 hover:bg-red-800 text-red-300">
                  <X className="w-3 h-3" />
                </Button>
             </div>
          </div>
          <div className="text-xs text-gray-300 max-h-32 overflow-y-auto whitespace-pre-wrap">
            {suggestion}
          </div>
        </motion.div>
      )}

      <Textarea 
        value={value || ''} 
        onChange={(e) => onChange(e.target.value)}
        className="h-32 bg-[#0A1612] border-[#333] focus:border-[#E0A995]/50" 
      />
    </div>
  );
};

const CaseDeliverableEditor = ({ deliverable, intakeId, conversationId, onSave, onCancel }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [generatingPdf, setGeneratingPdf] = useState(false);
  const [schema, setSchema] = useState(deliverable?.case_schema || null);
  const [activeTab, setActiveTab] = useState('edit');
  const [processingField, setProcessingField] = useState(null);

  useEffect(() => {
    if (deliverable && !schema && deliverable.case_schema) {
      setSchema(deliverable.case_schema);
    }
  }, [deliverable]);

  const handleSchemaChange = (field, value) => {
    setSchema(prev => ({ ...prev, [field]: value }));
  };

  const generateField = async (field, generatorFn) => {
    setProcessingField(field);
    const result = await generatorFn();
    setProcessingField(null);
    return result;
  };

  const handleSave = async (status) => {
    if (!schema) return;
    setLoading(true);
    try {
      await caseSchemaService.saveCaseSchema(deliverable.id, schema);
      
      let fileData = {};
      if (status === 'delivered' || generatingPdf) {
         setGeneratingPdf(true);
         const pdfBlob = await pdfService.generateCasePDFFromSchema(schema);
         const uploadResult = await caseFileService.uploadCasePDF(pdfBlob, intakeId);
         const publicUrl = caseFileService.generateFileUrl(uploadResult.filePath);
         fileData = { file_url: publicUrl, file_name: uploadResult.fileName, file_size: uploadResult.fileSize };
         setGeneratingPdf(false);
      }

      const payload = {
        case_title: `Case ${schema.case_id || intakeId}`,
        ...fileData,
        delivery_status: status
      };

      if (status === 'delivered') {
          await caseDeliverableService.markAsDelivered(deliverable.id);
          // Email logic here...
      }

      await caseDeliverableService.updateCaseDeliverable(deliverable.id, payload);
      toast({ title: "Success", description: `Case ${status === 'delivered' ? 'Delivered' : 'Saved'}` });
      onSave({ ...deliverable, ...payload, case_schema: schema });

    } catch (error) {
      console.error(error);
      toast({ variant: "destructive", title: "Error", description: error.message });
      setGeneratingPdf(false);
    } finally {
      setLoading(false);
    }
  };

  if (!schema) return <div className="p-8">Loading Schema...</div>;

  return (
    <div className="bg-[#0F1C15] p-6 rounded-xl border border-[#E0A995]/20 h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-[#E0A995]">Case Editor: {schema.case_id}</h2>
        <div className="flex gap-2">
           <Dialog>
            <DialogTrigger asChild><Button variant="outline" size="sm"><Eye className="w-4 h-4 mr-2" /> Preview</Button></DialogTrigger>
            <DialogContent className="max-w-[850px] max-h-[90vh] overflow-y-auto bg-white text-black p-0"><CaseDocumentRenderer schema={schema} /></DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
        <TabsList className="bg-[#13251E] mb-4">
          <TabsTrigger value="edit">Edit Content</TabsTrigger>
          <TabsTrigger value="intake">Intake Data</TabsTrigger>
        </TabsList>

        <TabsContent value="edit" className="flex-1 overflow-y-auto pr-2 space-y-2">
          
          <AIFieldControl 
            fieldName="normalized_summary"
            label="1. Executive Summary"
            value={schema.normalized_summary}
            onChange={(v) => handleSchemaChange('normalized_summary', v)}
            isGenerating={processingField === 'normalized_summary'}
            onAutoGenerate={() => generateField('normalized_summary', () => aiCaseStructuringService.generateNormalizedSummary(deliverable.id, schema.case_overview))}
          />

          <AIFieldControl 
            fieldName="event_description_structured"
            label="2. Chronology"
            value={schema.event_description_structured}
            onChange={(v) => handleSchemaChange('event_description_structured', v)}
            isGenerating={processingField === 'event_description_structured'}
            onAutoGenerate={() => generateField('event_description_structured', () => aiCaseStructuringService.generateStructuredEventDescriptions(deliverable.id, schema.case_overview))} 
          />
          
          <AIFieldControl 
            fieldName="structured_issue_statement"
            label="3. Core Legal/Service Issue"
            value={schema.structured_issue_statement}
            onChange={(v) => handleSchemaChange('structured_issue_statement', v)}
            isGenerating={processingField === 'structured_issue_statement'}
            onAutoGenerate={() => generateField('structured_issue_statement', () => aiCaseStructuringService.generateStructuredIssueStatement(deliverable.id, schema.case_overview, "See Intake", "See Evidence"))}
          />
          
           <AIFieldControl 
            fieldName="escalation_guidance"
            label="5. Escalation Guidance"
            value={schema.escalation_guidance}
            onChange={(v) => handleSchemaChange('escalation_guidance', v)}
            isGenerating={processingField === 'escalation_guidance'}
            onAutoGenerate={() => generateField('escalation_guidance', () => aiCaseStructuringService.generateEscalationGuidance(deliverable.id, "General", "Company", "Unknown"))}
          />

          <AIFieldControl 
            fieldName="closing_statement"
            label="6. Closing Statement"
            value={schema.closing_statement}
            onChange={(v) => handleSchemaChange('closing_statement', v)}
            isGenerating={processingField === 'closing_statement'}
            onAutoGenerate={() => generateField('closing_statement', () => aiCaseStructuringService.generateClosingStatement(deliverable.id))}
          />

        </TabsContent>

        <TabsContent value="intake" className="flex-1 overflow-y-auto pr-2">
           <div className="bg-[#13251E] p-4 rounded mb-4">
              <h3 className="font-bold text-[#E0A995] mb-2">Original Intake Description</h3>
              <p className="text-sm text-[#A8B3AF] whitespace-pre-wrap">{schema.case_overview}</p>
           </div>
        </TabsContent>
      </Tabs>

      <div className="mt-6 flex justify-between items-center pt-4 border-t border-[#E0A995]/10">
        <Button variant="ghost" onClick={onCancel}>Cancel</Button>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => handleSave('draft')} disabled={loading}>
            <Save className="w-4 h-4 mr-2" /> Save Draft
          </Button>
          <Button onClick={() => handleSave('delivered')} disabled={loading} className="bg-[#E0A995] text-[#0A1612] hover:bg-[#D49A89]">
            {loading || generatingPdf ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Send className="w-4 h-4 mr-2" />}
            Deliver
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CaseDeliverableEditor;