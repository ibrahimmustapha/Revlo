import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../api/client';
import { FormEvent, useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';

interface Dispute {
  id: string;
  tradeId: string;
  reason: string;
  description?: string;
  status: string;
  evidence: { id: string; fileUrl: string; type: string }[];
}

export default function DisputesPage() {
  const { token } = useAuth();
  const qc = useQueryClient();
  const { data: disputes } = useQuery<Dispute[]>({
    queryKey: ['disputes'],
    queryFn: async () => (await api.get('/disputes/me')).data,
    enabled: Boolean(token),
  });

  const [tradeId, setTradeId] = useState('');
  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');
  const [fileInputs, setFileInputs] = useState<Record<string, string>>({});

  const createDispute = useMutation({
    mutationFn: async () => api.post('/disputes', { tradeId, reason, description }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['disputes'] });
      setTradeId('');
      setReason('');
      setDescription('');
    },
  });

  const addEvidence = useMutation({
    mutationFn: async (vars: { disputeId: string; url: string }) =>
      api.post(`/disputes/${vars.disputeId}/evidence`, { fileUrl: vars.url }),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ['disputes'] });
      setFileInputs((prev) => ({ ...prev, [vars.disputeId]: '' }));
    },
  });

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    createDispute.mutate();
  };

  const stats = useMemo(() => {
    const total = disputes?.length || 0;
    const open = disputes?.filter((d) => d.status === 'OPEN').length || 0;
    return { total, open };
  }, [disputes]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="subtext">Resolution</p>
          <h2 className="section-title">Disputes</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="card p-4">
          <div className="subtext">Total</div>
          <div className="text-2xl font-bold">{stats.total}</div>
        </div>
        <div className="card p-4">
          <div className="subtext">Open</div>
          <div className="text-2xl font-bold">{stats.open}</div>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-semibold mb-3">Open Dispute</h3>
        <form className="grid grid-cols-1 md:grid-cols-3 gap-3" onSubmit={onSubmit}>
          <input className="input" placeholder="Trade ID" value={tradeId} onChange={(e) => setTradeId(e.target.value)} />
          <input className="input" placeholder="Reason" value={reason} onChange={(e) => setReason(e.target.value)} />
          <input className="input md:col-span-3" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
          <button className="btn-primary" type="submit" disabled={createDispute.isPending}>
            {createDispute.isPending ? 'Submitting...' : 'Submit'}
          </button>
        </form>
      </div>

      <div className="card p-4">
        <h3 className="font-semibold mb-3">My Disputes</h3>
        <div className="space-y-4">
          {disputes?.map((d) => (
            <div key={d.id} className="border border-slate-200 dark:border-slate-800 rounded-xl p-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold">{d.reason}</div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">Trade {d.tradeId}</div>
                </div>
                <span className="badge">{d.status}</span>
              </div>
              <div className="text-sm text-slate-500 dark:text-slate-400 mt-2">Evidence: {d.evidence?.length || 0}</div>
              <div className="flex flex-col md:flex-row gap-2 mt-3">
                <input
                  className="input flex-1"
                  placeholder="File URL"
                  value={fileInputs[d.id] || ''}
                  onChange={(e) => setFileInputs((prev) => ({ ...prev, [d.id]: e.target.value }))}
                />
                <button
                  className="btn-secondary"
                  onClick={() => addEvidence.mutate({ disputeId: d.id, url: fileInputs[d.id] || '' })}
                  disabled={addEvidence.isPending}
                >
                  {addEvidence.isPending ? 'Adding...' : 'Add Evidence'}
                </button>
              </div>
              <div className="text-sm mt-2 space-y-1">
                {d.evidence?.map((ev) => (
                  <div key={ev.id} className="text-slate-500 dark:text-slate-400">
                    • {ev.type}: {ev.fileUrl}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
