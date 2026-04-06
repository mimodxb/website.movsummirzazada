import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { Button } from '@/components/ui/button';
import { Plus, Download, QrCode } from 'lucide-react';
import AdminTable from './AdminTable';
import AdminModal from './AdminModal';
import { qrCodeService } from '@/lib/qrCodeService';
import { useToast } from '@/components/ui/use-toast';

const VouchersAdmin = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentCoupon, setCurrentCoupon] = useState(null);
  const { toast } = useToast();

  const fetchCoupons = async () => {
    setLoading(true);
    const { data } = await supabase.from('coupons').select('*');
    if (data) setCoupons(data);
    setLoading(false);
  };

  useEffect(() => { fetchCoupons(); }, []);

  const handleSave = async (formData) => {
    const payload = { ...formData, active: formData.active === true };
    const { error } = currentCoupon
      ? await supabase.from('coupons').update(payload).eq('id', currentCoupon.id)
      : await supabase.from('coupons').insert([payload]);

    if (error) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    } else {
      toast({ title: "Success", description: "Coupon saved" });
      setModalOpen(false);
      fetchCoupons();
    }
  };

  const handleDownloadQR = (code) => {
    qrCodeService.downloadQRCode(code, `coupon-${code}.png`);
  };

  const columns = [
    { key: 'code', label: 'Code' },
    { key: 'discount_type', label: 'Type' },
    { key: 'discount_value', label: 'Value' },
    { key: 'usage', label: 'Usage', render: r => `${r.usage_count} / ${r.max_usage || '∞'}` },
    { key: 'expires_at', label: 'Expires', render: r => r.expires_at ? new Date(r.expires_at).toLocaleDateString() : 'Never' },
    { key: 'actions', label: 'QR', render: r => (
      <Button variant="ghost" size="sm" onClick={() => handleDownloadQR(r.code)} className="text-[#E0A995]">
        <QrCode className="w-4 h-4 mr-2" /> Save QR
      </Button>
    )}
  ];

  const fields = [
    { name: 'code', label: 'Code', required: true },
    { name: 'discount_type', label: 'Type', type: 'select', options: [{value:'percent',label:'Percent'},{value:'fixed',label:'Fixed Amount'}] },
    { name: 'discount_value', label: 'Value', type: 'number', required: true },
    { name: 'max_usage', label: 'Max Usage (0 for unlimited)', type: 'number' },
    { name: 'expires_at', label: 'Expiration Date', type: 'date' },
    { name: 'active', label: 'Active', type: 'checkbox' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-[#E0A995]">Coupons Management</h2>
        <Button onClick={() => { setCurrentCoupon(null); setModalOpen(true); }} className="bg-[#E0A995] text-[#0A1612]">
          <Plus className="w-4 h-4 mr-2" /> Create Coupon
        </Button>
      </div>

      <AdminTable 
        columns={columns} 
        data={coupons} 
        isLoading={loading} 
        onEdit={(r) => { setCurrentCoupon(r); setModalOpen(true); }}
        onDelete={async (r) => {
          if(confirm('Delete coupon?')) {
            await supabase.from('coupons').delete().eq('id', r.id);
            fetchCoupons();
          }
        }}
      />

      <AdminModal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Coupon Details" fields={fields} initialData={currentCoupon} onSubmit={handleSave} />
    </div>
  );
};

export default VouchersAdmin;