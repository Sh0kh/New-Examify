import { useState } from "react";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";

export default function Payment() {
    const [amount, setAmount] = useState("");




    const formatAmount = (value) => {
        const numericValue = value.replace(/\D/g, ""); // Убираем все нецифровые символы
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
                    <div className="border shadow-md p-5 rounded-lg">
                        <h1 className="text-2xl font-bold mb-4">
                            Hisobni to'ldirish
                        </h1>
                        <label className="block w-full">
                            <span className="mb-2 block">
                                Summani kiriting
                            </span>
                            <input
                                type="text"
                                value={amount}
                                onChange={handleChange}
                                className="border-2 outline-blue-600 rounded-md px-3 py-2 w-full"
                                placeholder="Summani kiriting"
                            />
                        </label>
                        <form
                            method="POST"
                            action="https://checkout.paycom.uz"
                            className="mt-4"
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
                                To'lash
                            </button>
                        </form>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}
