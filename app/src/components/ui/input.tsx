import { forwardRef, InputHTMLAttributes, TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        'w-full rounded-md border border-ink-200 bg-white px-[14px] py-[14px] text-[15px] outline-none transition focus:border-brand-600',
        className
      )}
      {...props}
    />
  )
);
Input.displayName = 'Input';

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      'min-h-[92px] w-full resize-y rounded-md border border-ink-200 bg-white px-[14px] py-[14px] text-[15px] leading-relaxed outline-none transition focus:border-brand-600',
      className
    )}
    {...props}
  />
));
Textarea.displayName = 'Textarea';
