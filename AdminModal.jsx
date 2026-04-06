import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label'; // Assuming Label is typically available, otherwise standard label tag works

const AdminModal = ({ isOpen, onClose, title, fields = [], onSubmit, initialData = {} }) => {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (isOpen) {
      // Initialize form data from initialData or defaults
      const initial = {};
      fields.forEach(field => {
        initial[field.name] = initialData[field.name] !== undefined ? initialData[field.name] : '';
      });
      setFormData(initial);
    }
  }, [isOpen, initialData, fields]);

  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-[#0A1612] border-[#E0A995]/20 text-[#EBE8E3]">
        <DialogHeader>
          <DialogTitle className="text-[#E0A995] font-serif">{title}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          {fields.map((field) => (
            <div key={field.name} className="grid w-full gap-1.5">
              {field.type !== 'checkbox' && (
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-[#A8B3AF]">
                  {field.label}
                </label>
              )}
              
              {field.type === 'textarea' ? (
                <Textarea
                  value={formData[field.name] || ''}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  className="bg-[#13251E] border-[#E0A995]/20 text-[#EBE8E3]"
                  rows={4}
                />
              ) : field.type === 'checkbox' ? (
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id={field.name}
                    checked={formData[field.name] || false}
                    onCheckedChange={(checked) => handleChange(field.name, checked)}
                    className="border-[#E0A995]/50 data-[state=checked]:bg-[#E0A995] data-[state=checked]:text-[#0A1612]"
                  />
                  <label
                    htmlFor={field.name}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-[#A8B3AF]"
                  >
                    {field.label}
                  </label>
                </div>
              ) : (
                <Input
                  type={field.type || 'text'}
                  value={formData[field.name] || ''}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  className="bg-[#13251E] border-[#E0A995]/20 text-[#EBE8E3]"
                />
              )}
            </div>
          ))}
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} className="border-[#E0A995]/20 text-[#A8B3AF] hover:bg-[#E0A995]/10">
              Cancel
            </Button>
            <Button type="submit" className="bg-[#E0A995] text-[#0A1612] hover:bg-[#D49A89]">
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AdminModal;