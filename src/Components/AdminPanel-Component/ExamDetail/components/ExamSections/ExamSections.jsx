import { CardBody, Typography, Card, Button } from "@material-tailwind/react";
import ExamSectionsCreate from "./components/ExamSectionsCreate";
import { NavLink } from "react-router-dom";
import ExamSectionEdit from "./components/ExamSectionEdit";

export default function ExamSections({ sectionData, refresh }) {
    return (
        <>
            <div className="flex items-start justify-between">
                <Typography variant="h3" className="font-semibold mb-2">
                    Exam sections
                </Typography>
                <ExamSectionsCreate refresh={refresh} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 !mt-[10px]">
                {sectionData.map((item, index) => (
                    <Card key={index} className="shadow-md border border-gray-300">
                        <CardBody>
                            <Typography variant="h5" className="font-semibold mb-2">
                                {item?.type}
                            </Typography>
                            <Typography className="text-gray-600">{item?.description}</Typography>
                            <div className="flex items-center gap-[10px] mt-[10px]">
                                <NavLink to={`/o'quv_markaz/imtihon/bolim/${item?.id}`}>
                                    <Button color="blue">
                                        Ko'rish
                                    </Button>
                                </NavLink>
                                <ExamSectionEdit section={item} refresh={refresh} />
                            </div>
                        </CardBody>
                    </Card>
                ))}
            </div >
        </>
    )
}