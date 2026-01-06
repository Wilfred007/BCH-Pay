'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { invoiceApi } from '@/lib/api';
import InvoiceQR from '@/components/InvoiceQR';

function InvoiceContent() {
    const searchParams = useSearchParams();
    const id = searchParams.get('id');

    const [invoice, setInvoice] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!id) return;

        const fetchInvoice = async () => {
            try {
                const res = await invoiceApi.get(id);
                const data = res.data;
                setInvoice({
                    id: data._id,
                    address: data.invoiceAddress,
                    amountBCH: data.amountBCH,
                    amountFiat: data.amountFiat,
                    currency: data.currency,
                    status: data.status,
                    expiresAt: data.priceLock.expiresAt,
                });
            } catch (err) {
                setError('Invoice not found');
            } finally {
                setLoading(false);
            }
        };

        fetchInvoice();
        const interval = setInterval(fetchInvoice, 5000); // Poll every 5s

        return () => clearInterval(interval);
    }, [id]);

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    if (error) return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;
    if (!invoice) return <div className="min-h-screen flex items-center justify-center">No invoice found</div>;

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <InvoiceQR
                address={invoice.address}
                amountBCH={invoice.amountBCH}
                amountFiat={invoice.amountFiat}
                currency={invoice.currency}
                status={invoice.status}
                expiresAt={invoice.expiresAt}
            />
        </div>
    );
}

export default function InvoicePage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <InvoiceContent />
        </Suspense>
    );
}
