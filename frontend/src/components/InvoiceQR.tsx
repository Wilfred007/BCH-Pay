'use client';

import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Copy, CheckCircle2, Clock } from 'lucide-react';

interface InvoiceQRProps {
    address: string;
    amountBCH: number;
    amountFiat: number;
    currency: string;
    status: string;
    expiresAt: string;
}

export default function InvoiceQR({ address, amountBCH, amountFiat, currency, status, expiresAt }: InvoiceQRProps) {
    const [copied, setCopied] = React.useState(false);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(address);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const cleanAddress = address.startsWith('bitcoincash:') ? address.split(':')[1] : address;
    const bchUri = `bitcoincash:${cleanAddress}?amount=${amountBCH}`;

    return (
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border border-gray-100">
            <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Pay with BCH</h2>
                <p className="text-gray-500">Scan the QR code to complete payment</p>
            </div>

            <div className="flex flex-col items-center mb-6 bg-gray-50 p-4 rounded-xl">
                <QRCodeSVG value={bchUri} size={200} className="mb-4" />
                <a
                    href={bchUri}
                    className="text-sm text-green-600 font-bold hover:underline flex items-center gap-1"
                >
                    Open in Wallet
                </a>
            </div>

            <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-500">Amount</span>
                    <div className="text-right">
                        <div className="font-bold text-lg text-gray-800">{amountBCH} BCH</div>
                        <div className="text-xs text-gray-400">≈ {amountFiat} {currency}</div>
                    </div>
                </div>

                <div className="p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-500 block mb-1">Address</span>
                    <div className="flex items-center gap-2">
                        <code className="text-xs break-all text-gray-700 flex-1">{address}</code>
                        <button
                            onClick={copyToClipboard}
                            className="p-2 hover:bg-gray-200 rounded-md transition-colors"
                        >
                            {copied ? <CheckCircle2 size={16} className="text-green-500" /> : <Copy size={16} className="text-gray-400" />}
                        </button>
                    </div>
                </div>

                <div className="flex items-center justify-center gap-2 text-sm text-orange-500 bg-orange-50 p-2 rounded-lg">
                    <Clock size={16} />
                    <span>Expires at: {new Date(expiresAt).toLocaleTimeString()}</span>
                </div>

                <div className={`text-center py-2 rounded-lg font-medium ${status === 'pending' ? 'bg-blue-50 text-blue-600' :
                    status === 'confirmed' ? 'bg-green-50 text-green-600' :
                        status === 'settled' ? 'bg-purple-50 text-purple-600' :
                            'bg-red-50 text-red-600'
                    }`}>
                    Status: {status.toUpperCase()}
                </div>
            </div>
        </div>
    );
}
