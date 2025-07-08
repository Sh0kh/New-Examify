import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react'; 
import axios from '../../../utils/axios';


export default function LoginStudyCenter() {
    const [phone, setPhone] = useState('+998');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');


    const navigate = useNavigate();

    const handlePhoneChange = (e) => {
        let value = e.target.value.replace(/[^\d+]/g, '');
        if (!value.startsWith('+998')) {
            value = '+998';
        }
        if (value.length > 13) {
            value = value.slice(0, 13);
        }
        setPhone(value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await axios.post('/study-center/login', {
                phone,
                password,
            });
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('StId', response.data.study_center?.id);
            localStorage.setItem('role', 'ST_ADMIN');
            navigate(`/o'quv_markaz`);
        } catch (err) {
            setError('Telefon yoki parol noto‘g‘ri. Iltimos qaytadan urinib ko‘ring.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6 space-y-6">
                <h2 className="text-2xl font-bold text-center text-gray-800">O'quv markazga kirish</h2>

                {error && (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 rounded">
                        <p>{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                            Telefon raqam
                        </label>
                        <input
                            id="phone"
                            type="text"
                            placeholder="+998970206868"
                            value={phone}
                            onChange={handlePhoneChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                            Parol
                        </label>
                        <div className="relative">
                            <input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 focus:outline-none"
                                tabIndex={-1}
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md transition duration-200 ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-700'
                            }`}
                    >
                        {loading ? 'Kirish...' : 'Kirish'}
                    </button>
                </form>
            </div>
        </div>
    );
}
