'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { merchantApi, invoiceApi } from '@/lib/api';
import { LayoutDashboard, Receipt, History, Settings, LogOut, Plus, X } from 'lucide-react';

export default function Dashboard() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('dashboard');
    const [merchant, setMerchant] = useState<any>(null);
    const [invoices, setInvoices] = useState([]);
    const [settlements, setSettlements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [newInvoice, setNewInvoice] = useState({
        items: [{ name: '', price: '' }],
        currency: 'USD'
    });
    const [creating, setCreating] = useState(false);

    const addItem = () => {
        setNewInvoice({
            ...newInvoice,
            items: [...newInvoice.items, { name: '', price: '' }]
        });
    };

    const removeItem = (index: number) => {
        const updatedItems = newInvoice.items.filter((_, i) => i !== index);
        setNewInvoice({ ...newInvoice, items: updatedItems });
    };

    const updateItem = (index: number, field: string, value: string) => {
        const updatedItems = [...newInvoice.items];
        updatedItems[index] = { ...updatedItems[index], [field]: value };
        setNewInvoice({ ...newInvoice, items: updatedItems });
    };

    const calculateTotal = () => {
        return newInvoice.items.reduce((sum, item) => {
            const price = parseFloat(item.price) || 0;
            return sum + price;
        }, 0);
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        const merchantId = localStorage.getItem('merchantId');

        if (!token || !merchantId) {
            router.push('/onboarding');
            return;
        }

        const fetchData = async () => {
            try {
                const [profileRes, invoicesRes, settlementsRes] = await Promise.all([
                    merchantApi.getProfile(merchantId),
                    merchantApi.getInvoices(merchantId),
                    merchantApi.getSettlements(merchantId)
                ]);
                setMerchant(profileRes.data);
                setInvoices(invoicesRes.data);
                setSettlements(settlementsRes.data);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
                if ((error as any).response?.status === 401) {
                    router.push('/onboarding');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [router]);

    const handleCreateInvoice = async (e: React.FormEvent) => {
        e.preventDefault();
        setCreating(true);
        try {
            const merchantId = localStorage.getItem('merchantId');
            const totalAmount = calculateTotal();

            if (totalAmount <= 0) {
                alert('Total amount must be greater than 0');
                return;
            }

            const res = await invoiceApi.create({
                merchantId,
                amountFiat: totalAmount,
                currency: newInvoice.currency,
                items: newInvoice.items.map(item => ({
                    name: item.name,
                    price: parseFloat(item.price),
                    quantity: 1
                }))
            });
            router.push(`/pay?id=${res.data._id}`);
        } catch (error) {
            alert('Failed to create invoice');
        } finally {
            setCreating(false);
        }
    };

    const logout = () => {
        localStorage.clear();
        router.push('/onboarding');
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
                <div className="p-6">
                    <h1 className="text-2xl font-bold text-green-600 flex items-center gap-2">
                        <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center text-white text-xs">BCH</div>
                        BCH Pay
                    </h1>
                </div>

                <nav className="flex-1 px-4 space-y-2">
                    <button
                        onClick={() => setActiveTab('dashboard')}
                        className={`w-full flex items-center gap-3 p-3 rounded-lg font-medium transition-colors ${activeTab === 'dashboard' ? 'bg-green-50 text-green-700' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                        <LayoutDashboard size={20} /> Dashboard
                    </button>
                    <button
                        onClick={() => setActiveTab('invoices')}
                        className={`w-full flex items-center gap-3 p-3 rounded-lg font-medium transition-colors ${activeTab === 'invoices' ? 'bg-green-50 text-green-700' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                        <Receipt size={20} /> Invoices
                    </button>
                    <button
                        onClick={() => setActiveTab('settlements')}
                        className={`w-full flex items-center gap-3 p-3 rounded-lg font-medium transition-colors ${activeTab === 'settlements' ? 'bg-green-50 text-green-700' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                        <History size={20} /> Settlements
                    </button>
                    <button className="w-full flex items-center gap-3 p-3 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                        <Settings size={20} /> Settings
                    </button>
                </nav>

                <div className="p-4 border-t border-gray-100">
                    <button onClick={logout} className="flex items-center gap-3 p-3 text-red-600 hover:bg-red-50 w-full rounded-lg transition-colors">
                        <LogOut size={20} /> Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8">
                <header className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">
                            {activeTab === 'dashboard' ? `Welcome back, ${merchant?.username}` :
                                activeTab === 'invoices' ? 'Invoices' : 'Settlements'}
                        </h2>
                        <p className="text-gray-500">
                            {activeTab === 'dashboard' ? "Here's what's happening with your BCH payments today." :
                                activeTab === 'invoices' ? 'Manage and track your customer invoices.' :
                                    'View your automatic stablecoin conversions.'}
                        </p>
                    </div>
                    <button
                        onClick={() => setShowModal(true)}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700 transition-colors shadow-lg shadow-green-100"
                    >
                        <Plus size={20} /> New Invoice
                    </button>
                </header>

                {activeTab === 'dashboard' && (
                    <>
                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                <p className="text-sm text-gray-500 mb-1">Total Revenue</p>
                                <h3 className="text-3xl font-bold text-gray-800">
                                    ${settlements.reduce((acc: number, s: any) => acc + s.stableAmount, 0).toFixed(2)}
                                </h3>
                                <p className="text-xs text-green-500 mt-2">All time settled</p>
                            </div>
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                <p className="text-sm text-gray-500 mb-1">Pending Invoices</p>
                                <h3 className="text-3xl font-bold text-gray-800">
                                    {invoices.filter((i: any) => i.status === 'pending').length}
                                </h3>
                                <p className="text-xs text-orange-500 mt-2">Awaiting payment</p>
                            </div>
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                <p className="text-sm text-gray-500 mb-1">Recent Settlements</p>
                                <h3 className="text-3xl font-bold text-gray-800">
                                    {settlements.filter((s: any) => {
                                        const today = new Date().toDateString();
                                        return new Date(s.createdAt).toDateString() === today;
                                    }).length}
                                </h3>
                                <p className="text-xs text-blue-500 mt-2">Settled today</p>
                            </div>
                        </div>

                        {/* Recent Invoices Table */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                                <h3 className="font-bold text-gray-800">Recent Invoices</h3>
                                <button onClick={() => setActiveTab('invoices')} className="text-green-600 text-sm font-medium hover:underline">View All</button>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                                        <tr>
                                            <th className="px-6 py-4 font-medium">ID</th>
                                            <th className="px-6 py-4 font-medium">Amount</th>
                                            <th className="px-6 py-4 font-medium">BCH</th>
                                            <th className="px-6 py-4 font-medium">Status</th>
                                            <th className="px-6 py-4 font-medium">Date</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {invoices.length === 0 ? (
                                            <tr>
                                                <td colSpan={5} className="px-6 py-10 text-center text-gray-400">No invoices yet. Create your first one!</td>
                                            </tr>
                                        ) : (
                                            invoices.slice(0, 5).map((inv: any) => (
                                                <tr key={inv._id} className="hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => router.push(`/pay?id=${inv._id}`)}>
                                                    <td className="px-6 py-4 text-sm text-gray-600">#{inv._id.slice(-6).toUpperCase()}</td>
                                                    <td className="px-6 py-4 text-sm font-bold text-gray-800">${inv.amountFiat.toFixed(2)}</td>
                                                    <td className="px-6 py-4 text-sm text-gray-600">{inv.amountBCH.toFixed(8)} BCH</td>
                                                    <td className="px-6 py-4">
                                                        <span className={`px-2 py-1 text-xs rounded-full font-medium ${inv.status === 'settled' ? 'bg-purple-50 text-purple-600' :
                                                            inv.status === 'confirmed' ? 'bg-green-50 text-green-600' :
                                                                inv.status === 'pending' ? 'bg-blue-50 text-blue-600' :
                                                                    'bg-red-50 text-red-600'
                                                            }`}>
                                                            {inv.status.toUpperCase()}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-500">{new Date(inv.createdAt).toLocaleDateString()}</td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                )}

                {activeTab === 'invoices' && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-100">
                            <h3 className="font-bold text-gray-800">All Invoices</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                                    <tr>
                                        <th className="px-6 py-4 font-medium">ID</th>
                                        <th className="px-6 py-4 font-medium">Amount</th>
                                        <th className="px-6 py-4 font-medium">BCH</th>
                                        <th className="px-6 py-4 font-medium">Status</th>
                                        <th className="px-6 py-4 font-medium">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {invoices.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-10 text-center text-gray-400">No invoices found.</td>
                                        </tr>
                                    ) : (
                                        invoices.map((inv: any) => (
                                            <tr key={inv._id} className="hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => router.push(`/pay?id=${inv._id}`)}>
                                                <td className="px-6 py-4 text-sm text-gray-600">#{inv._id.slice(-6).toUpperCase()}</td>
                                                <td className="px-6 py-4 text-sm font-bold text-gray-800">${inv.amountFiat.toFixed(2)}</td>
                                                <td className="px-6 py-4 text-sm text-gray-600">{inv.amountBCH.toFixed(8)} BCH</td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${inv.status === 'settled' ? 'bg-purple-50 text-purple-600' :
                                                        inv.status === 'confirmed' ? 'bg-green-50 text-green-600' :
                                                            inv.status === 'pending' ? 'bg-blue-50 text-blue-600' :
                                                                'bg-red-50 text-red-600'
                                                        }`}>
                                                        {inv.status.toUpperCase()}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-500">{new Date(inv.createdAt).toLocaleDateString()}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'settlements' && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-100">
                            <h3 className="font-bold text-gray-800">Settlement History</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                                    <tr>
                                        <th className="px-6 py-4 font-medium">ID</th>
                                        <th className="px-6 py-4 font-medium">BCH Amount</th>
                                        <th className="px-6 py-4 font-medium">USDT Received</th>
                                        <th className="px-6 py-4 font-medium">Status</th>
                                        <th className="px-6 py-4 font-medium">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {settlements.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-10 text-center text-gray-400">No settlements yet.</td>
                                        </tr>
                                    ) : (
                                        settlements.map((set: any) => (
                                            <tr key={set._id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 text-sm text-gray-600">#{set._id.slice(-6).toUpperCase()}</td>
                                                <td className="px-6 py-4 text-sm text-gray-800">{set.bchAmount.toFixed(8)} BCH</td>
                                                <td className="px-6 py-4 text-sm font-bold text-green-600">${set.stableAmount.toFixed(2)} USDT</td>
                                                <td className="px-6 py-4">
                                                    <span className="px-2 py-1 bg-green-50 text-green-600 text-xs rounded-full font-medium">COMPLETED</span>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-500">{new Date(set.createdAt).toLocaleDateString()}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </main>

            {/* New Invoice Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-gray-800">Create New Invoice</h3>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleCreateInvoice} className="space-y-4">
                            <div className="max-h-[40vh] overflow-y-auto pr-2 space-y-4">
                                {newInvoice.items.map((item, index) => (
                                    <div key={index} className="flex gap-2 items-end border-b border-gray-50 pb-4 last:border-0">
                                        <div className="flex-1">
                                            <label className="block text-xs font-medium text-gray-500 mb-1">Item Name</label>
                                            <input
                                                type="text"
                                                required
                                                className="w-full p-2 border border-gray-700 rounded-lg focus:ring-2 text-gray-700 focus:ring-green-500 outline-none text-sm"
                                                placeholder="e.g. Coffee"
                                                value={item.name}
                                                onChange={(e) => updateItem(index, 'name', e.target.value)}
                                            />
                                        </div>
                                        <div className="w-24">
                                            <label className="block text-xs font-medium text-gray-800 mb-1">Price</label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                required
                                                className="w-full p-2 border border-gray-700 text-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-sm"
                                                placeholder="0.00"
                                                value={item.price}
                                                onChange={(e) => updateItem(index, 'price', e.target.value)}
                                            />
                                        </div>
                                        {newInvoice.items.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeItem(index)}
                                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <X size={18} />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <button
                                type="button"
                                onClick={addItem}
                                className="w-full py-2 border-2 border-dashed border-gray-200 rounded-lg text-gray-500 hover:border-green-500 hover:text-green-600 transition-all text-sm font-medium flex items-center justify-center gap-2"
                            >
                                <Plus size={16} /> Add Another Item
                            </button>

                            <div className="pt-4 border-t border-gray-100">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-gray-500 font-medium">Total Amount</span>
                                    <span className="text-xl font-bold text-gray-800">${calculateTotal().toFixed(2)}</span>
                                </div>
                                <button
                                    type="submit"
                                    disabled={creating}
                                    className="w-full bg-green-600 text-white p-3 rounded-lg font-bold hover:bg-green-700 transition-colors shadow-lg shadow-green-100 disabled:opacity-50"
                                >
                                    {creating ? 'Creating...' : `Generate Invoice ($${calculateTotal().toFixed(2)})`}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
