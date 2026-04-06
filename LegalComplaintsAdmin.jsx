import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import AdminTable from '@/components/admin/AdminTable';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { format } from 'date-fns';

const LegalComplaintsAdmin = () => {
  const [complaints, setComplaints] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const { toast } = useToast();

  const fetchComplaints = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('legal_complaint_intakes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setComplaints(data || []);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error fetching complaints",
        description: error.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const handleDeleteClick = (complaint) => {
    setSelectedComplaint(complaint);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedComplaint) return;
    
    try {
      const { error } = await supabase
        .from('legal_complaint_intakes')
        .delete()
        .eq('id', selectedComplaint.id);

      if (error) throw error;

      toast({
        title: "Complaint deleted",
        description: "The record has been successfully removed."
      });
      fetchComplaints();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error deleting complaint",
        description: error.message
      });
    } finally {
      setDeleteConfirmOpen(false);
      setSelectedComplaint(null);
    }
  };

  const columns = [
    { key: 'reference_id', label: 'Reference ID' },
    { 
      key: 'status', 
      label: 'Status',
      render: (value) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          value === 'completed' ? 'bg-green-500/20 text-green-400' :
          value === 'in_progress' ? 'bg-blue-500/20 text-blue-400' :
          'bg-yellow-500/20 text-yellow-400'
        }`}>
          {value?.replace('_', ' ').toUpperCase() || 'PENDING'}
        </span>
      )
    },
    { key: 'issue_type', label: 'Type' },
    { 
      key: 'created_at', 
      label: 'Date',
      render: (value) => value ? format(new Date(value), 'PPP') : '-'
    }
  ];

  const actions = (row) => (
    <Button 
      variant="ghost" 
      size="sm" 
      className="text-blue-400 hover:text-blue-300 hover:bg-blue-900/20"
      onClick={() => window.open(`/admin/case-deliverables?id=${row.id}`, '_blank')}
    >
      <Eye className="w-4 h-4 mr-1" /> View
    </Button>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-[#EBE8E3]">Legal Complaints</h2>
        <Button onClick={fetchComplaints} variant="outline" className="border-[#E0A995]/20 text-[#E0A995] hover:bg-[#E0A995]/10">
          Refresh
        </Button>
      </div>

      <AdminTable 
        columns={columns} 
        rows={complaints} 
        isLoading={isLoading}
        onDelete={handleDeleteClick}
        actions={actions}
      />

      <ConfirmDialog 
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Complaint Record"
        message={`Are you sure you want to delete complaint ${selectedComplaint?.reference_id}? This action cannot be undone.`}
      />
    </div>
  );
};

export default LegalComplaintsAdmin;