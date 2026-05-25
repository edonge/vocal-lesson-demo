import { Routes, Route, Navigate } from 'react-router-dom';
import MobileFrame from './components/MobileFrame';
import AppLayout from './components/AppLayout';

// Auth / role / onboarding
import Splash from './screens/Splash';
import Auth from './screens/Auth';
import RoleSelect from './screens/RoleSelect';
import StudentBasic from './screens/student/StudentBasic';
import StudentRegion from './screens/student/StudentRegion';
import StudentGoals from './screens/student/StudentGoals';
import StudentGenres from './screens/student/StudentGenres';
import StudentSkill from './screens/student/StudentSkill';
import StudentProblem from './screens/student/StudentProblem';
import StudentComplete from './screens/student/StudentComplete';
import TeacherProfileBasic from './screens/teacher/TeacherProfileBasic';
import TeacherRegion from './screens/teacher/TeacherRegion';
import TeacherTargets from './screens/teacher/TeacherTargets';
import TeacherSpecialties from './screens/teacher/TeacherSpecialties';
import TeacherPricing from './screens/teacher/TeacherPricing';
import TeacherBio from './screens/teacher/TeacherBio';
import TeacherComplete from './screens/teacher/TeacherComplete';

// Student main app
import StudentHome from './screens/student/Home';
import StudentExplore from './screens/student/Explore';
import StudentChatList from './screens/student/ChatList';
import StudentMy from './screens/student/My';
import TrainerDetail from './screens/student/TrainerDetail';
import Consult from './screens/student/Consult';
import StudentChatRoom from './screens/student/ChatRoom';

// Teacher main app
import TeacherDashboard from './screens/teacher/Dashboard';
import TeacherInquiries from './screens/teacher/Inquiries';
import TeacherProfileTab from './screens/teacher/ProfileTab';
import TeacherMy from './screens/teacher/My';
import PreviewProfile from './screens/teacher/PreviewProfile';
import ProfileEdit from './screens/teacher/ProfileEdit';
import InquiryDetail from './screens/teacher/InquiryDetail';

export default function App() {
  return (
    <MobileFrame>
      <Routes>
        <Route path="/" element={<Splash />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/role" element={<RoleSelect />} />

        {/* Student onboarding */}
        <Route path="/student/basic" element={<StudentBasic />} />
        <Route path="/student/region" element={<StudentRegion />} />
        <Route path="/student/goals" element={<StudentGoals />} />
        <Route path="/student/genres" element={<StudentGenres />} />
        <Route path="/student/skill" element={<StudentSkill />} />
        <Route path="/student/problem" element={<StudentProblem />} />
        <Route path="/student/complete" element={<StudentComplete />} />

        {/* Teacher onboarding */}
        <Route path="/teacher/profile" element={<TeacherProfileBasic />} />
        <Route path="/teacher/region" element={<TeacherRegion />} />
        <Route path="/teacher/targets" element={<TeacherTargets />} />
        <Route path="/teacher/specialties" element={<TeacherSpecialties />} />
        <Route path="/teacher/pricing" element={<TeacherPricing />} />
        <Route path="/teacher/bio" element={<TeacherBio />} />
        <Route path="/teacher/complete" element={<TeacherComplete />} />

        {/* Student main app (with tab bar) */}
        <Route element={<AppLayout role="student" />}>
          <Route path="/app/student/home" element={<StudentHome />} />
          <Route path="/app/student/explore" element={<StudentExplore />} />
          <Route path="/app/student/chat" element={<StudentChatList />} />
          <Route path="/app/student/my" element={<StudentMy />} />
        </Route>
        {/* Student full-screen routes (no tab bar) */}
        <Route path="/app/student/trainers/:id" element={<TrainerDetail />} />
        <Route path="/app/student/consult/:id" element={<Consult />} />
        <Route path="/app/student/chat/:id" element={<StudentChatRoom />} />

        {/* Teacher main app (with tab bar) */}
        <Route element={<AppLayout role="teacher" />}>
          <Route path="/app/teacher/home" element={<TeacherDashboard />} />
          <Route path="/app/teacher/inquiries" element={<TeacherInquiries />} />
          <Route path="/app/teacher/profile" element={<TeacherProfileTab />} />
          <Route path="/app/teacher/my" element={<TeacherMy />} />
        </Route>
        {/* Teacher full-screen routes */}
        <Route path="/app/teacher/preview" element={<PreviewProfile />} />
        <Route path="/app/teacher/edit" element={<ProfileEdit />} />
        <Route path="/app/teacher/inquiries/:id" element={<InquiryDetail />} />

        {/* Backwards-compat redirects for old completion targets */}
        <Route path="/home/student" element={<Navigate to="/app/student/home" replace />} />
        <Route path="/home/teacher" element={<Navigate to="/app/teacher/home" replace />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </MobileFrame>
  );
}
