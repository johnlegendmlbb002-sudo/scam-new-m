"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiCheck,
  FiX,
  FiLoader,
  FiHome,
  FiShield,
  FiArrowRight,
  FiRefreshCw,
  FiMessageSquare
} from "react-icons/fi";
import { useRouter } from "next/navigation";

export default function TopupComplete() {
  const [status, setStatus] = useState("checking"); // checking | success | failed
  const [message, setMessage] = useState("Checking Payment");
  const [orderId, setOrderId] = useState("");
  const router = useRouter();

  useEffect(() => {
    const id = localStorage.getItem("pending_topup_order");
    setOrderId(id || "");

    if (!id) {
      setStatus("failed");
      setMessage("Order Not Found");
      return;
    }

    async function verify() {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch("/api/order/verify-topup-payment", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ orderId: id }),
        });

        const data = await res.json();

        if (data?.success) {
          setStatus("success");
          setMessage("Success");
          localStorage.removeItem("pending_topup_order");
        } else {
          setStatus("failed");
          setMessage("Failed");
        }
      } catch (err) {
        console.error("Topup verification error:", err);
        setStatus("failed");
        setMessage("Error");
      }
    }

    const timeout = setTimeout(verify, 1500);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="min-h-[100dvh] relative flex items-start justify-center bg-[var(--background)] px-6 pt-[12vh] overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[var(--accent)]/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-red-500/5 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="w-full max-w-[380px] relative z-10"
      >
        <div className="relative group">
          <div className="relative overflow-hidden">


            <AnimatePresence mode="wait">
              <motion.div
                key={status}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center text-center"
              >
                {/* Icon Section */}
                <div className="relative mb-4">
                  <motion.div
                    initial={{ rotate: -45, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center relative z-10 ${status === 'success' ? 'bg-green-500/20 text-green-500 border border-green-500/30' :
                      status === 'failed' ? 'bg-red-500/20 text-red-500 border border-red-500/30' :
                        'bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20'
                      }`}
                  >
                    {status === 'checking' && <FiLoader className="text-2xl animate-spin" />}
                    {status === 'success' && <FiCheck className="text-3xl" />}
                    {status === 'failed' && <FiX className="text-3xl" />}
                  </motion.div>

                  {/* Outer Glow */}
                  <div className={`absolute inset-0 blur-2xl opacity-20 -z-0 ${status === 'success' ? 'bg-green-500' :
                    status === 'failed' ? 'bg-red-500' :
                      'bg-[var(--accent)]'
                    }`} />
                </div>

                {/* Content Section */}
                <div className="space-y-2 mb-6">
                  <div className="flex items-center justify-center gap-1.5 opacity-40">
                    <span className={`w-1.5 h-1.5 rounded-full ${status === 'success' ? 'bg-green-500' :
                      status === 'failed' ? 'bg-red-500' :
                        'bg-amber-500 animate-pulse'
                      }`} />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Order ID: {orderId || 'N/A'}</span>
                  </div>

                  <h1 className="text-2xl font-black uppercase tracking-tight text-foreground italic">
                    {message}
                  </h1>

                  <p className="text-[11px] font-medium text-muted/60 max-w-[240px] mx-auto uppercase tracking-wider leading-relaxed">
                    {status === "checking" && "Checking your payment..."}
                    {status === "success" && "Success! Your diamonds are on the way."}
                    {status === "failed" && "If money was deducted, your diamonds will be delivered soon or you will get a refund."}
                  </p>
                </div>

                {/* Actions */}
                <div className="w-full space-y-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => router.push("/")}
                    className="w-full h-10 bg-foreground text-background rounded-xl font-bold text-[11px] uppercase tracking-[0.15em] flex items-center justify-center gap-2 group transition-colors hover:bg-[var(--accent)] hover:text-white"
                  >
                    <FiHome size={14} />
                    Back Home
                    <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                  </motion.button>

                  {status === 'failed' && (
                    <>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => window.location.reload()}
                        className="w-full h-10 bg-white/5 border border-white/5 text-foreground rounded-xl font-bold text-[11px] uppercase tracking-[0.15em] flex items-center justify-center gap-2 transition-colors hover:bg-white/10"
                      >
                        <FiRefreshCw size={14} />
                        Retry Verification
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => window.open(process.env.NEXT_PUBLIC_WHATSAPP_URL, "_blank")}
                        className="w-full h-10 bg-green-500/10 border border-green-500/20 text-green-500 rounded-xl font-bold text-[11px] uppercase tracking-[0.15em] flex items-center justify-center gap-2 transition-colors hover:bg-green-500/20"
                      >
                        <FiMessageSquare size={14} />
                        Contact Support
                      </motion.button>
                    </>
                  )}
                </div>

                {/* Footer Security Badge */}
                <div className="mt-8 flex items-center justify-center gap-6 opacity-30">
                  <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest">
                    <FiShield size={10} />
                    Encrypted
                  </div>
                  <div className="w-[1px] h-3 bg-foreground/20" />
                  <div className="text-[9px] font-bold uppercase tracking-widest">
                    v2.4.0-SEC
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
