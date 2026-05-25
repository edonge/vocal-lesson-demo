import { ReactNode } from 'react';

export default function MobileFrame({ children }: { children: ReactNode }) {
  return (
    <div className="stage">
      <div className="phone">
        <div className="statusbar">
          <span>9:41</span>
          <span className="right">
            <span>●●●</span>
            <span>􀙇</span>
            <span>100%</span>
          </span>
        </div>
        {children}
      </div>
    </div>
  );
}
