import {
    Typography,
    Tabs,
    TabsHeader,
    Tab,
    Card,
} from "@material-tailwind/react";
import { useState } from "react";
import PravidExamFinance from "./components/PravidExamFinance";
import PaidExamFinance from "./components/PaidExamFinance";

export default function Finance() {
    const [activeTab, setActiveTab] = useState("pravid");

    const tabData = [
        { label: "Pravid Exam", value: "pravid" },
        { label: "Paid Exam", value: "paid" },
    ];

    return (
        <div className="p-6 mx-auto">
            <Typography
                variant="h5"
                color="blue-gray"
                className="font-semibold mb-4"
            >
                Moliya
            </Typography>

            <Tabs value={activeTab} className="mb-6">
                <TabsHeader
                    className="rounded-lg shadow-sm p-1 bg-blue-50"
                    indicatorProps={{
                        className: "bg-blue-500 rounded-md shadow-md",
                    }}
                >
                    {tabData.map(({ label, value }) => (
                        <Tab
                            key={value}
                            value={value}
                            onClick={() => setActiveTab(value)}
                            className={`text-sm font-medium transition-all duration-300 ${activeTab === value
                                    ? "text-white"
                                    : "text-blue-gray-700"
                                }`}
                        >
                            {label}
                        </Tab>
                    ))}
                </TabsHeader>
            </Tabs>

            <div className="transition-all duration-300">
                {activeTab === "pravid" && <PravidExamFinance />}
                {activeTab === "paid" && <PaidExamFinance />}
            </div>
        </div>
    );
}
