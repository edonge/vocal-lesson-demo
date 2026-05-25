import { useNavigate } from 'react-router-dom';

type Props = {
  title?: string;
  onBack?: () => void;
  hideBack?: boolean;
};

export default function TopBar({ title, onBack, hideBack }: Props) {
  const navigate = useNavigate();
  return (
    <div className="topbar">
      {!hideBack ? (
        <button
          className="back"
          aria-label="뒤로가기"
          onClick={() => (onBack ? onBack() : navigate(-1))}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path
              d="M15 6l-6 6 6 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      ) : (
        <div style={{ width: 36 }} />
      )}
      <div className="title">{title}</div>
    </div>
  );
}
