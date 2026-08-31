import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const Toast = ({ toast, onDismiss }) => {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onDismiss();
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast, onDismiss]);

  if (!toast) return null;

  const { type = 'success', message = '' } = toast;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle2 size={18} color="#34d399" />;
      case 'error':
        return <AlertCircle size={18} color="#fb7185" />;
      default:
        return <Info size={18} color="#818cf8" />;
    }
  };

  return (
    <div className="toast-container">
      <div className={`toast toast-${type}`}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          {getIcon()}
          <span>{message}</span>
        </div>
        <button className="toast-close-btn" onClick={onDismiss} aria-label="Dismiss toast">
          <X size={16} />
        </button>
      </div>
    </div>
  );
};
