import AdminLogin from "../Components/AdminPanel-Component/AdminLogin/AdminLogin";
import AllPayment from "../Components/AdminPanel-Component/AllPayment/AllPayment";
import Dashboard from "../Components/AdminPanel-Component/Dashboard/Dashboard";
import ExamKey from "../Components/AdminPanel-Component/Exam-Key/ExamKey";
import Exam from "../Components/AdminPanel-Component/Exam/Exam";
import QuestionCreate from "../Components/AdminPanel-Component/ExamDetail/components/ExamParts/components/ExamQuestions/components/QuestionCreate";
import QuestionDetail from "../Components/AdminPanel-Component/ExamDetail/components/ExamParts/components/ExamQuestions/components/QuestionDetail";
import QuestionEdit from "../Components/AdminPanel-Component/ExamDetail/components/ExamParts/components/ExamQuestions/components/QuestionEdit";
import ExamPartDetail from "../Components/AdminPanel-Component/ExamDetail/components/ExamParts/components/ExamQuestions/ExamPartDetail";
import ExamSectionDetail from "../Components/AdminPanel-Component/ExamDetail/components/ExamParts/ExamSectionDetail";
import ExamDetail from "../Components/AdminPanel-Component/ExamDetail/ExamDetail";
import ExamKeyGenerate from "../Components/AdminPanel-Component/ExamKeyGenerate/ExamKeyGenerate";
import Finance from "../Components/AdminPanel-Component/Finance/Finance";
import KeyPrice from "../Components/AdminPanel-Component/KeyPrice/KeyPrice";
import LoginStudyCenter from "../Components/AdminPanel-Component/LoginStudyCenter/LoginStudyCenter";
import Price from "../Components/AdminPanel-Component/Price/Price";
import Reyting from "../Components/AdminPanel-Component/Reyting/Reyting";
import StudyCenterDashboard from "../Components/AdminPanel-Component/Study-Center-Dashboard/StudyCenterDashboard";
import StudyCenterDetail from "../Components/AdminPanel-Component/StudyCenter-Detail/StudyCenterDetail";
import StudyCenter from "../Components/AdminPanel-Component/StudyCenter/StudyCenter";
import TkExamDetail from "../Components/AdminPanel-Component/TkExam-Detail/TkExamDetail";
import TkExamDetailsSpeaking from "../Components/AdminPanel-Component/TkExam-Detail/TkExamDetailsSpeaking";
import TkExamDetailWriting from "../Components/AdminPanel-Component/TkExam-Detail/TkExamDetailWriting";
import TkExam from "../Components/AdminPanel-Component/TkExam/TkExam";
import Profile from "../Components/AdminPanel-Component/Profile/Profile";
import UserStudyCenter from '../Components/UserPanel-Component/StudyCenter/StudyCenter'
import Contact from "../Components/UserPanel-Component/Contact/Contact";
import Exams from "../Components/UserPanel-Component/Exams/Exams";
import ExamSolution from "../Components/UserPanel-Component/ExamSolution/ExamSolution";
import Login from "../Components/UserPanel-Component/Login/Login";
import Payment from "../Components/UserPanel-Component/Payment/Payment";
import UserProfile from "../Components/UserPanel-Component/Profile/UserProfile";
import MyResult from "../Components/UserPanel-Component/MyResult/MyResult";
import MyResultDetail from "../Components/UserPanel-Component/MyResultDetail/MyResultDetail";
import SectionDetail from "../Components/UserPanel-Component/MyResultDetail/SectionDetail";
import Rating from "../Components/UserPanel-Component/Rating/Rating";
import ExamifyExams from "../Components/UserPanel-Component/ExamifyExams/ExamifyExams";


