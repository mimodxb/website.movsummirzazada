import React, { useState, useEffect } from 'react';
import { adminService } from '@/lib/adminService';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Loader2, Trash2, Edit2 } from 'lucide-react';
import AdminModal from './AdminModal';

const FeatureSlotsAdmin = () => {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSlot, setEditingSlot] = useState(null);
  const { toast } = useToast();
  
  // Options for dropdowns
  const [brands, setBrands] = useState([]);
  const [services, setServices] = useState([]);
  const [offers, setOffers] = useState([]);

  const fetchData = async () => {
    setLoading(true);
    const { data } = await adminService.getFeatureSlots();
    if (data) setSlots(data);
    
    // Fetch generic data for selection
    const { data: b } = await adminService.getBrands();
    const { data: s } = await adminService.getServices();
    const { data: o } = await adminService.getOffers();
    setBrands(b || []);
    setServices(s || []);
    setOffers(o || []);
    
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleEdit = (slotNum) => {
    const existing = slots.find(s => s.slot_number === slotNum);
    setEditingSlot({ slot_number: slotNum, ...existing });
    setModalOpen(true);
  };

  const handleSave = async (formData) => {
    const payload = {
      item_type: formData.item_type,
      item_id: formData.item_id,
      start_at: new Date().toISOString(), // Default to now
    };
    
    const { error } = await adminService.updateFeatureSlot(editingSlot.slot_number, payload);
    if (error) {
      toast({ variant: "destructive", title: "Error", description: error });
    } else {
      toast({ title: "Updated", description: `Slot ${editingSlot.slot_number} updated` });
      setModalOpen(false);
      fetchData();
    }
  };

  const handleClear = async (slotNum) => {
    if(window.confirm(`Clear slot ${slotNum}?`)) {
      await adminService.clearFeatureSlot(slotNum);
      fetchData();
    }
  };

  // Helper to generate dynamic options based on selected type
  const [selectedType, setSelectedType] = useState('brand');
  const getOptions = () => {
    if (selectedType === 'brand') return brands.map(i => ({ value: i.id, label: i.name }));
    if (selectedType === 'service') return services.map(i => ({ value: i.id, label: i.title }));
    if (selectedType === 'offer') return offers.map(i => ({ value: i.id, label: i.title || i.code }));
    return [];
  };

  const SlotCard = ({ number }) => {
    const slotData = slots.find(s => s.slot_number === number);
    
    return (
      <div className="bg-[#13251E] border border-[#E0A995]/20 rounded-xl p-6 flex flex-col gap-4 h-64 relative group">
         <div className="absolute top-4 left-4 font-mono text-4xl font-bold text-[#E0A995]/20">#{number}</div>
         
         {slotData ? (
           <div className="mt-8 flex-1">
             <div className="text-xs uppercase text-[#E0A995] mb-1">{slotData.item_type}</div>
             <div className="font-bold text-[#EBE8E3] text-lg truncate">
               {/* We don't have the name joined here, displaying ID or we could fetch it. 
                   For simplicity, just showing ID or Type+ID. In real app, we'd join.*/}
               Item ID: {slotData.item_id.substring(0,8)}...
             </div>
             <div className="text-xs text-[#A8B3AF] mt-2">Active since: {new Date(slotData.start_at).toLocaleDateString()}</div>
           </div>
         ) : (
           <div className="flex-1 flex items-center justify-center text-[#A8B3AF] mt-8">Empty Slot</div>
         )}
         
         <div className="flex gap-2 mt-auto">
           <Button onClick={() => handleEdit(number)} className="flex-1 bg-[#E0A995] text-[#0A1612]"><Edit2 className="w-4 h-4" /></Button>
           {slotData && (
             <Button onClick={() => handleClear(number)} className="flex-1 bg-red-500/20 text-red-500 hover:bg-red-500/30"><Trash2 className="w-4 h-4" /></Button>
           )}
         </div>
      </div>
    );
  };

  // Fields for modal
  const modalFields = [
    { name: 'item_type', label: 'Item Type', type: 'select', options: [{value:'brand',label:'Brand'},{value:'service',label:'Service'},{value:'offer',label:'Offer'}] },
    { name: 'item_id', label: 'Select Item', type: 'select', options: getOptions() }
  ];

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-[#E0A995]">Featured Slots Configuration</h2>
      
      {loading ? <Loader2 className="animate-spin" /> : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {[1,2,3,4,5].map(num => <SlotCard key={num} number={num} />)}
        </div>
      )}

      {/* Logic to update options when type changes in modal would require more complex state in AdminModal. 
          For this simplified version, we just render a custom modal content or assume user picks type then id. 
          The AdminModal is generic. Here we might need a custom one or just rely on IDs for now. 
          Actually, let's inject a custom renderer or just simpler logic.
      */}
      {modalOpen && (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
            <div className="bg-[#0F1C15] p-6 rounded-xl w-full max-w-md border border-[#E0A995]/20">
               <h3 className="text-xl font-bold text-[#EBE8E3] mb-4">Edit Slot #{editingSlot?.slot_number}</h3>
               <div className="space-y-4">
                  <div>
                    <label className="text-sm text-[#A8B3AF]">Type</label>
                    <select 
                      className="w-full bg-[#0A1612] border border-[#E0A995]/20 text-white p-2 rounded"
                      value={selectedType}
                      onChange={(e) => setSelectedType(e.target.value)}
                    >
                       <option value="brand">Brand</option>
                       <option value="service">Service</option>
                       <option value="offer">Offer</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm text-[#A8B3AF]">Item</label>
                    <select 
                      className="w-full bg-[#0A1612] border border-[#E0A995]/20 text-white p-2 rounded"
                      id="item-select"
                    >
                       {getOptions().map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                    </select>
                  </div>
                  <div className="flex gap-2 pt-4">
                    <Button onClick={() => setModalOpen(false)} variant="ghost" className="flex-1 text-white">Cancel</Button>
                    <Button onClick={() => {
                       const itemId = document.getElementById('item-select').value;
                       handleSave({ item_type: selectedType, item_id: itemId });
                    }} className="flex-1 bg-[#E0A995] text-[#0A1612]">Save</Button>
                  </div>
               </div>
            </div>
         </div>
      )}
    </div>
  );
};

export default FeatureSlotsAdmin;