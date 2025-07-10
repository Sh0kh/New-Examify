import { useParams } from "react-router-dom";
import { $api } from "../../../utils";
import { useEffect, useState } from "react";
import ReactLoading from 'react-loading';
import { StyledAppBar, NavBarContent } from "../NavBar/components/NavbarStyle";
import Info from "./Components/Info";
import CenterExam from "./Components/CenterExam/CenterExam";
import Payment from "./Components/Payment";
import StKey from "./Components/StKey";

export default function StudyCenterDetail() {
    const { studyCenterId } = useParams();
    const [center, setCenter] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("info");
    const [fade, setFade] = useState(false); // для анимации

    const getStudyCenterDetails = async () => {
        setLoading(true);
        try {
            const response = await $api.get(`/admin/study-centers/${studyCenterId}`);
            setCenter(response.data);
        } catch (error) {
            console.error("Error fetching study center details:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getStudyCenterDetails();
    }, [studyCenterId]);

    const handleTabChange = (tab) => {
        setFade(false);
        setTimeout(() => {
            setActiveTab(tab);
            setFade(true);
        }, 150); // плавный переход
    };

    useEffect(() => {
        setFade(true);
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[500px]">
                <ReactLoading type="spinningBubbles" color="#1976d2" height={80} width={80} />
            </div>
        );
    }

    if (!center) {
        return <div className="text-center text-red-500 py-10">Ma'lumot topilmadi</div>;
    }

    return (
        <div className="px-4 pb-6">

            <StyledAppBar className="!p-0 !z-10">
                <NavBarContent>
                    <h1 className="text-[black] font-bold text-[25px]">
                        {center.name}
                    </h1>
                </NavBarContent>
            </StyledAppBar>

            <div className="flex gap-4 mt-3 mb-2">
                <button
                    onClick={() => handleTabChange("info")}
                    className={`px-4 py-2 rounded-lg font-medium transition ${activeTab === "info"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                >
                    Ma'lumotlar
                </button>
                <button
                    onClick={() => handleTabChange("Imtihonlar")}
                    className={`px-4 py-2 rounded-lg font-medium transition ${activeTab === "Imtihonlar"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                >
                    Imtihonlar
                </button>
                <button
                    onClick={() => handleTabChange("courses")}
                    className={`px-4 py-2 rounded-lg font-medium transition ${activeTab === "courses"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                >
                    Foydalanuvchilar To’lovlari
                </button>
            </div>
            <div
                className={`transition-opacity duration-500 ${fade ? "opacity-100" : "opacity-0"
                    } mt-6`}
            >
                {activeTab === "info" && <Info center={center} />}
                {activeTab === "Imtihonlar" && (
                    <CenterExam />
                )}
                {activeTab === "courses" && (
                    <Payment />
                )}
                {activeTab === "key" && (
                    <StKey />
                )}
            </div>
        </div>
    );
}
