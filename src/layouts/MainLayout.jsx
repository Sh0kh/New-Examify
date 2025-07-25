import { Outlet, useLocation } from "react-router-dom";
import Header from "../Components/UserPanel-Component/Header/Header";
import Footer from "../Components/UserPanel-Component/Footer/Footer";

export default function MainLayout() {
    const location = useLocation();
    const hideLayout = location.pathname.startsWith("/exam-solution");

    return (
        <div>
            {!hideLayout && <Header />}
            <Outlet />
            {!hideLayout && <Footer />}
        </div>
    );
}
