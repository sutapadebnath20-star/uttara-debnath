import React, { useState, useEffect } from 'react';
import { 
  X, 
  CheckCircle2, 
  ShieldCheck, 
  CreditCard, 
  QrCode, 
  Building2, 
  Sparkles, 
  Receipt, 
  Printer, 
  Copy, 
  Check, 
  Lock, 
  ArrowRight,
  GraduationCap,
  Download,
  AlertCircle
} from 'lucide-react';
import { StudentProfile, PaymentReceipt } from '../types';

interface PaymentEnrollmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: StudentProfile;
  onPaymentSuccess: (receipt: PaymentReceipt) => void;
}

export const PaymentEnrollmentModal: React.FC<PaymentEnrollmentModalProps> = ({
  isOpen,
  onClose,
  profile,
  onPaymentSuccess
}) => {
  const [activeTab, setActiveTab] = useState<'upi' | 'card' | 'netbanking'>('upi');
  
  // Form fields
  const [upiId, setUpiId] = useState<string>('student@okhdfcbank');
  const [cardNumber, setCardNumber] = useState<string>('4315 2891 7401 5002');
  const [cardExpiry, setCardExpiry] = useState<string>('08/28');
  const [cardCvv, setCardCvv] = useState<string>('842');
  const [cardName, setCardName] = useState<string>(profile.name || 'Alex Sharma');
  const [selectedBank, setSelectedBank] = useState<string>('HDFC Bank');

  // Order & state
  const [orderData, setOrderData] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [copiedUpi, setCopiedUpi] = useState<boolean>(false);
  const [receipt, setReceipt] = useState<PaymentReceipt | null>(profile.paymentReceipt || null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Initialize 500 RS order on open
  useEffect(() => {
    if (isOpen) {
      if (profile.paymentReceipt && profile.isEnrolled) {
        setReceipt(profile.paymentReceipt);
      } else {
        setReceipt(null);
        createOrder();
      }
    }
  }, [isOpen, profile]);

  const createOrder = async () => {
    try {
      const res = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName: profile.name || 'Student',
          email: `${(profile.name || 'student').toLowerCase().replace(/\s+/g, '')}@example.com`
        })
      });
      const data = await res.json();
      if (data.order) {
        setOrderData(data.order);
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (!isOpen) return null;

  // Process 500 RS Payment
  const handlePayNow = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setErrorMessage(null);

    const orderId = orderData?.orderId || `ORD_500_${Date.now()}`;

    try {
      const res = await fetch('/api/payment/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          studentName: profile.name || cardName || 'Student',
          paymentMethod: activeTab === 'upi' ? 'UPI' : activeTab === 'card' ? 'Card' : 'NetBanking',
          upiId: activeTab === 'upi' ? upiId : undefined,
          cardNumber: activeTab === 'card' ? cardNumber : undefined,
          cardHolder: activeTab === 'card' ? cardName : undefined,
          bankName: activeTab === 'netbanking' ? selectedBank : undefined
        })
      });

      const data = await res.json();
      if (data.receipt) {
        setReceipt(data.receipt);
        onPaymentSuccess(data.receipt);
      } else {
        throw new Error(data.error || 'Payment failed');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Payment processing failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>Student Enrollment & Admission</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-extrabold border border-emerald-500/40">
                  ₹500 Fixed Charge
                </span>
              </h3>
              <p className="text-xs text-slate-400">Official All-Access Pass & Verified Certificate Track</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
          {receipt ? (
            /* PAYMENT RECEIPT / INVOICE VIEW */
            <div className="space-y-5 animate-fadeIn">
              <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/30 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-emerald-300">Enrollment Fee Received Successfully!</h4>
                  <p className="text-xs text-emerald-200/80">
                    Payment of <strong className="text-white">₹500.00 INR</strong> has been confirmed. You now have full unlocked access.
                  </p>
                </div>
              </div>

              {/* Printable Tax Invoice Card */}
              <div id="printable-tax-invoice" className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-4 text-xs">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <div className="text-sm font-bold text-white flex items-center gap-1.5">
                      <GraduationCap className="w-4 h-4 text-indigo-400" />
                      <span>AI CodeAcademy India</span>
                    </div>
                    <span className="text-[10px] text-slate-400">GSTIN: 27AAACA1234F1Z5 • EduTech Services</span>
                  </div>

                  <div className="text-right">
                    <span className="text-[11px] font-bold text-emerald-400 block">TAX INVOICE / RECEIPT</span>
                    <span className="text-[10px] text-slate-400 font-mono">{receipt.receiptId}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 py-1">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Student Name</span>
                    <span className="text-white font-bold text-xs">{receipt.studentName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Enrollment ID</span>
                    <span className="text-indigo-300 font-mono font-bold text-xs">{receipt.enrollmentNo}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Date & Time</span>
                    <span className="text-slate-300 text-[11px]">{receipt.timestamp}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Payment Mode / UTR</span>
                    <span className="text-slate-300 font-mono text-[11px]">{receipt.paymentDetails}</span>
                    <span className="text-[10px] text-slate-400 block font-mono">{receipt.utrNumber}</span>
                  </div>
                </div>

                {/* Table Breakdown */}
                <div className="border-t border-b border-slate-800 py-2.5 space-y-1.5">
                  <div className="flex justify-between text-slate-300">
                    <span>Course Tuition & AI Lab Access Pass</span>
                    <span>₹423.73</span>
                  </div>
                  <div className="flex justify-between text-slate-400 text-[11px]">
                    <span>CGST (9%) + SGST (9%)</span>
                    <span>₹76.27</span>
                  </div>
                  <div className="flex justify-between text-white font-bold text-sm pt-1 border-t border-slate-800">
                    <span>Total Amount Paid</span>
                    <span className="text-emerald-400">₹500.00 INR</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                  <span>Status: <strong className="text-emerald-400 uppercase">Paid & Verified</strong></span>
                  <span className="font-mono text-slate-400">Pass Key: {receipt.accessPassKey}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center justify-center gap-2 transition"
                >
                  <Printer className="w-4 h-4 text-slate-300" />
                  <span>Print / Save Tax Invoice</span>
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center justify-center gap-2 transition shadow-md shadow-indigo-600/30"
                >
                  <span>Continue to Learning Path</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            /* PAYMENT CHECKOUT FORM FOR 500 RS */
            <form onSubmit={handlePayNow} className="space-y-5">
              {/* Fee summary banner */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <span className="text-[11px] uppercase font-bold tracking-wider text-slate-400">
                    All-Inclusive Course Fee
                  </span>
                  <h4 className="text-sm font-bold text-white mt-0.5">
                    Full AI Coding Curriculum + Certified Track
                  </h4>
                  <p className="text-[11px] text-slate-400">One-time payment • Lifetime access to all modules</p>
                </div>

                <div className="text-right">
                  <div className="text-2xl font-extrabold text-emerald-400 tracking-tight">
                    ₹500
                  </div>
                  <span className="text-[10px] text-slate-400 block">(Incl. 18% GST)</span>
                </div>
              </div>

              {/* Included features pill grid */}
              <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300">
                <div className="flex items-center gap-1.5 p-2 rounded-lg bg-slate-950/60 border border-slate-800">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>All 3 Curriculum Milestones</span>
                </div>
                <div className="flex items-center gap-1.5 p-2 rounded-lg bg-slate-950/60 border border-slate-800">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>24/7 AI Teacher Professor Byte</span>
                </div>
                <div className="flex items-center gap-1.5 p-2 rounded-lg bg-slate-950/60 border border-slate-800">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>AI Code Doctor & Debugger</span>
                </div>
                <div className="flex items-center gap-1.5 p-2 rounded-lg bg-slate-950/60 border border-slate-800">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Verified Student Certificate</span>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300 block">
                  Select Payment Method to Pay ₹500:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('upi')}
                    className={`p-2.5 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition ${
                      activeTab === 'upi'
                        ? 'bg-indigo-600/20 border-indigo-500 text-white'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <QrCode className="w-4 h-4 text-emerald-400" />
                    <span>UPI (Instant)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('card')}
                    className={`p-2.5 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition ${
                      activeTab === 'card'
                        ? 'bg-indigo-600/20 border-indigo-500 text-white'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <CreditCard className="w-4 h-4 text-sky-400" />
                    <span>Debit / Credit Card</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('netbanking')}
                    className={`p-2.5 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition ${
                      activeTab === 'netbanking'
                        ? 'bg-indigo-600/20 border-indigo-500 text-white'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <Building2 className="w-4 h-4 text-amber-400" />
                    <span>Net Banking</span>
                  </button>
                </div>
              </div>

              {/* TAB 1: UPI OPTION */}
              {activeTab === 'upi' && (
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-4">
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    {/* Simulated SVG QR Code for 500 RS */}
                    <div className="p-3 bg-white rounded-xl shadow-md shrink-0 flex flex-col items-center">
                      <svg className="w-28 h-28" viewBox="0 0 100 100" fill="none">
                        <rect width="100" height="100" fill="white" />
                        {/* QR Corners */}
                        <rect x="10" y="10" width="26" height="26" rx="4" stroke="#0f172a" strokeWidth="6" fill="none" />
                        <rect x="18" y="18" width="10" height="10" fill="#0f172a" />
                        <rect x="64" y="10" width="26" height="26" rx="4" stroke="#0f172a" strokeWidth="6" fill="none" />
                        <rect x="72" y="18" width="10" height="10" fill="#0f172a" />
                        <rect x="10" y="64" width="26" height="26" rx="4" stroke="#0f172a" strokeWidth="6" fill="none" />
                        <rect x="18" y="72" width="10" height="10" fill="#0f172a" />
                        {/* Data dots */}
                        <rect x="42" y="14" width="6" height="6" fill="#0f172a" />
                        <rect x="52" y="14" width="6" height="6" fill="#0f172a" />
                        <rect x="42" y="24" width="6" height="6" fill="#0f172a" />
                        <rect x="42" y="38" width="8" height="8" fill="#4f46e5" />
                        <rect x="54" y="38" width="8" height="8" fill="#0f172a" />
                        <rect x="38" y="52" width="8" height="8" fill="#0f172a" />
                        <rect x="52" y="52" width="8" height="8" fill="#4f46e5" />
                        <rect x="64" y="44" width="6" height="6" fill="#0f172a" />
                        <rect x="74" y="44" width="6" height="6" fill="#0f172a" />
                        <rect x="64" y="64" width="6" height="6" fill="#0f172a" />
                        <rect x="74" y="74" width="8" height="8" fill="#0f172a" />
                        <rect x="84" y="64" width="6" height="6" fill="#0f172a" />
                        <rect x="42" y="74" width="8" height="8" fill="#0f172a" />
                        <rect x="54" y="74" width="6" height="6" fill="#0f172a" />
                      </svg>
                      <span className="text-[10px] text-slate-800 font-bold mt-1 tracking-wider">
                        SCAN TO PAY ₹500
                      </span>
                    </div>

                    <div className="space-y-2 flex-1">
                      <span className="text-xs text-slate-300 font-medium block">
                        Scan with GPay, PhonePe, Paytm, or enter your UPI ID:
                      </span>

                      <div className="relative">
                        <input
                          type="text"
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          placeholder="e.g. yourname@okhdfcbank"
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                          required
                        />
                      </div>

                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {['@okhdfcbank', '@okaxis', '@paytm', '@ybl'].map((suf) => (
                          <button
                            key={suf}
                            type="button"
                            onClick={() => {
                              const base = upiId.split('@')[0] || 'student';
                              setUpiId(base + suf);
                            }}
                            className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 hover:bg-slate-700"
                          >
                            {suf}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: DEBIT / CREDIT CARD */}
              {activeTab === 'card' && (
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-400 block mb-1">Card Number (RuPay, Visa, Mastercard)</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="4315 2891 7401 5002"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-400 block mb-1">Expiry (MM/YY)</label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="08/28"
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-400 block mb-1">CVV</label>
                      <input
                        type="password"
                        maxLength={4}
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        placeholder="•••"
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-400 block mb-1">Cardholder Name</label>
                    <input
                      type="text"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      placeholder="Name on card"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                      required
                    />
                  </div>
                </div>
              )}

              {/* TAB 3: NET BANKING */}
              {activeTab === 'netbanking' && (
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Select Your Bank:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {['State Bank of India', 'HDFC Bank', 'ICICI Bank', 'Axis Bank', 'Kotak Mahindra Bank', 'Punjab National Bank'].map((b) => (
                      <button
                        key={b}
                        type="button"
                        onClick={() => setSelectedBank(b)}
                        className={`p-2.5 rounded-xl border text-left text-xs transition ${
                          selectedBank === b
                            ? 'bg-indigo-600/20 border-indigo-500 text-white font-semibold'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {errorMessage && (
                <div className="p-3 bg-red-950/40 border border-red-500/30 rounded-xl text-xs text-red-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Submit Pay 500 RS button */}
              <div className="pt-2">
                <button
                  id="submit-payment-500-btn"
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-emerald-600/30 flex items-center justify-center gap-2 transition disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Authorizing ₹500.00 Payment...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>Pay ₹500 & Complete Enrollment</span>
                    </>
                  )}
                </button>

                <div className="flex items-center justify-center gap-3 text-[11px] text-slate-500 mt-3">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> 256-Bit Encrypted
                  </span>
                  <span>•</span>
                  <span>Instant Activation</span>
                  <span>•</span>
                  <span>GST Invoice Generated</span>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
