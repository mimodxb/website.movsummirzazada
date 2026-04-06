import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search, Eye, FileText, CheckCircle2, FileJson, Sparkles, AlertCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import CaseDeliverableEditor from './CaseDeliverableEditor';
import { useToast } from '@/components/ui/use-toast';
import { caseSchemaService } from '@/lib/caseSchemaService';

const CaseDeliverablesAdmin = () => {
  const [deliverables, setDeliverables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingDeliverable, setEditingDeliverable] = useState(null);
  const [showEditor, setShowEditor] = useState(false);
  const { toast } = useToast();

  const fetchDeliverables = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('case_deliverables')
        .select(`
          *,
          conversations (client_name, subject, client_email),
          legal_complaint_intakes (reference_id)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDeliverables(data);
    } catch (error) {
      console.error(error);
      toast({ variant: "destructive", title: "Error", description: "Failed to load deliverables" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDeliverables(); }, []);

  const handleEdit = (deliverable) => {
    setEditingDeliverable(deliverable);
    setShowEditor(true);
  };

  const handleCloseEditor = (result) => {
    setShowEditor(false);
    setEditingDeliverable(null);
    if (result) fetchDeliverables();
  };
  
  const filteredItems = deliverables.filter(item => {
    const matchesStatus = filterStatus === 'all' || item.delivery_status === filterStatus;
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      item.case_title?.toLowerCase().includes(searchLower) ||
      item.conversations?.client_name?.toLowerCase().includes(searchLower) ||
      item.legal_complaint_intakes?.reference_id?.toLowerCase().includes(searchLower);
    
    return matchesStatus && matchesSearch;
  });

  if (showEditor && editingDeliverable) {
    return (
      <CaseDeliverableEditor 
        deliverable={editingDeliverable}
        intakeId={editingDeliverable.intake_id}
        conversationId={editingDeliverable.conversation_id}
        onSave={handleCloseEditor}
        onCancel={() => handleCloseEditor(null)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4 flex-1 w-full">
          <Input 
            placeholder="Search clients..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-xs bg-[#13251E] border-[#E0A995]/20"
          />
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[180px] bg-[#13251E] border-[#E0A995]/20">
              <SelectValue placeholder="Filter Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="bg-[#0F1C15] rounded-xl border border-[#E0A995]/10 overflow-hidden">
        <Table>
          <TableHeader className="bg-[#13251E]">
            <TableRow>
              <TableHead className="text-[#E0A995]">Reference</TableHead>
              <TableHead className="text-[#E0A995]">Client</TableHead>
              <TableHead className="text-[#E0A995]">Status</TableHead>
              <TableHead className="text-[#E0A995]">AI Status</TableHead>
              <TableHead className="text-right text-[#E0A995]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={5} className="text-center py-8">Loading...</TableCell></TableRow>
            ) : filteredItems.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="text-center py-8">No items.</TableCell></TableRow>
            ) : (
              filteredItems.map((item) => (
                <TableRow key={item.id} className="border-b border-[#E0A995]/5 hover:bg-[#13251E]/50">
                  <TableCell className="font-mono text-xs">{item.legal_complaint_intakes?.reference_id || 'N/A'}</TableCell>
                  <TableCell>
                     <div>{item.conversations?.client_name || 'Unknown'}</div>
                     <div className="text-[10px] text-[#A8B3AF]">{item.case_title}</div>
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-[10px] uppercase font-bold ${
                      item.delivery_status === 'delivered' ? 'bg-green-500/20 text-green-500' : 'bg-gray-500/20 text-gray-500'
                    }`}>
                      {item.delivery_status}
                    </span>
                  </TableCell>
                  <TableCell>
                    {item.ai_processing_status === 'completed' ? (
                       <span className="flex items-center gap-1 text-xs text-blue-400"><Sparkles className="w-3 h-3" /> AI Ready</span>
                    ) : (
                       <span className="text-xs text-gray-500">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(item)}><Eye className="w-4 h-4" /></Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default CaseDeliverablesAdmin;