type SpinnerProps = {
  label?: string;
  className?: string;
};

export const Spinner = ({ label, className = '' }: SpinnerProps) => {
  return (
    <div className={`flex items-center gap-2 text-slate-500 dark:text-slate-400 ${className}`}>
      <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-brand-600 border-t-transparent" />
      {label && <span className="text-sm font-medium">{label}</span>}
    </div>
  );
};
