import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../api/client';
import { FormEvent, useState } from 'react';

interface PaymentMethod {
  id: string;
  type: string;
  label: string;
  details: any;
  isDefault: boolean;
}

export default function PaymentMethods() {
  const qc = useQueryClient();
  const { data: items } = useQuery<PaymentMethod[]>({ queryKey: ['paymentMethods'], queryFn: async () => (await api.get('/payment-methods')).data });

  const [type, setType] = useState('MOMO');
  const [label, setLabel] = useState('');
  const [details, setDetails] = useState('{}');
  const [isDefault, setIsDefault] = useState(true);
  const [error, setError] = useState('');

  const createPm = useMutation({
    mutationFn: async () => api.post('/payment-methods', { type, label, details: JSON.parse(details || '{}'), isDefault }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['paymentMethods'] }),
    onError: (err: any) => setError(err.response?.data?.message || 'Failed'),
  });

  const remove = (id: string) => api.delete(`/payment-methods/${id}`).then(() => qc.invalidateQueries({ queryKey: ['paymentMethods'] }));
  const setDefaultPm = (id: string) => api.post(`/payment-methods/${id}/default`).then(() => qc.invalidateQueries({ queryKey: ['paymentMethods'] }));

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError('');
    createPm.mutate();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="subtext">Payout rails</p>
          <h2 className="section-title">Payment Methods</h2>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-semibold mb-3">Add Payment Method</h3>
        <form className="grid grid-cols-1 md:grid-cols-3 gap-3" onSubmit={onSubmit}>
          <select className="input" value={type} onChange={(e) => setType(e.target.value)}>
            <option value="MOMO">MOMO</option>
            <option value="BANK">BANK</option>
            <option value="PAYPAL">PAYPAL</option>
            <option value="OTHER">OTHER</option>
          </select>
          <input className="input" placeholder="Label" value={label} onChange={(e) => setLabel(e.target.value)} />
          <input className="input md:col-span-3" placeholder='Details JSON' value={details} onChange={(e) => setDetails(e.target.value)} />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={isDefault} onChange={(e) => setIsDefault(e.target.checked)} /> Default
          </label>
          <button className="btn-primary" disabled={createPm.isPending} type="submit">
            {createPm.isPending ? 'Saving...' : 'Save'}
          </button>
          {error && <div className="text-sm text-red-500 md:col-span-3">{error}</div>}
        </form>
      </div>

      <div className="card p-4">
        <h3 className="font-semibold mb-3">My Payment Methods</h3>
        <table className="table-base">
          <thead>
            <tr className="text-xs uppercase text-slate-500 dark:text-slate-400">
              <th>Label</th>
              <th>Type</th>
              <th>Default</th>
              <th>Details</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items?.map((pm) => (
              <tr key={pm.id}>
                <td className="font-semibold">{pm.label}</td>
                <td>{pm.type}</td>
                <td>{pm.isDefault ? 'Yes' : 'No'}</td>
                <td className="text-xs text-slate-500 dark:text-slate-400"><code>{JSON.stringify(pm.details)}</code></td>
                <td className="flex gap-2 py-2">
                  <button className="btn-secondary" onClick={() => setDefaultPm(pm.id)}>Set Default</button>
                  <button className="btn-secondary" onClick={() => remove(pm.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
