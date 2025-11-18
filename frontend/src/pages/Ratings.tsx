import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../api/client';
import { FormEvent, useMemo, useState } from 'react';

interface Rating {
  id: string;
  tradeId: string;
  score: number;
  comment?: string;
}

export default function RatingsPage() {
  const qc = useQueryClient();
  const { data: ratings } = useQuery<Rating[]>({ queryKey: ['ratings'], queryFn: async () => (await api.get('/ratings/me')).data });

  const [tradeId, setTradeId] = useState('');
  const [score, setScore] = useState(5);
  const [comment, setComment] = useState('');

  const createRating = useMutation({
    mutationFn: async () => api.post('/ratings', { tradeId, score: Number(score), comment }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['ratings'] }),
  });

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    createRating.mutate();
  };

  const stats = useMemo(() => {
    const total = ratings?.length || 0;
    const sum = ratings?.reduce((acc, r) => acc + r.score, 0) || 0;
    const avg = total ? (sum / total).toFixed(1) : '0.0';
    const dist = [1, 2, 3, 4, 5].map((s) => ({
      score: s,
      count: ratings?.filter((r) => r.score === s).length || 0,
    }));
    const maxCount = Math.max(...dist.map((d) => d.count), 1);
    return { total, avg, dist, maxCount };
  }, [ratings]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="subtext">Reputation</p>
          <h2 className="section-title">Ratings</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="card p-4">
          <div className="subtext">Average</div>
          <div className="text-3xl font-bold">{stats.avg}</div>
        </div>
        <div className="card p-4">
          <div className="subtext">Total Ratings</div>
          <div className="text-3xl font-bold">{stats.total}</div>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-semibold mb-3">Distribution</h3>
        <div className="space-y-2">
          {stats.dist.map((d) => (
            <div key={d.score} className="flex items-center gap-3">
              <div className="w-16 text-sm">{d.score} ★</div>
              <div className="flex-1 h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div className="h-full bg-brand-600" style={{ width: `${(d.count / stats.maxCount) * 100}%` }} />
              </div>
              <div className="w-10 text-right text-sm">{d.count}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-semibold mb-3">Rate a Trade</h3>
        <form className="grid grid-cols-1 md:grid-cols-3 gap-3" onSubmit={onSubmit}>
          <input className="input" placeholder="Trade ID" value={tradeId} onChange={(e) => setTradeId(e.target.value)} />
          <input className="input" placeholder="Score (1-5)" type="number" value={score} onChange={(e) => setScore(Number(e.target.value))} />
          <input className="input md:col-span-3" placeholder="Comment" value={comment} onChange={(e) => setComment(e.target.value)} />
          <button className="btn-primary" type="submit" disabled={createRating.isPending}>
            {createRating.isPending ? 'Saving...' : 'Save'}
          </button>
        </form>
      </div>

      <div className="card p-4">
        <h3 className="font-semibold mb-3">My Ratings</h3>
        <div className="space-y-3">
          {ratings?.map((r) => (
            <div key={r.id} className="border border-slate-200 dark:border-slate-800 rounded-xl p-3">
              <div className="flex items-center justify-between">
                <div className="font-semibold">Trade: {r.tradeId}</div>
                <span className="badge">{r.score} ★</span>
              </div>
              <div className="text-sm text-slate-500 dark:text-slate-400">{r.comment}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
