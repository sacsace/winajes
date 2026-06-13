'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { AlertTriangle } from 'lucide-react';
import { useAdminT } from '@/lib/admin/AdminLocaleProvider';

export type ConfirmOptions = {
  title?: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'default' | 'danger';
};

type ConfirmContextValue = {
  confirm: (options: ConfirmOptions) => Promise<boolean>;
};

const ConfirmContext = createContext<ConfirmContextValue | null>(null);

type DialogState = ConfirmOptions & { open: true };

export function ConfirmDialogProvider({ children }: { children: React.ReactNode }) {
  const { t } = useAdminT();
  const [dialog, setDialog] = useState<DialogState | null>(null);
  const resolveRef = useRef<((value: boolean) => void) | null>(null);
  const confirmButtonRef = useRef<HTMLButtonElement>(null);

  const confirm = useCallback((options: ConfirmOptions) => {
    return new Promise<boolean>((resolve) => {
      resolveRef.current = resolve;
      setDialog({ ...options, open: true });
    });
  }, []);

  const close = useCallback((result: boolean) => {
    resolveRef.current?.(result);
    resolveRef.current = null;
    setDialog(null);
  }, []);

  useEffect(() => {
    if (!dialog) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close(false);
    };

    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    confirmButtonRef.current?.focus();

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [dialog, close]);

  const variant = dialog?.variant ?? 'danger';
  const title = dialog?.title ?? t('common.confirmTitle');
  const confirmLabel = dialog?.confirmLabel ?? t('common.confirm');
  const cancelLabel = dialog?.cancelLabel ?? t('common.cancel');

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}

      {dialog && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          role="presentation"
        >
          <button
            type="button"
            aria-label={cancelLabel}
            className="absolute inset-0 bg-[#0B2D5E]/30 backdrop-blur-[2px]"
            onClick={() => close(false)}
          />

          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="admin-confirm-title"
            aria-describedby="admin-confirm-message"
            className="relative w-full max-w-[400px] overflow-hidden rounded-[16px] border border-black/[0.06] bg-white shadow-[0_24px_64px_rgba(11,45,94,0.18)]"
          >
            <div className="px-6 pt-6 pb-5">
              <div className="flex gap-4">
                <div
                  className={
                    variant === 'danger'
                      ? 'flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-red-50'
                      : 'flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#0B2D5E]/8'
                  }
                >
                  <AlertTriangle
                    className={
                      variant === 'danger' ? 'h-5 w-5 text-red-600' : 'h-5 w-5 text-[#0B2D5E]'
                    }
                    strokeWidth={2}
                  />
                </div>
                <div className="min-w-0 pt-0.5">
                  <h2
                    id="admin-confirm-title"
                    className="text-[17px] font-semibold tracking-[-0.02em] text-[#1D1D1F]"
                  >
                    {title}
                  </h2>
                  <p
                    id="admin-confirm-message"
                    className="mt-2 text-[14px] leading-relaxed text-[#636366]"
                  >
                    {dialog.message}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 border-t border-black/[0.05] bg-[#FAFAFA] px-6 py-4">
              <button
                type="button"
                onClick={() => close(false)}
                className="rounded-[10px] border border-black/[0.08] bg-white px-4 py-2 text-[13px] font-medium text-[#1D1D1F] transition-colors hover:bg-black/[0.02]"
              >
                {cancelLabel}
              </button>
              <button
                ref={confirmButtonRef}
                type="button"
                onClick={() => close(true)}
                className={
                  variant === 'danger'
                    ? 'rounded-[10px] bg-red-600 px-4 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-red-700'
                    : 'rounded-[10px] bg-[#0B2D5E] px-4 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-[#153E7E]'
                }
              >
                {confirmLabel}
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  );
}

export function useConfirm() {
  const ctx = useContext(ConfirmContext);
  if (!ctx) {
    throw new Error('useConfirm must be used within ConfirmDialogProvider');
  }
  return ctx.confirm;
}
