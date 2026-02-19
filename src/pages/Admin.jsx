import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';
import Title from '../components/Title';
import { LoaderIcon, CheckCircleIcon, XCircleIcon, AlertCircleIcon, CalendarIcon, LogOutIcon, SearchIcon, FilterIcon, MailIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Admin() {
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);
    const [filter, setFilter] = useState('all'); // all | pending | resolved
    const [search, setSearch] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const getUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                navigate('/login');
            } else {
                setUser(session.user);
                fetchSubmissions();
            }
        };
        getUser();
    }, [navigate]);

    const fetchSubmissions = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('submissions')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setSubmissions(data || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/login');
    };

    const updateStatus = async (id, newStatus) => {
        const originalSubmissions = [...submissions];
        // Optimistic update
        setSubmissions(prev => prev.map(sub => 
            sub.id === id ? { ...sub, status: newStatus } : sub
        ));

        try {
            const { error } = await supabase
                .from('submissions')
                .update({ status: newStatus })
                .eq('id', id);

            if (error) throw error;
        } catch (err) {
            console.error('Error updating status:', err);
            setError('Failed to update status');
            // Revert
            setSubmissions(originalSubmissions);
        }
    };

    const filteredSubmissions = submissions.filter(sub => {
        const matchesFilter = filter === 'all' || sub.status === filter;
        const matchesSearch = 
            sub.name.toLowerCase().includes(search.toLowerCase()) || 
            sub.email.toLowerCase().includes(search.toLowerCase()) ||
            (sub.problem && sub.problem.toLowerCase().includes(search.toLowerCase()));
        return matchesFilter && matchesSearch;
    });

    const stats = {
        total: submissions.length,
        pending: submissions.filter(s => s.status === 'pending').length,
        resolved: submissions.filter(s => s.status === 'resolved').length
    };

    if (!user) return null;

    return (
        <div className="min-h-screen pt-32 px-4 pb-20 max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                        Admin Dashboard
                    </h1>
                    <p className="text-gray-400 text-sm mt-1">Manage inquiries and support tickets</p>
                </div>
                
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="hidden md:flex flex-col items-end mr-4">
                        <span className="text-xs text-gray-500">Logged in as</span>
                        <span className="text-sm font-medium text-gray-300">{user.email}</span>
                    </div>
                    <button 
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition text-sm font-medium border border-red-500/20 ml-auto md:ml-0"
                    >
                        <LogOutIcon className="size-4" />
                        Logout
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex items-center justify-between">
                    <div>
                        <p className="text-gray-400 text-sm">Total Inquiries</p>
                        <h3 className="text-2xl font-bold text-white mt-1">{stats.total}</h3>
                    </div>
                    <div className="bg-blue-500/20 p-3 rounded-xl border border-blue-500/30">
                        <MailIcon className="text-blue-400 size-6" />
                    </div>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex items-center justify-between">
                    <div>
                        <p className="text-gray-400 text-sm">Pending</p>
                        <h3 className="text-2xl font-bold text-yellow-400 mt-1">{stats.pending}</h3>
                    </div>
                    <div className="bg-yellow-500/20 p-3 rounded-xl border border-yellow-500/30">
                        <AlertCircleIcon className="text-yellow-400 size-6" />
                    </div>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex items-center justify-between">
                    <div>
                        <p className="text-gray-400 text-sm">Resolved</p>
                        <h3 className="text-2xl font-bold text-green-400 mt-1">{stats.resolved}</h3>
                    </div>
                    <div className="bg-green-500/20 p-3 rounded-xl border border-green-500/30">
                        <CheckCircleIcon className="text-green-400 size-6" />
                    </div>
                </div>
            </div>

            {/* Error Banner */}
            {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-200 p-4 rounded-xl flex items-center gap-3 mb-8">
                    <AlertCircleIcon className="size-5 shrink-0" />
                    {error}
                </div>
            )}

            {/* Filters & Search */}
            <div className="flex flex-col md:flex-row justify-between gap-4 mb-6 sticky top-24 z-30 bg-black/80 backdrop-blur-md p-4 rounded-2xl border border-white/5 shadow-2xl">
                <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
                    {['all', 'pending', 'resolved'].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition capitalize ${
                                filter === f 
                                    ? 'bg-blue-600 text-white shadow-lg' 
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                            }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>

                <div className="relative">
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 size-4" />
                    <input 
                        type="text" 
                        placeholder="Search name, email..." 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full md:w-64 pl-10 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-blue-500/50 transition placeholder-gray-600"
                    />
                </div>
            </div>

            {/* Content using AnimatePresence for smooth filtering */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <LoaderIcon className="size-10 animate-spin text-blue-400 mb-4" />
                    <p className="text-gray-500">Loading submissions...</p>
                </div>
            ) : filteredSubmissions.length === 0 ? (
                <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/10 flex flex-col items-center">
                    <div className="bg-white/5 p-4 rounded-full mb-4">
                        <FilterIcon className="size-8 text-gray-600" />
                    </div>
                    <h3 className="text-lg font-medium text-white">No submissions found</h3>
                    <p className="text-gray-500 mt-1 max-w-sm">
                        {search 
                            ? `No results matching "${search}"` 
                            : filter !== 'all' 
                                ? `No ${filter} tickets at the moment.` 
                                : "Your inbox is empty. Good job!"}
                    </p>
                    {search && (
                        <button 
                            onClick={() => setSearch('')}
                            className="mt-4 text-blue-400 text-sm hover:underline"
                        >
                            Clear Search
                        </button>
                    )}
                </div>
            ) : (
                <div className="grid gap-4">
                    <AnimatePresence>
                        {filteredSubmissions.map((sub) => (
                            <motion.div 
                                key={sub.id}
                                layout
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className={`
                                    relative overflow-hidden rounded-2xl border p-6 transition-all duration-300 group
                                    ${sub.status === 'resolved' 
                                        ? 'bg-white/2 border-white/5 opacity-75 hover:opacity-100' 
                                        : 'bg-white/5 border-white/10 hover:bg-white/8 hover:border-blue-500/20 hover:shadow-lg hover:shadow-blue-900/10'
                                    }
                                `}
                            >
                                {/* Status Indicator Strip */}
                                <div className={`absolute left-0 top-0 bottom-0 w-1 ${sub.status === 'pending' ? 'bg-yellow-500' : 'bg-green-500'}`} />

                                <div className="flex flex-col md:flex-row justify-between gap-6">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-lg font-semibold text-white">{sub.name}</h3>
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                                                sub.status === 'resolved' 
                                                    ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                                                    : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                                            }`}>
                                                {sub.status || 'New'}
                                            </span>
                                        </div>
                                        
                                        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-400 mb-4">
                                            <div className="flex items-center gap-2">
                                                <MailIcon className="size-3.5" />
                                                {sub.email}
                                            </div>
                                            {sub.phone && (
                                                <div className="flex items-center gap-2">
                                                    <span className="text-gray-600">|</span>
                                                    <span>{sub.phone}</span>
                                                </div>
                                            )}
                                            <div className="flex items-center gap-2">
                                                <span className="text-gray-600">|</span>
                                                <CalendarIcon className="size-3.5" />
                                                <span>{new Date(sub.created_at).toLocaleDateString()}</span>
                                            </div>
                                        </div>

                                        <div className="bg-black/30 rounded-xl p-4 border border-white/5 text-gray-300">
                                            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Subject: {sub.problem || 'Inquiry'}</p>
                                            <p className="text-sm whitespace-pre-wrap leading-relaxed">{sub.message}</p>
                                        </div>
                                    </div>

                                    <div className="flex md:flex-col justify-end gap-3 shrink-0 border-t md:border-t-0 md:border-l border-white/5 pt-4 md:pt-0 md:pl-6">
                                        {sub.status !== 'resolved' ? (
                                            <button 
                                                onClick={() => updateStatus(sub.id, 'resolved')}
                                                className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600 transition text-sm font-medium shadow-lg shadow-green-900/20 w-full md:w-32"
                                            >
                                                <CheckCircleIcon className="size-4" />
                                                Resolve
                                            </button>
                                        ) : (
                                            <button 
                                                onClick={() => updateStatus(sub.id, 'pending')}
                                                className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-white/5 text-gray-300 hover:bg-white/10 transition text-sm font-medium border border-white/10 w-full md:w-32"
                                            >
                                                <XCircleIcon className="size-4" />
                                                Reopen
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
}
