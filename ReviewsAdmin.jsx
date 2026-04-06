import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';
import AdminTable from './AdminTable';
import { useToast } from '@/components/ui/use-toast';

const ReviewsAdmin = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchReviews = async () => {
    setLoading(true);
    const { data } = await supabase.from('reviews').select('*').order('created_at', { ascending: false });
    if (data) setReviews(data);
    setLoading(false);
  };

  useEffect(() => { fetchReviews(); }, []);

  const updateStatus = async (id, status) => {
    const { error } = await supabase.from('reviews').update({ status }).eq('id', id);
    if (!error) {
      toast({ title: "Updated", description: `Review ${status}` });
      fetchReviews();
    }
  };

  const columns = [
    { key: 'rating', label: 'Rating', render: r => '★'.repeat(r.rating) },
    { key: 'title', label: 'Title' },
    { key: 'name', label: 'Author', render: r => r.name || r.email || 'Anonymous' },
    { key: 'status', label: 'Status', render: r => (
      <span className={`px-2 py-1 rounded text-xs ${
        r.status === 'approved' ? 'bg-green-500/20 text-green-500' : 
        r.status === 'rejected' ? 'bg-red-500/20 text-red-500' : 'bg-yellow-500/20 text-yellow-500'
      }`}>
        {r.status}
      </span>
    )},
    { key: 'actions', label: 'Actions', render: r => r.status === 'pending' && (
      <div className="flex gap-2">
        <Button size="sm" onClick={() => updateStatus(r.id, 'approved')} className="bg-green-600 hover:bg-green-700 text-white"><Check className="w-4 h-4" /></Button>
        <Button size="sm" onClick={() => updateStatus(r.id, 'rejected')} className="bg-red-600 hover:bg-red-700 text-white"><X className="w-4 h-4" /></Button>
      </div>
    )}
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-[#E0A995]">Review Moderation</h2>
      <AdminTable columns={columns} data={reviews} isLoading={loading} onDelete={async (r) => {
        if(confirm("Delete review?")) { await supabase.from('reviews').delete().eq('id', r.id); fetchReviews(); }
      }} />
    </div>
  );
};

export default ReviewsAdmin;