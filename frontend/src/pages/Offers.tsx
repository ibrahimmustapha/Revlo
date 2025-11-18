import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api/client';
import { Offer } from '../types';
import { FormEvent, useState } from 'react';

const Modal = ({ open, onClose, children, title }: { open: boolean; onClose: () => void; children: React.ReactNode; title: string }) => {
  if (!open) return null;
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{title}</h3>
          <button className="theme-toggle" onClick={onClose}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default function Offers() {
  const qc = useQueryClient();
  const { data: offers, isLoading } = useQuery<Offer[]>({ queryKey: ['offers'], queryFn: async () => (await api.get('/offers')).data });

  const [showModal, setShowModal] = useState(false);
  const [side, setSide] = useState('BUY');
  const [fromCurrency, setFromCurrency] = useState('GHS');
  const [toCurrency, setToCurrency] = useState('USD');
  const [rate, setRate] = useState('0.0800');
  const [minAmount, setMinAmount] = useState('100');
  const [maxAmount, setMaxAmount] = useState('5000');
  const [paymentMethodsAccepted, setPaymentMethodsAccepted] = useState('[]');
  const [error, setError] = useState('');

  const resetForm = () => {
    setSide('BUY');
    setFromCurrency('GHS');
    setToCurrency('USD');
    setRate('0.0800');
    setMinAmount('100');
    setMaxAmount('5000');
    setPaymentMethodsAccepted('[]');
    setError('');
  };

  const createOffer = useMutation({
    mutationFn: async () => {
      const parsedPm = paymentMethodsAccepted ? JSON.parse(paymentMethodsAccepted) : [];
      return api.post('/offers', { side, fromCurrency, toCurrency, rate, minAmount, maxAmount, paymentMethodsAccepted: parsedPm });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['offers'] });
      setShowModal(false);
      resetForm();
    },
    onError: (err: any) => setError(err.response?.data?.message || 'Failed to create offer'),
  });

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError('');
    createOffer.mutate();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="subtext">Marketplace</p>
          <h2 className="section-title">Offers</h2>
        </div>
        <button className="btn-primary" onClick={() => setShowModal(true)}>+ New Offer</button>
      </div>

      <div className="card p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold">All Offers</h3>
        </div>
        {isLoading ? (
          <div className="subtext">Loading...</div>
        ) : (
          <table className="table-base">
            <thead>
              <tr className="text-xs uppercase text-slate-500 dark:text-slate-400">
                <th>Side</th>
                <th>Pair</th>
                <th>Rate</th>
                <th>Limits</th>
                <th>Status</th>
                <th>Maker</th>
              </tr>
            </thead>
            <tbody>
              {offers?.map((offer) => (
                <tr key={offer.id}>
                  <td><span className="badge">{offer.side}</span></td>
                  <td className="font-semibold">
                    {offer.fromCurrency} → {offer.toCurrency}
                  </td>
                  <td>{offer.rate}</td>
                  <td className="text-sm text-slate-500 dark:text-slate-400">
                    {offer.minAmount} - {offer.maxAmount}
                  </td>
                  <td>
                    <span className="badge">{offer.status}</span>
                  </td>
                  <td className="text-sm">{offer.maker?.email || offer.maker?.phone}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Modal open={showModal} onClose={() => setShowModal(false)} title="Create Offer">
        <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <select className="input" value={side} onChange={(e) => setSide(e.target.value)}>
            <option value="BUY">BUY</option>
            <option value="SELL">SELL</option>
          </select>
          <input className="input" placeholder="From Currency" value={fromCurrency} onChange={(e) => setFromCurrency(e.target.value)} />
          <input className="input" placeholder="To Currency" value={toCurrency} onChange={(e) => setToCurrency(e.target.value)} />
          <input className="input" placeholder="Rate" value={rate} onChange={(e) => setRate(e.target.value)} />
          <input className="input" placeholder="Min" value={minAmount} onChange={(e) => setMinAmount(e.target.value)} />
          <input className="input" placeholder="Max" value={maxAmount} onChange={(e) => setMaxAmount(e.target.value)} />
          <div className="md:col-span-2">
            <input
              className="input"
              placeholder='Payment methods JSON e.g. ["MOMO"]'
              value={paymentMethodsAccepted}
              onChange={(e) => setPaymentMethodsAccepted(e.target.value)}
            />
          </div>
          {error && <div className="text-sm text-red-500 md:col-span-2">{error}</div>}
          <div className="flex gap-3 md:col-span-2 justify-end">
            <button className="btn-primary" type="submit" disabled={createOffer.isPending}>
              {createOffer.isPending ? 'Creating...' : 'Create Offer'}
            </button>
            <button className="btn-secondary" type="button" onClick={() => { resetForm(); setShowModal(false); }}>
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
