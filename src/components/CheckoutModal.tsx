import React, { useState } from 'react';
import { CreditCard, ShieldCheck, CheckCircle2, AlertCircle, X, Lock, Sparkles, DollarSign } from 'lucide-react';
import type { PromotionType, PaymentTransaction } from '../types/index.ts';

interface CheckoutModalProps {
  developerId: string;
  appId?: string;
  appName?: string;
  promotionType: PromotionType;
  price: number;
  onClose: () => void;
  onPaymentSuccess: (transaction: PaymentTransaction) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  developerId,
  appId,
  appName,
  promotionType,
  price,
  onClose,
  onPaymentSuccess,
}) => {
  const [step, setStep] = useState<'DETAILS' | 'PROCESSING' | 'CONFIRMED' | 'FAILED'>('DETAILS');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal' | 'crypto'>('card');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [order, setOrder] = useState<PaymentTransaction | null>(null);
  const [serverToken, setServerToken] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState('');

  const promotionLabels: Record<PromotionType, { title: string; desc: string }> = {
    STANDARD_PUBLISH: {
      title: 'Developer Publishing Access',
      desc: 'One-time store compliance fee to distribute your APK package publicly.',
    },
    FEATURED_LISTING: {
      title: 'Featured Category Spotlight',
      desc: 'Top category placement with highlighted visual banner for 7 days.',
    },
    SPONSORED_SEARCH: {
      title: 'Sponsored Search Placement',
      desc: 'Priority placement in relevant marketplace search queries with "Promoted" badge.',
    },
    HOMEPAGE_HERO: {
      title: 'Homepage Hero Spotlight',
      desc: 'Primary homepage spotlight carousel banner with direct download action for 14 days.',
    },
  };

  const handleInitiatePayment = async () => {
    setStep('PROCESSING');
    setErrorMessage('');

    try {
      // 1. Create order on server (Server sets price & creates HMAC-SHA256 signature)
      const res = await fetch('/api/payments/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          developerId,
          appId,
          appName,
          promotionType,
          paymentMethod,
        }),
      });

      const data = await res.json();
      if (!data.success) {
        setErrorMessage(data.message || 'Payment initiation rejected by server');
        setStep('FAILED');
        return;
      }

      setOrder(data.order);
      setServerToken(data.clientToken);

      // 2. Simulate payment processor delay
      await new Promise((resolve) => setTimeout(resolve, 1400));

      // 3. Verify payment on server (NEVER trust client status alone)
      const verifyRes = await fetch('/api/payments/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: data.order.orderId,
          clientToken: data.clientToken,
          paymentDetails: {
            method: paymentMethod,
            providerReference: `mock_txn_${Date.now()}`,
          },
        }),
      });

      const verifyData = await verifyRes.json();
      if (verifyData.success && verifyData.order.status === 'PAID') {
        setOrder(verifyData.order);
        setStep('CONFIRMED');
        onPaymentSuccess(verifyData.order);
      } else {
        setErrorMessage(verifyData.message || 'Server-side payment verification failed');
        setStep('FAILED');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Network communication error');
      setStep('FAILED');
    }
  };

  const handleCancelOrder = async () => {
    if (order?.orderId) {
      try {
        await fetch(`/api/payments/${order.orderId}/cancel`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        });
      } catch (e) {
        console.error(e);
      }
    }
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div 
        className="bg-white border border-slate-200/90 w-full max-w-lg rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5 text-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-[#00875a]/10 text-[#00875a] rounded-xl shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                {promotionLabels[promotionType].title}
              </h3>
              <p className="text-xs text-slate-500">
                {appName ? `Target: ${appName}` : 'Developer Account Service'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step: DETAILS */}
        {step === 'DETAILS' && (
          <div className="space-y-4">
            {/* Price Box */}
            <div className="bg-slate-50 border border-slate-200/80 p-4 rounded-2xl flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 font-medium">Server Confirmed Price</p>
                <p className="text-xs text-slate-600 mt-0.5">{promotionLabels[promotionType].desc}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-black text-[#00875a] font-mono">${price.toFixed(2)}</p>
                <p className="text-[10px] text-slate-400">USD • Server-Signed</p>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700">Select Payment Method</label>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                    paymentMethod === 'card'
                      ? 'border-[#00875a] bg-[#00875a]/10 text-[#00875a] font-bold'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <CreditCard className="w-4 h-4 text-blue-500" />
                  <span>Card</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('paypal')}
                  className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                    paymentMethod === 'paypal'
                      ? 'border-[#00875a] bg-[#00875a]/10 text-[#00875a] font-bold'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <DollarSign className="w-4 h-4 text-indigo-500" />
                  <span>PayPal</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('crypto')}
                  className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                    paymentMethod === 'crypto'
                      ? 'border-[#00875a] bg-[#00875a]/10 text-[#00875a] font-bold'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Lock className="w-4 h-4 text-[#00875a]" />
                  <span>USDC</span>
                </button>
              </div>
            </div>

            {/* Test Card details */}
            <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200/80 text-xs">
              <div>
                <label className="block text-slate-600 mb-1 font-medium">Card Number (Sandbox Test)</label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 font-mono"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 mb-1 font-medium">Expiry</label>
                  <input
                    type="text"
                    defaultValue="12/28"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1 font-medium">CVC</label>
                  <input
                    type="text"
                    defaultValue="884"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Security Note */}
            <div className="flex items-center gap-2 text-[11px] text-slate-500">
              <ShieldCheck className="w-4 h-4 text-[#00875a] flex-shrink-0" />
              <span>Payments are cryptographically verified by server HMAC. Browser tokens are not trusted.</span>
            </div>

            {/* Actions */}
            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={handleCancelOrder}
                className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-full"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleInitiatePayment}
                className="px-6 py-2.5 bg-[#00875a] hover:bg-[#00744e] text-white font-bold text-xs rounded-full shadow-md shadow-[#00875a]/25 transition-all"
              >
                Pay ${price.toFixed(2)} & Verify
              </button>
            </div>
          </div>
        )}

        {/* Step: PROCESSING */}
        {step === 'PROCESSING' && (
          <div className="py-10 text-center space-y-4">
            <div className="w-12 h-12 border-4 border-emerald-200 border-t-[#00875a] rounded-full animate-spin mx-auto" />
            <h4 className="text-base font-bold text-slate-900">Communicating with Gateway & Server...</h4>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              Generating server cryptographic signature and verifying transaction settlement...
            </p>
          </div>
        )}

        {/* Step: CONFIRMED */}
        {step === 'CONFIRMED' && order && (
          <div className="py-6 text-center space-y-4">
            <div className="w-14 h-14 bg-emerald-50 text-[#00875a] rounded-full flex items-center justify-center mx-auto border border-emerald-200">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-slate-900">Payment Confirmed & Verified!</h4>
              <p className="text-xs text-[#00875a] font-semibold mt-0.5">Status: SERVER-VERIFIED (PAID)</p>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-left text-xs font-mono space-y-1">
              <p><span className="text-slate-400">Order ID: </span>{order.orderId}</p>
              <p><span className="text-slate-400">Amount: </span>${order.amount.toFixed(2)} {order.currency}</p>
              <p><span className="text-slate-400">Server Sig: </span><span className="text-[#00875a]">{order.serverSignature.slice(0, 18)}...</span></p>
              <p><span className="text-slate-400">Applied: </span>{promotionLabels[promotionType].title}</p>
            </div>

            <p className="text-xs text-slate-600">
              Your promotion is active immediately in the public marketplace.
            </p>

            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-[#00875a] text-white font-bold text-xs rounded-full shadow-md shadow-[#00875a]/25"
            >
              Done & Return to Dashboard
            </button>
          </div>
        )}

        {/* Step: FAILED */}
        {step === 'FAILED' && (
          <div className="py-6 text-center space-y-4">
            <div className="w-14 h-14 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto border border-rose-200">
              <AlertCircle className="w-8 h-8" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-slate-900">Payment Failed</h4>
              <p className="text-xs text-rose-600 mt-1">{errorMessage}</p>
            </div>

            <button
              onClick={() => setStep('DETAILS')}
              className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-full"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
