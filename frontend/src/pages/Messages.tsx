import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api, API_BASE } from '../api/client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';

interface Trade {
  id: string;
  offerId: string;
  fromCurrency: string;
  toCurrency: string;
}

interface Message {
  id: string;
  tradeId: string;
  senderId: string;
  content: string;
  createdAt: string;
}

export default function MessagesPage() {
  const qc = useQueryClient();
  const { token } = useAuth();
  const { data: trades } = useQuery<Trade[]>({ queryKey: ['trades'], queryFn: async () => (await api.get('/trades/me')).data });
  const [selectedTrade, setSelectedTrade] = useState<string>('');
  const [content, setContent] = useState('');
  const [socket, setSocket] = useState<Socket | null>(null);
  const [liveMessages, setLiveMessages] = useState<Message[]>([]);
  const listRef = useRef<HTMLDivElement>(null);

  const { data: messages } = useQuery<Message[]>({
    queryKey: ['messages', selectedTrade],
    queryFn: async () => (await api.get(`/messages/trade/${selectedTrade}`)).data,
    enabled: Boolean(selectedTrade),
  });

  useEffect(() => {
    if (!token) return;
    const s = io(API_BASE, { auth: { token } });
    setSocket(s);
    return () => {
      s.disconnect();
    };
  }, [token]);

  useEffect(() => {
    if (!socket || !selectedTrade) return;
    socket.emit('joinTrade', selectedTrade);
    socket.on('message:new', (msg: Message) => {
      setLiveMessages((prev) => [...prev, msg]);
    });
    return () => {
      socket.off('message:new');
      setLiveMessages([]);
    };
  }, [socket, selectedTrade]);

  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, liveMessages]);

  const combinedMessages = useMemo(() => {
    return [...(messages || []), ...liveMessages].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }, [messages, liveMessages]);

  const sendMessage = useMutation({
    mutationFn: async () => api.post(`/messages/trade/${selectedTrade}`, { content }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['messages', selectedTrade] });
      setContent('');
    },
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="subtext">In-trade chat</p>
          <h2 className="section-title">Messages</h2>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-semibold mb-2">Select Trade</h3>
        <select className="input" value={selectedTrade} onChange={(e) => setSelectedTrade(e.target.value)}>
          <option value="">Choose a trade</option>
          {trades?.map((t) => (
            <option key={t.id} value={t.id}>
              {t.id} — {t.fromCurrency} → {t.toCurrency}
            </option>
          ))}
        </select>
      </div>

      {selectedTrade && (
        <div className="card p-4 space-y-3">
          <h3 className="font-semibold">Conversation</h3>
          <div ref={listRef} className="space-y-2 max-h-96 overflow-y-auto">
            {combinedMessages.map((m) => (
              <div key={m.id} className="border border-slate-200 dark:border-slate-800 rounded-xl p-2">
                <div className="text-xs text-slate-500 dark:text-slate-400">{new Date(m.createdAt).toLocaleString()}</div>
                <div>{m.content}</div>
              </div>
            ))}
            {!combinedMessages.length && <div className="subtext">No messages yet.</div>}
          </div>
          <form
            className="flex flex-col gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              if (!content.trim()) return;
              setLiveMessages((prev) => [...prev, { id: crypto.randomUUID(), tradeId: selectedTrade, senderId: 'me', content, createdAt: new Date().toISOString() }]);
              sendMessage.mutate();
            }}
          >
            <textarea
              className="input min-h-[80px]"
              placeholder="Type a message"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <button className="btn-primary self-end" type="submit" disabled={sendMessage.isPending}>
              {sendMessage.isPending ? 'Sending...' : 'Send'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
