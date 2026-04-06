import React, { useState, useEffect } from 'react';
import { adminService } from '@/lib/adminService';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import AdminTable from './AdminTable';
import AdminModal from './AdminModal';
import ConfirmDialog from './ConfirmDialog';

const OffersAdmin = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentOffer, setCurrentOffer] = useState(null);
  const { toast } = useToast();

  const fetchOffers = async () => {
    setLoading(true);
    const { data } = await adminService.getOffers();
    if (data) setOffers(data);
    setLoading(false);
  };

  useEffect(() => { fetchOffers(); }, []);

  const handleSave = async (formData) => {
    const payload = { ...formData, is_active: formData.is_active === true };
    const { error } = currentOffer 
      ? await adminService.updateOffer(currentOffer.id, payload)
      : await adminService.createOffer(payload);
    
    if (error) {
      toast({ variant: "destructive", title: "Error", description: error });
    } else {
      toast({ title: "Success", description: "Offer saved" });
      setModalOpen(false);
      fetchOffers();
    }
  };

  const columns = [
    { key: 'code', label: 'Code' },
    { key: 'type', label: 'Type' },
    { key: 'discount_value', label: 'Value' },
    { key: 'usage_count', label: 'Used', render: r => `${r.usage_count || 0} / ${r.usage_limit || '∞'}` },
    { key: 'is_active', label: 'Active', render: r => r.is_active ? 'Yes' : 'No' }
  ];

  const modalFields = [
    { name: 'title', label: 'Title', required: true },
    { name: 'type', label: 'Type', type: 'select', options: ['discount', 'voucher', 'ticket', 'gift', 'free_trial'].map(t => ({value:t, label:t})) },
    { name: 'code', label: 'Code', required: true },
    { name: 'discount_value', label: 'Value (e.g. 20% or $50)', required: true },
    { name: 'description', label: 'Description', type: 'textarea' },
    { name: 'usage_limit', label: 'Max Usage Limit', type: 'number' },
    { name: 'is_active', label: 'Active', type: 'checkbox' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-[#E0A995]">Offers & Coupons</h2>
        <Button onClick={() => { setCurrentOffer(null); setModalOpen(true); }} className="bg-[#E0A995] text-[#0A1612]">
          <Plus className="w-4 h-4 mr-2" /> Create Offer
        </Button>
      </div>

      <AdminTable columns={columns} data={offers} isLoading={loading} onEdit={(r) => { setCurrentOffer(r); setModalOpen(true); }} onDelete={async (r) => {
          if(window.confirm("Delete offer?")) { await adminService.deleteOffer(r.id); fetchOffers(); }
      }} />

      <AdminModal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Offer Details" fields={modalFields} initialData={currentOffer} onSubmit={handleSave} />
    </div>
  );
};

export default OffersAdmin;