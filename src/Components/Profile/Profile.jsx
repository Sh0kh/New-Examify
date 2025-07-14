import {
    Card,
    CardBody,
    CardHeader,
    Typography,
    Avatar,
} from "@material-tailwind/react";
import AvatarLogo from '@/Images/FotoPerson.jpg';
import { Button } from "@mui/material";
import { $api } from "../../utils";
import { useEffect, useState } from "react";
import ProfileEditModal from "./components/ProfileEditModal";
import Loading from "../UI/Loadings/Loading";

export default function Profile() {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const role = localStorage.getItem('role');



    const getMyProfile = async () => {
        const role = localStorage.getItem('role');
        setLoading(true);
        try {
            if (role === 'ST_ADMIN') {
                const response = await $api.get(`/study-center/profile`)
                setData(response?.data || []);

            } else {
                const response = await $api.get(`/admin/profile`)
                setData(response?.data?.user || []);
            }
        } catch (error) {
            console.error("Error fetching profile data:", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getMyProfile()
    }, [])

    if (loading) {
        return (
            <Loading />
        )
    }

    return (
        <div className="min-h-screen p-6">
            <Card className="w-full max-w-sm shadow-md border border-blue-200 bg-white flex flex-col justify-between">
                <CardHeader floated={false} className="flex justify-center bg-white py-6">
                    <Avatar
                        size="xxl"
                        alt="user avatar"
                        src={AvatarLogo}
                        className="ring-4 ring-blue-500"
                    />
                </CardHeader>
                <CardBody className="text-center flex flex-col flex-grow justify-between">
                    <div>
                        <Typography variant="h5" color="blue-gray" className="mb-2">
                            {data?.name}
                        </Typography>
                        <Typography color="blue" className="text-sm font-medium">
                            {data?.phoneNumber || data?.phone}
                        </Typography>
                    </div>
                    {role !== 'ST_ADMIN' && (
                        <div className="mt-6">
                            <ProfileEditModal data={data} />
                        </div>
                    )}
                </CardBody>
            </Card>
        </div>
    );
}
