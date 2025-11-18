import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../api/client';
import { FormEvent, useState, useEffect } from 'react';

interface Profile {
  fullName?: string;
  country?: string;
  preferredCurrency?: string;
  avatarUrl?: string;
}

interface MeResponse {
  email?: string | null;
  phone?: string | null;
  role?: string;
  rating?: number;
  completedTradeCount?: number;
  isVerified?: boolean;
  profile?: Profile;
}

export default function ProfilePage() {
  const qc = useQueryClient();
  const { data: user } = useQuery<MeResponse>({ queryKey: ['me'], queryFn: async () => (await api.get('/users/me')).data });

  const [form, setForm] = useState<Profile>({});
  useEffect(() => {
    if (user?.profile) {
      setForm(user.profile);
    }
  }, [user]);

  const updateProfile = useMutation({
    mutationFn: async () => api.patch('/users/me', form),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['me'] }),
  });

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    updateProfile.mutate();
  };

  const initials =
    (user?.email || user?.phone || 'User')
      .split(/[@\\s\\.\\-]/)
      .filter(Boolean)
      .slice(0, 2)
      .map((p: string) => p[0]?.toUpperCase())
      .join('') || 'U';
  const avatarUrl = form.avatarUrl || user?.profile?.avatarUrl || '';

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="subtext">Account</p>
          <h2 className="section-title">Profile</h2>
        </div>
      </div>

      <div className="card p-5 grid gap-6 md:grid-cols-[280px_1fr] items-center">
        <div className="flex items-center gap-4">
          {avatarUrl ? (
            <img src={avatarUrl} alt="avatar" className="h-20 w-20 rounded-full object-cover border border-slate-200 dark:border-slate-800" />
          ) : (
            <div className="h-20 w-20 rounded-full bg-brand-600 text-white font-bold grid place-items-center text-2xl">
              {initials}
            </div>
          )}
          <div>
            <div className="text-xl font-bold">{user?.profile?.fullName || 'Set your name'}</div>
            <div className="subtext">{user?.email || user?.phone}</div>
            <span className="badge mt-2 inline-flex">{user?.role}</span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 w-full">
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-3">
            <div className="subtext">Rating</div>
            <div className="text-2xl font-bold">{user?.rating ?? 0}</div>
          </div>
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-3">
            <div className="subtext">Completed trades</div>
            <div className="text-2xl font-bold">{user?.completedTradeCount ?? 0}</div>
          </div>
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-3">
            <div className="subtext">Verified</div>
            <div className="badge mt-1 inline-flex">{user?.isVerified ? 'Yes' : 'No'}</div>
          </div>
        </div>
      </div>

      <div className="card p-5 max-w-3xl">
        <h3 className="font-semibold mb-3">Edit Profile</h3>
        <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {['fullName', 'country', 'preferredCurrency', 'avatarUrl'].map((key) => (
            <input
              key={key}
              className="input"
              placeholder={key}
              value={(form as any)[key] || ''}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
            />
          ))}
          <div className="md:col-span-2 flex justify-end">
            <button className="btn-primary" type="submit" disabled={updateProfile.isPending}>
              {updateProfile.isPending ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
