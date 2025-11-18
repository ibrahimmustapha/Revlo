import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api, API_BASE } from '../api/client';
import { FormEvent, useState } from 'react';
import { Spinner } from '../components/Spinner';

interface Kyc {
  documentType: string;
  documentNumber: string;
  documentFrontUrl: string;
  documentBackUrl: string;
  selfieUrl?: string;
  status: string;
}

const labelMap: Record<string, string> = {
  documentType: 'Document Type',
  documentNumber: 'Document Number',
};

export default function KycPage() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery<Kyc | null>({ queryKey: ['kyc'], queryFn: async () => (await api.get('/kyc/me')).data });

  const [form, setForm] = useState({
    documentType: 'NATIONAL_ID',
    documentNumber: '',
  });
  const [frontFile, setFrontFile] = useState<File | null>(null);
  const [backFile, setBackFile] = useState<File | null>(null);
  const [selfieFile, setSelfieFile] = useState<File | null>(null);
  const [error, setError] = useState('');

  const submit = useMutation({
    mutationFn: async () => {
      const fd = new FormData();
      fd.append('documentType', form.documentType);
      fd.append('documentNumber', form.documentNumber);
      if (frontFile) fd.append('documentFront', frontFile);
      if (backFile) fd.append('documentBack', backFile);
      if (selfieFile) fd.append('selfie', selfieFile);
      return api.post('/kyc/me', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['kyc'] }),
    onError: (err: any) => setError(err.response?.data?.message || 'Failed'),
  });

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError('');
    submit.mutate();
  };

  const renderLink = (url?: string) => {
    if (!url) return null;
    const isAbsolute = /^https?:\/\//i.test(url);
    const href = isAbsolute ? url : `${API_BASE.replace(/\/$/, '')}/${url.replace(/^\//, '')}`;
    const filename = url.split('/').pop();
    return (
      <a className="text-brand-600" href={href} target="_blank" rel="noreferrer">
        {filename}
      </a>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="subtext">Identity</p>
          <h2 className="section-title">KYC</h2>
        </div>
      </div>

      {isLoading ? (
        <Spinner label="Loading KYC..." />
      ) : data ? (
        <div className="card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="subtext">Status</div>
              <div className="badge">{data.status}</div>
            </div>
            <div>
              <div className="subtext">Document</div>
              <div className="font-semibold">
                {data.documentType} — {data.documentNumber}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-3 space-y-1">
              <div className="subtext">Front</div>
              {renderLink(data.documentFrontUrl)}
            </div>
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-3 space-y-1">
              <div className="subtext">Back</div>
              {renderLink(data.documentBackUrl)}
            </div>
            {data.selfieUrl && (
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-3 space-y-1">
                <div className="subtext">Selfie</div>
                {renderLink(data.selfieUrl)}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="card p-5 max-w-3xl">
          <h3 className="font-semibold mb-3">Submit KYC</h3>
          <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {Object.keys(form).map((key) => (
              <input
                key={key}
                className="input"
                placeholder={labelMap[key]}
                value={(form as any)[key]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              />
            ))}
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-semibold">Front image</label>
              <input className="input" type="file" accept="image/*" onChange={(e) => setFrontFile(e.target.files?.[0] || null)} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-semibold">Back image</label>
              <input className="input" type="file" accept="image/*" onChange={(e) => setBackFile(e.target.files?.[0] || null)} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-semibold">Selfie (optional)</label>
              <input className="input" type="file" accept="image/*" onChange={(e) => setSelfieFile(e.target.files?.[0] || null)} />
            </div>
            {error && <div className="text-sm text-red-500 md:col-span-2">{error}</div>}
            <div className="md:col-span-2 flex justify-end gap-3">
              <button className="btn-primary" type="submit" disabled={submit.isPending}>
                {submit.isPending ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
