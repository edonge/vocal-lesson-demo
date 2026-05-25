import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useConsult } from '../context/ConsultContext';

type Tab = { key: string; label: string; icon: string; path: string; badge?: boolean };

const STUDENT_TABS: Tab[] = [
  { key: 'home', label: '홈', icon: '🏠', path: '/app/student/home' },
  { key: 'explore', label: '탐색', icon: '🔎', path: '/app/student/explore' },
  { key: 'chat', label: '채팅', icon: '💬', path: '/app/student/chat', badge: true },
  { key: 'my', label: '마이', icon: '👤', path: '/app/student/my' },
];

const TEACHER_TABS: Tab[] = [
  { key: 'home', label: '홈', icon: '🏠', path: '/app/teacher/home' },
  { key: 'inquiries', label: '문의', icon: '💬', path: '/app/teacher/inquiries', badge: true },
  { key: 'profile', label: '프로필', icon: '👤', path: '/app/teacher/profile' },
  { key: 'my', label: '마이', icon: '⚙️', path: '/app/teacher/my' },
];

export default function AppLayout({ role }: { role: 'student' | 'teacher' }) {
  const tabs = role === 'student' ? STUDENT_TABS : TEACHER_TABS;
  const location = useLocation();
  const navigate = useNavigate();
  const { consultations } = useConsult();
  const studentUnread = consultations
    .filter((c) => c.studentId === 'me')
    .reduce((sum, c) => sum + c.unread.student, 0);
  const teacherUnread = consultations.reduce((sum, c) => sum + c.unread.teacher, 0);

  return (
    <>
      <Outlet />
      <nav className="tabbar">
        {tabs.map((t) => {
          const active = location.pathname.startsWith(t.path);
          return (
            <button
              key={t.key}
              className={`tab-item ${active ? 'active' : ''}`}
              onClick={() => navigate(t.path)}
            >
              <span className="ic">{t.icon}</span>
              <span>{t.label}</span>
              {t.badge && (role === 'student' ? studentUnread : teacherUnread) > 0 && (
                <span className="badge-count">
                  {(role === 'student' ? studentUnread : teacherUnread) > 9
                    ? '9+'
                    : role === 'student'
                      ? studentUnread
                      : teacherUnread}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </>
  );
}
