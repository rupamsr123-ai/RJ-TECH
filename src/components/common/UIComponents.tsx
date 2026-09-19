import React from 'react';
import { LucideIcon, X, AlertCircle, CheckCircle2, Info, AlertTriangle, Printer, Download, Share2, Copy } from 'lucide-react';
import QRCode from 'qrcode';

// ==================== BADGE ====================
export interface BadgeProps {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'neutral';
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({ variant = 'primary', children, className = '', size = 'md' }) => {
  const variantStyles = {
    primary: 'bg-blue-50 text-blue-700 border-blue-200',
    secondary: 'bg-sky-50 text-sky-700 border-sky-200',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    danger: 'bg-rose-50 text-rose-700 border-rose-200',
    neutral: 'bg-slate-100 text-slate-700 border-slate-200',
  };

  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5 font-medium',
    md: 'text-xs px-2.5 py-1 font-semibold',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border whitespace-nowrap leading-none ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {children}
    </span>
  );
};

// ==================== BUTTON ====================
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  loading = false,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const base = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer';

  const variants = {
    primary: 'bg-[#155EEF] hover:bg-blue-700 text-white shadow-sm hover:shadow focus:ring-blue-500 active:scale-[0.99]',
    secondary: 'bg-[#0EA5E9] hover:bg-sky-600 text-white shadow-sm focus:ring-sky-400 active:scale-[0.99]',
    outline: 'border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 shadow-xs focus:ring-slate-300',
    ghost: 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:ring-slate-200',
    danger: 'bg-[#DC2626] hover:bg-red-700 text-white shadow-sm focus:ring-red-400 active:scale-[0.99]',
    success: 'bg-[#16A34A] hover:bg-green-700 text-white shadow-sm focus:ring-green-400 active:scale-[0.99]',
  };

  const sizes = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2 gap-2',
    lg: 'text-base px-5 py-2.5 gap-2.5 font-semibold',
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-1" />
      ) : Icon && iconPosition === 'left' ? (
        <Icon className="w-4 h-4 shrink-0" />
      ) : null}
      {children}
      {!loading && Icon && iconPosition === 'right' && <Icon className="w-4 h-4 shrink-0" />}
    </button>
  );
};

// ==================== CARD ====================
export const Card: React.FC<{
  children: React.ReactNode;
  className?: string;
  id?: string;
  onClick?: () => void;
}> = ({ children, className = '', id, onClick }) => {
  return (
    <div
      id={id}
      onClick={onClick}
      className={`bg-white rounded-2xl border border-slate-200/80 shadow-[0_2px_8px_-2px_rgba(15,23,42,0.06)] transition-all duration-200 ${className}`}
    >
      {children}
    </div>
  );
};

