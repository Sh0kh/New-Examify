import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";

export default function Payment() {
    const [amount, setAmount] = useState("");
    const { state } = useLocation();

    useEffect(() => {
        if (state?.examPrice) {
            setAmount(formatAmount(state.examPrice.toString()));
        }
    }, [state]);

    const formatAmount = (value) => {
        const numericValue = value.replace(/\D/g, "");
        return new Intl.NumberFormat("ru-RU").format(numericValue);
    };

    const handleChange = (e) => {
        const rawValue = e.target.value;
        setAmount(formatAmount(rawValue));
    };

    return (
        <>
            <Header />
            <div className="min-h-screen mt-[100px]">
                <div className="container max-w-md">
                    <div className="border shadow-md p-5 rounded-lg bg-white">
                        <h1 className="text-2xl font-bold mb-4 text-gray-800">
                            Top Up Your Balance
                        </h1>
                        {state?.examPrice && (
                            <div className="mb-6 p-4 rounded-lg bg-blue-50 border border-blue-200">
                                <h2 className="text-md text-blue-700 font-medium">
                                    This exam requires a payment of{" "}
                                    <span className="font-bold text-blue-900">
                                        {formatAmount(state.examPrice.toString())} UZS
                                    </span>
                                </h2>
                            </div>
                        )}

                        <label className="block w-full mb-4">
                                <span className="mb-2 block text-gray-700">
                                    Enter the amount
                                </span>
                            <input
                                type="text"
                                value={amount}
                                onChange={handleChange}
                                className="border-2 outline-blue-600 rounded-md px-3 py-2 w-full"
                                placeholder="Enter amount"
                            />
                        </label>
                        <form
                            method="POST"
                            action="https://checkout.paycom.uz"
                            className="mt-2"
                        >
                            <input type="hidden" name="merchant" value="67979d7c0e6d62c2be2349aa" />
                            <input type="hidden" name="amount" value={amount ? amount.replace(/\s/g, "") * 100 : ""} />
                            <input type="hidden" name="account[id]" value={localStorage.getItem('user_id')} />
                            <input type="hidden" name="lang" value="uz" />
                            <input type="hidden" name="callback" value="https://examify.uz" />
                            <input type="hidden" name="callback_timeout" value="100" />
                            <input type="hidden" name="description" value="" />
                            <input type="hidden" name="detail" value="" />
                            <button
                                type="submit"
                                className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition mt-2"
                                disabled={!amount || amount.replace(/\s/g, "") <= 0}
                            >
                                Pay
                            </button>
                        </form>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}
