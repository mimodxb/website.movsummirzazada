import React, { useState, useEffect } from 'react';
import { adminService } from '@/lib/adminService';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import AdminTable from './AdminTable';
import { useToast } from '@/components/ui/use-toast';

const InquiriesAdmin = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const load = async () => {
    setLoading(true);
    const { data } = await adminService.getInquiries();
    if (data) setInquiries(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const markContacted = async (id) => {
    const { error } = await adminService.updateInquiryStatus(id, 'contacted');
    if (!error) {
      toast({ title: "Updated", description: "Inquiry marked as contacted" });
      load();
    }
  };

  const columns = [
    { key: 'created_at', label: 'Date', render: r => new Date(r.created_at).toLocaleDateString() },
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'preferred_contact_method', label: 'Method' },
    { key: 'status', label: 'Status', render: r => (
        <span className={`px-2 py-1 rounded text-xs ${r.status === 'contacted' ? 'bg-green-500/20 text-green-500' : 'bg-blue-500/20 text-blue-500'}`}>
          {r.status || 'new'}
        </span>
    )},
    { key: 'actions', label: 'Actions', render: r => (
        r.status !== 'contacted' && (
          <Button size="sm" onClick={() => markContacted(r.id)} className="bg-[#E0A995] text-[#0A1612]">
            <Check className="w-4 h-4 mr-2" /> Mark Contacted
          </Button>
        )
    )}
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-[#E0A995]">Inquiries</h2>
      <AdminTable columns={columns} data={inquiries} isLoading={loading} />
    </div>
  );
};

export default InquiriesAdmin;