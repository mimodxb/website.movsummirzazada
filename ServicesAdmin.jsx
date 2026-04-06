import React, { useState, useEffect } from 'react';
import { adminService } from '@/lib/adminService';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import AdminTable from './AdminTable';
import AdminModal from './AdminModal';
import ConfirmDialog from './ConfirmDialog';

const ServicesAdmin = () => {
  const [services, setServices] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [currentService, setCurrentService] = useState(null);
  const { toast } = useToast();

  const fetchData = async () => {
    setLoading(true);
    const { data: serviceData } = await adminService.getServices();
    const { data: brandData } = await adminService.getBrands();
    if (serviceData) setServices(serviceData);
    if (brandData) setBrands(brandData);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleSave = async (formData) => {
    setLoading(true);
    let res;
    if (currentService) {
      res = await adminService.updateService(currentService.id, formData);
    } else {
      res = await adminService.createService(formData);
    }

    if (res.error) {
      toast({ variant: "destructive", title: "Error", description: res.error });
    } else {
      toast({ title: "Success", description: "Service saved" });
      setModalOpen(false);
      fetchData();
    }
    setLoading(false);
  };

  const handleConfirmDelete = async () => {
    const { error } = await adminService.deleteService(currentService.id);
    if (!error) {
      toast({ title: "Deleted", description: "Service removed" });
      fetchData();
    }
    setConfirmOpen(false);
  };

  const columns = [
    { key: 'title', label: 'Title' },
    { key: 'brand', label: 'Brand', render: r => r.brands?.name || '-' },
    { key: 'price', label: 'Price', render: r => `${r.currency || '$'} ${r.price}` },
    { key: 'is_active', label: 'Active', render: r => r.is_active ? 'Yes' : 'No' }
  ];

  const modalFields = [
    { name: 'title', label: 'Service Title', required: true },
    { name: 'brand_id', label: 'Brand', type: 'select', options: brands.map(b => ({ value: b.id, label: b.name })) },
    { name: 'description', label: 'Description', type: 'textarea' },
    { name: 'price', label: 'Price', type: 'number' },
    { name: 'currency', label: 'Currency', type: 'select', options: [{value:'USD',label:'USD'}, {value:'AED',label:'AED'}, {value:'EUR',label:'EUR'}] },
    { name: 'category', label: 'Category', type: 'select', options: [{value:'general',label:'General'}, {value:'partner',label:'Partner'}, {value:'collaboration_personal',label:'Collab (Personal)'}, {value:'collaboration_global',label:'Collab (Global)'}] },
    { name: 'is_active', label: 'Available', type: 'checkbox' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-[#E0A995]">Services</h2>
        <Button onClick={() => { setCurrentService(null); setModalOpen(true); }} className="bg-[#E0A995] text-[#0A1612]">
          <Plus className="w-4 h-4 mr-2" /> Add Service
        </Button>
      </div>

      <AdminTable columns={columns} data={services} isLoading={loading} onEdit={(r) => { setCurrentService(r); setModalOpen(true); }} onDelete={(r) => { setCurrentService(r); setConfirmOpen(true); }} />

      <AdminModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        title={currentService ? "Edit Service" : "New Service"} 
        fields={modalFields} 
        initialData={currentService} 
        onSubmit={handleSave} 
      />

      <ConfirmDialog 
        isOpen={confirmOpen} 
        onClose={() => setConfirmOpen(false)} 
        onConfirm={handleConfirmDelete} 
        title="Delete Service?" 
        message="Are you sure?" 
      />
    </div>
  );
};

export default ServicesAdmin;