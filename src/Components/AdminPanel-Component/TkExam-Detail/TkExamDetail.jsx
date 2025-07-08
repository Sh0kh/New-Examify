import {
    Card,
    CardBody,
    Typography,
} from "@material-tailwind/react";
import { NavLink } from "react-router-dom";

export default function TkExamDetail() {
    return (
        <div className="min-h-screen p-6 space-y-6">
            <NavLink className={'block'} to={`/o'quv_markaz/imtihon/tekshirilmagan_imtihonlar/:tkExamId/speaking`}>
                <Card className="w-full  mx-auto border border-blue-200 shadow-md bg-white">
                    <CardBody>
                        <Typography variant="h5" color="blue-gray" className="mb-2">
                            Speakin
                        </Typography>
                        <Typography color="gray" className="text-sm">
                            Подробности о первом экзамене, дата, результаты и т.д.
                        </Typography>
                    </CardBody>
                </Card>
            </NavLink>

            <NavLink className={'block'} to={`/o'quv_markaz/imtihon/tekshirilmagan_imtihonlar/:tkExamId/writing`}>
                <Card  className="w-full  mx-auto border border-blue-200 shadow-md bg-white">
                    <CardBody>
                        <Typography variant="h5" color="blue-gray" className="mb-2">
                            Writing
                        </Typography>
                        <Typography color="gray" className="text-sm">
                            Подробности о втором экзамене, дата, результаты и т.д.
                        </Typography>
                    </CardBody>
                </Card>
            </NavLink>
        </div>
    );
}