export const UserRoutes = [
    {
        name: "Contact",
        path: "contact",
        component: <Contact />,
    },
    {
        name: 'User profile',
        path: '/profil',
        component: <UserProfile />
    },
    {
        name: 'My Result',
        path: '/my-result',
        component: <MyResult />
    },
    {
        name: 'My Result Detail',
        path: '/my-result/:resultId',
        component: <MyResultDetail />
    },
    {
        name: 'Section Detail',
        path: '/my-result/:resultId/:sectionId',
        component: <SectionDetail />
    },
    {
        name: "Study center",
        path: "/study-center",
        component: <UserStudyCenter />,
    },
    {
        name: "Exams",
        path: "/study-center/:stID",
        component: <Exams />,
    },
    {
        name: "Examify Exams",
        path: "/exams",
        component: <ExamifyExams />,
    },
    {
        name: "Rating",
        path: "/rating",
        component: <Rating />,
    },
    {
        name: "Exams Solution",
        path: "/exam-solution/:ID",
        component: <ExamSolution />,
    },
    {
        name: "Payment",
        path: "payment",
        component: <Payment />,
    },
    {
        name: "Login",
        path: 'login',
        component: <Login />
    },
    {
        name: "Login Study center",
        path: 'login/study-center',
        component: <LoginStudyCenter />
    },
    {
        name: "Login Admin",
        path: 'admin-login',
        component: <AdminLogin />
    }
];

export const AdminRoutes = [

    {
        name: "Dashboard",
        path: "dashboard",
        component: <Dashboard />,
    },
    {
        name: "Profil",
        path: "/admin/profile",
        component: <Profile />,
    },
    {
        name: "Oq`uv markaz",
        path: "/o'quv_markazlar",
        component: <StudyCenter />,
    },
    {
        name: "Oq`uv markaz",
        path: "/o'quv_markaz/:studyCenterId",
        component: <StudyCenterDetail />,
    },
    {
        name: "Barcha tolovlar",
        path: "/o'quv_markaz/tolovlar",
        component: <AllPayment />,
    },
    {
        name: "Moliya",
        path: "/o'quv_markaz/moliya",
        component: <Finance />,
    },
    {
        name: "Narxlar",
        path: "/o'quv_markaz/narx",
        component: <Price />,
    },
    {
        name: "Kalit narxi",
        path: "/o'quv_markaz/kalit-narxi",
        component: <KeyPrice />,
    },


    // Study-Center
    {
        name: "Oq`uv markaz dashboard",
        path: "/o'quv_markaz",
        component: <StudyCenterDashboard />,
    },
    {
        name: "Exam",
        path: "/o'quv_markaz/imtihon",
        component: <Exam />,
    },
    {
        name: "Exam-info",
        path: "/o'quv_markaz/imtihon/:examID",
        component: <ExamDetail />,
    },
    {
        name: "Part detail",
        path: "/o'quv_markaz/imtihon/qism/:partID",
        component: <ExamPartDetail />,
    },
    {
        name: "Exam-section-detail",
        path: "/o'quv_markaz/imtihon/bolim/:sectionID",
        component: <ExamSectionDetail />,
    },
    {
        name: "Exam questions",
        path: "/o'quv_markaz/imtihon/qism/savol/:questionID",
        component: <QuestionDetail />
    },
    {
        name: "Exam questions create",
        path: "/o'quv_markaz/imtihon/qism/savol-yatatish/:partID",
        component: <QuestionCreate />
    },
    {
        name: "Exam questions edit",
        path: "/o'quv_markaz/imtihon/qism/savol-tahrirlash/:partID/:questionID",
        component: <QuestionEdit />
    },
    {
        name: "Exam-Key",
        path: "/o'quv_markaz/imtihon/kalit",
        component: <ExamKey />,
    },
    {
        name: "Exam-Key",
        path: "/o'quv_markaz/imtihon/kalit/:examID",
        component: <ExamKeyGenerate />,
    },
    {
        name: "Reyting",
        path: "/o'quv_markaz/imtihon/reyting",
        component: <Reyting />,
    },
    {
        name: "Tekshirilmagan Imtihonlar",
        path: "/o'quv_markaz/imtihon/tekshirilmagan_imtihonlar",
        component: <TkExam />,
    },
    {
        name: "Tekshirilmagan Imtihonlar Batafsil",
        path: "/o'quv_markaz/imtihon/tekshirilmagan_imtihonlar/:tkExamId",
        component: <TkExamDetail />,
    },
    {
        name: "Tekshirilmagan Imtihonlar Batafsil Speaking",
        path: "/o'quv_markaz/imtihon/tekshirilmagan_imtihonlar/:tkExamId/speaking/:sectionID",
        component: <TkExamDetailsSpeaking />,
    },
    {
        name: "Tekshirilmagan Imtihonlar Batafsil Writing",
        path: "/o'quv_markaz/imtihon/tekshirilmagan_imtihonlar/:tkExamId/writing/:sectionID",
        component: <TkExamDetailWriting />,
    },

];