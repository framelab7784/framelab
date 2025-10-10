import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Spinner } from './Spinner';
import { AuthInput } from './AuthInput';

const MailIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
);

const LockIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
);

const AuthModal: React.FC = () => {
    const { login, register } = useAuth();
    const { t } = useLanguage();
    const [mode, setMode] = useState<'login' | 'register'>('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [formErrors, setFormErrors] = useState<{ email?: string; password?: string }>({});


    const validateForm = () => {
        const errors: { email?: string; password?: string } = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!email.trim()) {
            errors.email = t('emailRequired');
        } else if (!emailRegex.test(email)) {
            errors.email = t('emailInvalid');
        }

        if (!password) {
            errors.password = t('passwordRequired');
        } else if (password.length < 6) {
            errors.password = t('passwordMinLength');
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setMessage(null);
        
        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            if (mode === 'login') {
                await login(email, password);
                // Jika berhasil, modal akan dilepas secara otomatis
            } else {
                await register(email, password);
                setMessage("Pendaftaran berhasil. Silakan hubungi admin (Whatsapp.0851-5614-5763) untuk mengaktifkan akun Anda setelah melakukan Pembayaran.");
                setMode('login'); // Beralih ke form login
            }
        } catch (err: any) {
             const defaultError = 'Terjadi kesalahan yang tidak diketahui.';
             let errorMessage = err.message || defaultError;
             if (errorMessage.includes("Invalid login credentials")) {
                errorMessage = "Email atau password salah. Silakan coba lagi.";
             } else if (errorMessage.includes("User not found")) {
                 errorMessage = "Pengguna tidak ditemukan.";
             } else if (errorMessage.includes("rate limit")) {
                 errorMessage = "Terlalu banyak percobaan. Silakan coba lagi nanti.";
             } else if (errorMessage.includes("Akun Anda belum diaktifkan")) {
                errorMessage = "Akun Anda belum diaktifkan oleh administrator.";
             }
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const switchMode = (newMode: 'login' | 'register') => {
        setMode(newMode);
        setError(null);
        setMessage(null);
        setFormErrors({});
        setEmail('');
        setPassword('');
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/80 backdrop-blur-sm">
            <div className="w-full max-w-md p-8 space-y-6 bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-white">{mode === 'login' ? 'Selamat Datang Kembali' : 'Buat Akun'}</h1>
                    <p className="mt-2 text-sm text-gray-400">
                        {mode === 'login' ? 'Masuk untuk melanjutkan ke Frame Lab' : 'Mulai dengan akun baru Anda'}
                    </p>
                </div>
                
                <div className="flex justify-center p-1 bg-gray-900/70 rounded-lg">
                    <button
                        onClick={() => switchMode('login')}
                        className={`w-full py-2 text-sm font-semibold rounded-md transition-colors ${mode === 'login' ? 'bg-lime-500 text-gray-900' : 'text-gray-400 hover:bg-gray-700'}`}
                    >
                        Login
                    </button>
                    <button
                        onClick={() => switchMode('register')}
                        className={`w-full py-2 text-sm font-semibold rounded-md transition-colors ${mode === 'register' ? 'bg-lime-500 text-gray-900' : 'text-gray-400 hover:bg-gray-700'}`}
                    >
                        Daftar
                    </button>
                </div>
                
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <AuthInput
                            id="email"
                            label="Email"
                            type="email"
                            icon={<MailIcon className="h-5 w-5" />}
                            placeholder="email@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        {formErrors.email && <p className="text-xs text-red-400 mt-1 pl-1">{formErrors.email}</p>}
                    </div>
                     <div>
                        <AuthInput
                            id="password"
                            label="Password"
                            type="password"
                            icon={<LockIcon className="h-5 w-5" />}
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={6}
                        />
                        {formErrors.password && <p className="text-xs text-red-400 mt-1 pl-1">{formErrors.password}</p>}
                    </div>

                    {error && <p className="text-xs text-center text-red-400 bg-red-900/30 p-2 rounded-md">{error}</p>}
                    {message && <p className="text-xs text-center text-green-400 bg-green-900/30 p-2 rounded-md">{message}</p>}

                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-gray-900 bg-lime-500 hover:bg-lime-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lime-500 disabled:bg-lime-500/50 disabled:cursor-not-allowed"
                        >
                            {loading ? <Spinner /> : (mode === 'login' ? 'Masuk' : 'Daftar')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AuthModal;