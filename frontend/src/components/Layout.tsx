import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useQuery } from '@tanstack/react-query';
import { api } from '../api/client';

const links = [
  { to: '/offers', label: 'Offers', icon: '💱' },
  { to: '/trades', label: 'Trades', icon: '🤝' },
  { to: '/payment-methods', label: 'Payment Methods', icon: '🏦' },
  { to: '/kyc', label: 'KYC', icon: '🪪' },
  { to: '/profile', label: 'Profile', icon: '👤' },
  { to: '/disputes', label: 'Disputes', icon: '⚖️' },
  { to: '/messages', label: 'Messages', icon: '💬' },
  { to: '/ratings', label: 'Ratings', icon: '⭐' },
];

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const { user, logout, token } = useAuth();
  const navigate = useNavigate();
  const { theme, toggle } = useTheme();
  const { data: me } = useQuery({
    queryKey: ['me'],
    queryFn: async () => (await api.get('/users/me')).data as {
      email?: string | null;
      phone?: string | null;
      role?: string;
      profile?: { avatarUrl?: string | null; fullName?: string | null };
    },
    enabled: Boolean(token),
  });
  const initials =
    (me?.email || me?.phone || user?.email || user?.phone || 'User')
      .split(/[@\s\.\-]/)
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase())
      .join('') || 'U';
  const avatarUrl = me?.profile?.avatarUrl || '';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="app-shell">
      <aside className="w-64 bg-white/80 dark:bg-slate-900/70 backdrop-blur border-r border-slate-200 dark:border-slate-800 px-4 py-6 flex flex-col gap-4">
        <div className="flex items-center gap-3 px-2">
          <div className="h-10 w-10 rounded-xl bg-brand-600 text-white font-extrabold grid place-items-center">B2</div>
          <div>
            <div className="font-bold">B2B Trading</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Escrow marketplace</div>
          </div>
        </div>
        <nav className="flex-1 flex flex-col gap-1">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `rounded-xl px-3 py-2 text-sm font-semibold transition flex items-center gap-2 ${
                  isActive
                    ? 'bg-brand-600 text-white shadow'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`
              }
            >
              <span>{link.icon}</span>
              <span>{link.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-3 flex items-center gap-3">
          {avatarUrl ? (
            <img src={avatarUrl} alt="avatar" className="h-10 w-10 rounded-full object-cover" />
          ) : (
            <div className="h-10 w-10 rounded-full bg-brand-600 text-white font-bold grid place-items-center">{initials}</div>
          )}
          <div className="flex-1">
            <div className="text-sm font-semibold truncate max-w-[12ch]">{me?.email || me?.phone || user?.email || user?.phone}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 capitalize">{me?.role || user?.role}</div>
          </div>
          <button onClick={toggle} className="text-lg" title="Toggle theme">
            {theme === 'dark' ? '🌙' : '☀️'}
          </button>
        </div>
        <button className="btn-secondary w-full" onClick={handleLogout}>
          Logout
        </button>
      </aside>
      <main className="flex-1 p-6 max-w-6xl mx-auto w-full">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Welcome back</p>
            <p className="text-xl font-bold">
              {me?.profile?.fullName || me?.email || me?.phone || user?.email || user?.phone}
            </p>
          </div>
          <button className="btn-secondary" onClick={toggle}>
            Switch to {theme === 'dark' ? 'Light' : 'Dark'}
          </button>
        </div>
        {children}
      </main>
    </div>
  );
};
