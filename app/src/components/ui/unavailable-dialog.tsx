'use client';

type UnavailableDialogProps = {
  open: boolean;
  onClose: () => void;
};

export function UnavailableDialog({ open, onClose }: UnavailableDialogProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 px-6"
      role="presentation"
      onMouseDown={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="unavailable-title"
        className="w-full max-w-[300px] rounded-lg bg-white px-5 py-6 text-center shadow-pop"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <h2 id="unavailable-title" className="text-lg font-bold text-gray-950">
          준비되지 않은 화면입니다
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-gray-400">
          해당 기능은 추후 MVP 범위에 맞춰 연결될 예정입니다.
        </p>
        <button
          type="button"
          onClick={onClose}
          className="mt-5 h-11 w-full rounded-md bg-blue-500 text-[15px] font-medium text-white"
        >
          확인
        </button>
      </div>
    </div>
  );
}