// ==================== STAT CARD ====================
export interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color?: string;
  iconBgColor?: string;
  iconColor?: string;
  trend?: string;
  trendPositive?: boolean;
  subtitle?: string;
  onClick?: () => void;
  id?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  color,
  iconBgColor,
  iconColor,
  trend,
  trendPositive = true,
  subtitle,
  onClick,
  id,
}) => {
  const colorMap: Record<string, { bg: string; text: string }> = {
    blue: { bg: 'bg-blue-50', text: 'text-blue-600' },
    sky: { bg: 'bg-sky-50', text: 'text-sky-600' },
    amber: { bg: 'bg-amber-50', text: 'text-amber-600' },
    rose: { bg: 'bg-rose-50', text: 'text-rose-600' },
    green: { bg: 'bg-emerald-50', text: 'text-emerald-600' },
    emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600' },
    purple: { bg: 'bg-purple-50', text: 'text-purple-600' },
  };

  const bg = iconBgColor || (color && colorMap[color]?.bg) || 'bg-blue-50';
  const fg = iconColor || (color && colorMap[color]?.text) || 'text-[#155EEF]';

  return (
    <div
      id={id}
      onClick={onClick}
      className={`bg-white rounded-2xl border border-slate-200/80 p-5 shadow-[0_2px_8px_-2px_rgba(15,23,42,0.06)] hover:shadow-md transition-all duration-200 ${onClick ? 'cursor-pointer hover:border-blue-300' : ''}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{title}</p>
          <p className="mt-1 text-2xl lg:text-3xl font-bold tracking-tight text-slate-900">{value}</p>
          {trend && (
            <p
              className={`mt-2 text-xs font-semibold inline-flex items-center gap-1 ${
                trendPositive ? 'text-emerald-600' : 'text-rose-600'
              }`}
            >
              {trendPositive ? '↑' : '↓'} {trend}
            </p>
          )}
          {subtitle && !trend && <p className="mt-1 text-xs text-slate-500">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-xl ${bg} ${fg} shrink-0`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};

// ==================== MODAL / DIALOG ====================
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
  id?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  maxWidth = 'lg',
  id,
}) => {
  if (!isOpen) return null;

  const maxWClass = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
  }[maxWidth];

  return (
    <div
      id={id}
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className={`bg-white w-full ${maxWClass} rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8 transform transition-all`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div>
            <h3 className="text-lg font-bold text-slate-900">{title}</h3>
            {description && <p className="text-xs text-slate-500 mt-0.5">{description}</p>}
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 p-1.5 rounded-lg transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 max-h-[80vh] overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};

// ==================== EMPTY STATE ====================
export const EmptyState: React.FC<{
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  id?: string;
}> = ({ icon: Icon, title, description, actionLabel, onAction, id }) => {
  return (
    <div id={id} className="text-center py-12 px-4 rounded-2xl bg-white border border-dashed border-slate-200 my-4">
      <div className="mx-auto w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mb-3">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-base font-semibold text-slate-800">{title}</h3>
      <p className="text-sm text-slate-500 max-w-sm mx-auto mt-1">{description}</p>
      {actionLabel && onAction && (
        <div className="mt-4">
          <Button size="sm" onClick={onAction}>
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
};

// ==================== TOAST CONTAINER ====================
export const ToastContainer: React.FC<{
  toasts: { id: string; type: 'success' | 'error' | 'warning' | 'info'; message: string }[];
  onRemove: (id: string) => void;
}> = ({ toasts, onRemove }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-md w-full px-4 pointer-events-none">
      {toasts.map((toast) => {
        const icons = {
          success: <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />,
          error: <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />,
          warning: <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />,
          info: <Info className="w-5 h-5 text-blue-500 shrink-0" />,
        };

        const borders = {
          success: 'border-emerald-200 bg-white text-slate-800 shadow-lg',
          error: 'border-rose-200 bg-white text-slate-800 shadow-lg',
          warning: 'border-amber-200 bg-white text-slate-800 shadow-lg',
          info: 'border-blue-200 bg-white text-slate-800 shadow-lg',
        };

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between gap-3 p-3.5 rounded-xl border ${borders[toast.type]} transition-all animate-in fade-in slide-in-from-bottom-2`}
          >
            <div className="flex items-center gap-2.5">
              {icons[toast.type]}
              <p className="text-sm font-medium leading-snug">{toast.message}</p>
            </div>
            <button
              onClick={() => onRemove(toast.id)}
              className="text-slate-400 hover:text-slate-600 p-1 rounded-md"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};

// ==================== QR CODE DISPLAY ====================
export const QRCodeDisplay: React.FC<{ value: string; size?: number; className?: string }> = ({
  value,
  size = 128,
  className = '',
}) => {
  const [dataUrl, setDataUrl] = React.useState<string>('');

  React.useEffect(() => {
    QRCode.toDataURL(value, {
      width: size,
      margin: 1,
      color: {
        dark: '#0F172A',
        light: '#FFFFFF',
      },
    })
      .then((url: string) => setDataUrl(url))
      .catch((err: unknown) => console.error(err));
  }, [value, size]);

  if (!dataUrl) {
    return <div style={{ width: size, height: size }} className="bg-slate-100 rounded-lg animate-pulse" />;
  }

  return (
    <img
      src={dataUrl}
      alt="QR Code"
      width={size}
      height={size}
      className={`rounded-lg border border-slate-200 ${className}`}
    />
  );
};

// ==================== WHATSAPP MODAL ====================
export const WhatsAppDialog: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  phone: string;
  message: string;
  title: string;
}> = ({ isOpen, onClose, phone, message, title }) => {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSend = () => {
    const cleanPhone = phone.startsWith('91') ? phone : `91${phone}`;
    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="md">
      <div className="space-y-4">
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3">
          <Share2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <div className="text-xs text-emerald-800">
            <span className="font-semibold">WhatsApp Confirmation:</span> In accordance with privacy rules, review the message template before sending.
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Recipient Mobile Number</label>
          <input
            type="text"
            readOnly
            value={phone}
            className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-mono"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Message Preview</label>
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800 whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto">
            {message}
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 pt-2">
          <Button variant="outline" size="sm" icon={Copy} onClick={handleCopy}>
            {copied ? 'Copied!' : 'Copy Text'}
          </Button>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="success" size="sm" icon={Share2} onClick={handleSend}>
              Open in WhatsApp
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
