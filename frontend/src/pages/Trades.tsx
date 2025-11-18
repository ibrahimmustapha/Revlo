import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api/client';
import { Trade } from '../types';
import { FormEvent, useState } from 'react';

export default function Trades() {
  const qc = useQueryClient();
  const { data: trades } = useQuery<Trade[]>({
    queryKey: ['trades'],
    queryFn: async () => (await api.get('/trades/me')).data,
  });

  const [offerId, setOfferId] = useState('');
  const [fromAmount, setFromAmount] = useState('100');
  const [toAmount, setToAmount] = useState('10');
  const [error, setError] = useState('');

  const createTrade = useMutation({
    mutationFn: async () => api.post('/trades', { offerId, fromAmount, toAmount }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['trades'] }),
    onError: (err: any) => setError(err.response?.data?.message || 'Failed to create trade'),
  });

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError('');
    createTrade.mutate();
  };

  const mutateStatus = (id: string, path: string) =>
    api.post(`/trades/${id}/${path}`).then(() => qc.invalidateQueries({ queryKey: ['trades'] }));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="subtext">Escrow</p>
          <h2 className="section-title">Trades</h2>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-semibold mb-3">Create Trade</h3>
        <form className="grid grid-cols-1 md:grid-cols-4 gap-3" onSubmit={onSubmit}>
          <input className="input md:col-span-2" placeholder="Offer ID" value={offerId} onChange={(e) => setOfferId(e.target.value)} />
          <input className="input" placeholder="From amount" value={fromAmount} onChange={(e) => setFromAmount(e.target.value)} />
          <input className="input" placeholder="To amount" value={toAmount} onChange={(e) => setToAmount(e.target.value)} />
          <div className="md:col-span-4 flex gap-3 items-center">
            <button className="btn-primary" type="submit" disabled={createTrade.isPending}>
              {createTrade.isPending ? 'Creating...' : 'Create'}
            </button>
            {error && <div className="text-sm text-red-500">{error}</div>}
          </div>
        </form>
      </div>

      <div className="card p-4">
        <h3 className="font-semibold mb-3">My Trades</h3>
        <table className="table-base">
          <thead>
            <tr className="text-xs uppercase text-slate-500 dark:text-slate-400">
              <th>ID</th>
              <th>Pair</th>
              <th>Amounts</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {trades?.map((t) => (
              <tr key={t.id}>
                <td className="text-xs text-slate-500 dark:text-slate-400">{t.id}</td>
                <td className="font-semibold">
                  {t.fromCurrency} → {t.toCurrency}
                </td>
                <td>{t.fromAmount} / {t.toAmount}</td>
                <td><span className="badge">{t.status}</span></td>
                <td className="flex flex-wrap gap-2 py-2">
                  <button className="btn-secondary" onClick={() => mutateStatus(t.id, 'paid')}>Paid</button>
                  <button className="btn-secondary" onClick={() => mutateStatus(t.id, 'confirm')}>Confirm</button>
                  <button className="btn-secondary" onClick={() => mutateStatus(t.id, 'release')}>Release</button>
                  <button className="btn-secondary" onClick={() => mutateStatus(t.id, 'cancel')}>
                    Cancel
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
