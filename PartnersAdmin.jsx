import React, { useState, useEffect } from 'react';
import { adminService } from '@/lib/adminService';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';
import AdminTable from './AdminTable';
import ConfirmDialog from './ConfirmDialog';

const PartnersAdmin = () => {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchData = async () => {
    setLoading(true);
    const { data } = await adminService.getPartners();
    if (data) setPartners(data);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleApprove = async (id) => {
    const { error } = await adminService.approvePartner(id);
    if (!error) {
      toast({ title: "Approved", description: "Partner successfully approved" });
      fetchData();
    }
  };

  const handleDecline = async (id) => {
    if (window.confirm("Are you sure you want to decline and remove this partner application?")) {
      const { error } = await adminService.deletePartner(id);
      if (!error) {
        toast({ title: "Declined", description: "Partner application removed" });
        fetchData();
      }
    }
  };

  const pending = partners.filter(p => p.status !== 'approved');
  const approved = partners.filter(p => p.status === 'approved');

  const pendingColumns = [
    { key: 'business_name', label: 'Business Name' },
    { key: 'contact_email', label: 'Email' },
    { key: 'actions', label: 'Actions', render: (row) => (
      <div className="flex gap-2 justify-end">
        <Button size="sm" onClick={() => handleApprove(row.id)} className="bg-green-600 hover:bg-green-700 text-white"><Check className="w-4 h-4" /></Button>
        <Button size="sm" onClick={() => handleDecline(row.id)} className="bg-red-600 hover:bg-red-700 text-white"><X className="w-4 h-4" /></Button>
      </div>
    )}
  ];

  const approvedColumns = [
    { key: 'business_name', label: 'Business Name' },
    { key: 'contact_email', label: 'Email' },
    { key: 'status', label: 'Status' }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-[#E0A995] mb-4">Pending Applications ({pending.length})</h2>
        <AdminTable columns={pendingColumns} data={pending} isLoading={loading} emptyMessage="No pending partners" />
      </div>

      <div>
        <h2 className="text-xl font-bold text-[#E0A995] mb-4">Approved Partners</h2>
        <AdminTable columns={approvedColumns} data={approved} isLoading={loading} onDelete={async (row) => {
             if(window.confirm("Delete partner?")) {
                 await adminService.deletePartner(row.id);
                 fetchData();
             }
        }} />
      </div>
    </div>
  );
};

export default PartnersAdmin;