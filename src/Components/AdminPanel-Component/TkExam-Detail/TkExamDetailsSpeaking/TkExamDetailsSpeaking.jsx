import {
    Card,
    CardBody,
    Typography,
    Button,
    Input,
    Tabs,
    TabsHeader,
    TabsBody,
    Tab,
    TabPanel
} from "@material-tailwind/react";
import { $api } from "../../../../utils";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Loading from "../../../UI/Loadings/Loading";
import CONFIG from "../../../../utils/Config";
import { Alert } from "../../../../utils/Alert";
import TkExamDetailCheck from "./components/TkExamDetailCheck";
import TkExamSingleCheck from "./components/TkExamSingleCheck";




export default function TkExamDetailsSpeaking() {
    const { tkExamId, sectionID } = useParams();
    const [activeTab, setActiveTab] = useState("detailed");

    return (
        <div className="min-h-screen p-6">
            <Tabs value={activeTab}>
                <TabsHeader
                    className="bg-white"
                    indicatorProps={{ className: "bg-blue-500 shadow-md text-white" }}
                >
                    <Tab
                        value="detailed"
                        onClick={() => setActiveTab("detailed")}
                        className={activeTab === "detailed" ? "text-white" : "text-black"}
                    >
                        Batafsil baholash
                    </Tab>
                    <Tab
                        value="quick"
                        onClick={() => setActiveTab("quick")}
                        className={activeTab === "quick" ? "text-white" : "text-black"}
                    >
                        Tezkor baholash
                    </Tab>
                </TabsHeader>

                <TabsBody>
                    <TabPanel className="p-[0px] mt-[20px]" value="detailed">
                        <TkExamDetailCheck tkExamId={tkExamId} sectionID={sectionID} />
                    </TabPanel>
                    <TabPanel value="quick">
                        <TkExamSingleCheck />
                    </TabPanel>
                </TabsBody>
            </Tabs>

        </div>
    );
}
