import React, { useState, useEffect } from 'react';
import { adminService } from '@/lib/adminService';
import { Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AdminTable from './AdminTable';

const OrdersAdmin = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data } = await adminService.getOrders();
      if (data) setOrders(data);
      setLoading(false);
    };
    load();
  }, []);

  const columns = [
    { key: 'id', label: 'Order ID', render: r => r.id.substring(0,8) + '...' },
    { key: 'customer_email', label: 'Customer' },
    { key: 'total_amount', label: 'Total', render: r => `${r.currency} ${r.total_amount}` },
    { key: 'status', label: 'Status', render: r => (
      <span className={`px-2 py-1 rounded text-xs ${r.status === 'paid' ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'}`}>
        {r.status}
      </span>
    )},
    { key: 'created_at', label: 'Date', render: r => new Date(r.created_at).toLocaleDateString() }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-[#E0A995]">Orders</h2>
      <AdminTable columns={columns} data={orders} isLoading={loading} />
    </div>
  );
};

export default OrdersAdmin;