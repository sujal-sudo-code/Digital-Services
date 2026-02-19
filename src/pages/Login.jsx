import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';
import Title from '../components/Title';
import { PrimaryButton } from '../components/Buttons';
import { LoaderIcon, AlertCircleIcon } from 'lucide-react';

export default function Login() {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            console.log('Logged in!');
            // After successful login, redirect to admin dashboard
            navigate('/admin');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen pt-20 px-4">
            <div className="w-full max-w-md bg-white/5 border border-white/10 p-8 rounded-2xl shadow-xl backdrop-blur-md">
                <Title title="Admin Access" heading="Login" description="Enter your credentials to access the admin panel." />
                
                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-200 p-3 rounded-lg flex items-center gap-2 text-sm mb-4">
                        <AlertCircleIcon className="size-4 shrink-0" />
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-4 mt-6">
                    <div>
                        <label className="block text-sm text-gray-300 mb-1">Email</label>
                        <input
                            type="email"
                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 outline-none focus:border-blue-500/50 transition"
                            placeholder="admin@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-300 mb-1">Password</label>
                        <input
                            type="password"
                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 outline-none focus:border-blue-500/50 transition"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <PrimaryButton type="submit" className="w-full justify-center" disabled={loading}>
                        {loading ? <LoaderIcon className="animate-spin size-4" /> : 'Login'}
                    </PrimaryButton>
                </form>
            </div>
        </div>
    );
}
