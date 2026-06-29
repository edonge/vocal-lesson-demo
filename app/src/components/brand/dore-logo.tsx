import { cn } from '@/lib/cn';

type DoreLogoProps = {
  withTagline?: boolean;
  className?: string;
};

export function DoreLogo({ withTagline = false, className }: DoreLogoProps) {
  return (
    <div className={cn('flex flex-col items-center gap-2.5', className)}>
      <img src="/logo.png" alt="Dore" className="h-[119px] w-[73px]" draggable={false} />
      {withTagline ? (
        <p className="text-center text-base font-semibold text-black">도움을 주는 레슨</p>
      ) : null}
    </div>
  );
}
