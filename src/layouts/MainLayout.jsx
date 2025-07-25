import { Outlet } from "react-router-dom";
import Header from "../Components/UserPanel-Component/Header/Header";
import Footer from "../Components/UserPanel-Component/Footer/Footer";


export default function MainLayout() {
    return (
        <div>
            <Header />
            <Outlet />
            <Footer />
        </div>
    )
}