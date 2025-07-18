import {
    Card,
    CardBody,
    Typography,
    Avatar,
    Button,
} from "@material-tailwind/react";
import {
    BanknotesIcon,
    ArrowRightOnRectangleIcon,
    PencilSquareIcon,
    MapPinIcon,
    ChartBarSquareIcon,
} from "@heroicons/react/24/solid";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { $api } from "../../../utils";
import { Phone } from "lucide-react";
import Loading from "../../UI/Loadings/Loading";
import UserEdit from "./component/UserEdit";
import CONFIG from "../../../utils/Config";

export default function UserProfile() {
    const navigate = useNavigate();
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)
    const getProfile = async () => {
        setLoading(true)
        try {
            const response = await $api.get("/user/profile");
            setData(response?.data?.user || [])
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getProfile()
    }, [])

    const user = {
        firstName: "John",
        lastName: "Doe",
        balance: 125000,
        location: "Tashkent, Uzbekistan",
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate("/login");
    };

    const handleResults = () => {
        navigate("/my-result");
    };


    if (loading) {
        return (
            <Loading />
        )
    }

    return (
        <>
            <Header />
            <div className="flex justify-center items-center min-h-screen ">
                <Card className="w-full max-w-[1200px] rounded-2xl">
                    <CardBody className="flex flex-col sm:flex-row items-center sm:items-start gap-6 p-8">
                        <Avatar
                            src={CONFIG?.API_URL + data?.photo}
                            alt="avatar"
                            size="xxl"
                            className="ring-4 ring-blue-500"
                        />
                        <div className="flex flex-col items-center sm:items-start w-full">
                            <Typography variant="h4" color="blue-gray" className="mb-1">
                                {data?.name}
                            </Typography>

                            <div className="flex items-center text-gray-600 mb-2 gap-2">
                                <Phone className="h-5 w-5 text-blue-500" />
                                <span className="text-sm">{data?.phoneNumber}</span>
                            </div>

                            <div className="flex items-center text-green-600 text-lg font-semibold gap-2 mb-6">
                                <BanknotesIcon className="h-6 w-6" />
                                {Number(data.balance).toLocaleString() + " UZS"}
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3 w-full">
                                <UserEdit data={data} refresh={getProfile} />

                                <Button
                                    fullWidth
                                    color="gray"
                                    className="flex items-center justify-center gap-2"
                                    onClick={handleResults}
                                >
                                    <ChartBarSquareIcon className="h-5 w-5" />
                                    My Results
                                </Button>

                                <Button
                                    fullWidth
                                    color="red"
                                    className="flex items-center justify-center gap-2"
                                    onClick={handleLogout}
                                >
                                    <ArrowRightOnRectangleIcon className="h-5 w-5" />
                                    Log out
                                </Button>
                            </div>
                        </div>
                    </CardBody>
                </Card>
            </div>
            <Footer />
        </>
    );
}
