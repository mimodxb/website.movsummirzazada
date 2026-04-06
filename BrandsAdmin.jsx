import React, { useState, useEffect } from 'react';
import { adminService } from '@/lib/adminService';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import AdminTable from './AdminTable';
import AdminModal from './AdminModal';
import ConfirmDialog from './ConfirmDialog';

const BrandsAdmin = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [currentBrand, setCurrentBrand] = useState(null);
  const [partners, setPartners] = useState([]);
  const { toast } = useToast();

  const fetchBrands = async () => {
    setLoading(true);
    const { data } = await adminService.getBrands();
    const { data: partnersData } = await adminService.getPartners();
    if (data) setBrands(data);
    if (partnersData) setPartners(partnersData);
    setLoading(false);
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const handleCreate = () => {
    setCurrentBrand(null);
    setModalOpen(true);
  };

  const handleEdit = (brand) => {
    setCurrentBrand(brand);
    setModalOpen(true);
  };

  const handleDeleteClick = (brand) => {
    setCurrentBrand(brand);
    setConfirmOpen(true);
  };

  const handleSave = async (formData) => {
    setLoading(true);
    const payload = {
      ...formData,
      is_featured: formData.is_featured === true, // ensure bool
      feature_slot: formData.feature_slot ? parseInt(formData.feature_slot) : null
    };

    let res;
    if (currentBrand) {
      res = await adminService.updateBrand(currentBrand.id, payload);
    } else {
      res = await adminService.createBrand(payload);
    }

    if (res.error) {
      toast({ variant: "destructive", title: "Error", description: res.error });
    } else {
      toast({ title: "Success", description: `Brand ${currentBrand ? 'updated' : 'created'} successfully` });
      setModalOpen(false);
      fetchBrands();
    }
    setLoading(false);
  };

  const handleConfirmDelete = async () => {
    const { error } = await adminService.deleteBrand(currentBrand.id);
    if (error) {
      toast({ variant: "destructive", title: "Error", description: error });
    } else {
      toast({ title: "Success", description: "Brand deleted" });
      fetchBrands();
    }
    setConfirmOpen(false);
  };

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'partner_name', label: 'Partner', render: (row) => row.partners?.business_name || '-' },
    { key: 'is_featured', label: 'Featured', render: (row) => row.is_featured ? 'Yes' : 'No' },
    { key: 'feature_slot', label: 'Slot', render: (row) => row.feature_slot || '-' },
  ];

  const modalFields = [
    { name: 'name', label: 'Brand Name', required: true },
    { name: 'partner_id', label: 'Partner', type: 'select', options: partners.map(p => ({ value: p.id, label: p.business_name })) },
    { name: 'logo_url', label: 'Logo URL' },
    { name: 'description', label: 'Description', type: 'textarea' },
    { name: 'is_featured', label: 'Featured', type: 'checkbox' },
    { name: 'feature_slot', label: 'Feature Slot (1-5)', type: 'number' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-[#E0A995]">Brands Management</h2>
        <Button onClick={handleCreate} className="bg-[#E0A995] text-[#0A1612] hover:bg-[#D49A89]">
          <Plus className="w-4 h-4 mr-2" /> Add Brand
        </Button>
      </div>

      <AdminTable 
        columns={columns} 
        data={brands} 
        isLoading={loading}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
      />

      <AdminModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={currentBrand ? 'Edit Brand' : 'Create Brand'}
        fields={modalFields}
        initialData={currentBrand}
        onSubmit={handleSave}
        isLoading={loading}
      />

      <ConfirmDialog
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Brand?"
        message={`Are you sure you want to delete ${currentBrand?.name}? This cannot be undone.`}
      />
    </div>
  );
};

export default BrandsAdmin;