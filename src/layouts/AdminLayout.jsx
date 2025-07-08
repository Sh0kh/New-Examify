import { Outlet } from "react-router-dom";
import SideBar from "../Components/AdminPanel-Component/SideBar/SideBar";
import NavBar from "../Components/AdminPanel-Component/NavBar/NavBar";

export default function AdminLayout() {
    return (
        <div className="flex w-[100%] overflow-hidden bg-[#F5F6F7]">
            <SideBar />
            <div className="w-full ml-[280px] h-screen overflow-y-auto">
                <NavBar />
                <Outlet />
            </div>
        </div>
    )
}