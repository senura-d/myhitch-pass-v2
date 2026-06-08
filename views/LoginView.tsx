import React, { useState } from "react";
import { Mail, Lock, User, Sparkles, ShieldCheck, ArrowRight, Chrome, Apple, MessageSquareText, ThumbsUp } from "lucide-react";
import NeuralBackground from "./NeuralBackground";

interface LoginViewProps {
  onLoginSuccess: (name: string, email: string) => void;
  onBackToHome: () => void;
}

export default function LoginView({ onLoginSuccess, onBackToHome }: LoginViewProps) {
  const [activeTab, setActiveTab] = useState<"signin" | "signup">("signin");
  
  // Fields state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(true);
  
  // Forgot Password flow states
  const [isForgotState, setIsForgotState] = useState(false);
  const [recoveryMessage, setRecoveryMessage] = useState("");
  const [recoveryCode, setRecoveryCode] = useState("");
  const [showRecovered, setShowRecovered] = useState(false);
  const [newRequestedPass, setNewRequestedPass] = useState("");
  
  // Action state management
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // No heavy transition wrappers state/handlers

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setRecoveryMessage("");
    if (!email) {
      setErrorMessage("Please input your registered email address.");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const savedUsersStr = localStorage.getItem("myhitch_users");
      const savedUsers = savedUsersStr ? JSON.parse(savedUsersStr) : [];
      
      const found = savedUsers.find((u: any) => u.email.toLowerCase() === email.toLowerCase());
      
      if (email.toLowerCase() === "sarahj@example.com") {
        setRecoveryCode("Sarah Jenkins standard pass: 123456");
        setShowRecovered(true);
      } else if (found) {
        setRecoveryCode(`Registered password is "${found.password}"`);
        setShowRecovered(true);
      } else {
        setErrorMessage("Email address not found. Register a new account pass first on the Sign Up tab.");
      }
    }, 1200);
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRequestedPass.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const savedUsersStr = localStorage.getItem("myhitch_users");
      let savedUsers = savedUsersStr ? JSON.parse(savedUsersStr) : [];
      
      savedUsers = savedUsers.map((u: any) => {
        if (u.email.toLowerCase() === email.toLowerCase()) {
          return { ...u, password: newRequestedPass };
        }
        return u;
      });

      localStorage.setItem("myhitch_users", JSON.stringify(savedUsers));
      setSuccessMsg("Secure Password updated successfully! Please Sign In.");
      setIsForgotState(false);
      setShowRecovered(false);
      setPassword(newRequestedPass);
      setNewRequestedPass("");
    }, 1000);
  };

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMsg("");

    if (!email) {
      setErrorMessage("Please enter your email address.");
      return;
    }
    if (!password) {
      setErrorMessage("Please enter your secure password.");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const savedUsersStr = localStorage.getItem("myhitch_users");
      const savedUsers = savedUsersStr ? JSON.parse(savedUsersStr) : [];

      if (activeTab === "signin") {
        // Sign In Flow
        const found = savedUsers.find(
          (u: any) =>
            u.email.toLowerCase() === email.toLowerCase() &&
            u.password === password
        );

        if (email.toLowerCase() === "sarahj@example.com" && password === "123456") {
          onLoginSuccess("Sarah Jenkins", email);
        } else if (found) {
          onLoginSuccess(found.name, found.email);
        } else {
          setErrorMessage("Invalid secure password or email. Please check your credentials.");
        }
      } else {
        // Sign Up Flow
        if (!fullName) {
          setErrorMessage("Please enter your full name.");
          return;
        }
        if (!agreeTerms) {
          setErrorMessage("You must accept the terms of service to continue.");
          return;
        }

        const exists = savedUsers.some(
          (u: any) => u.email.toLowerCase() === email.toLowerCase()
        );
        if (email.toLowerCase() === "sarahj@example.com" || exists) {
          setErrorMessage("This email is already registered as a pass.");
          return;
        }

        const newUser = { name: fullName, email, password };
        savedUsers.push(newUser);
        localStorage.setItem("myhitch_users", JSON.stringify(savedUsers));

        setSuccessMsg("Pass created successfully!");
        setTimeout(() => {
          onLoginSuccess(fullName, email);
        }, 800);
      }
    }, 1000);
  };

  return (
    <>
      <style>{`
        @keyframes fade {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade {
          animation: fade 250ms ease-in forwards;
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeInUp {
          animation: fadeInUp 500ms ease-out forwards;
        }
      `}</style>
      <NeuralBackground />
      <main className="w-full max-w-[390px] z-10 flex flex-col items-center mx-auto px-4 py-6 animate-fade">
      {/* Back Button for Navigation */}
      <button 
        onClick={onBackToHome}
        className="self-start mb-4 text-xs text-slate-400 hover:text-white transition-colors flex items-center gap-1"
      >
        <span>&larr;</span> Back to Home
      </button>

      <div className="glass-morphism w-full px-6 py-6 md:px-8 md:py-8 rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 backdrop-blur-xl relative overflow-hidden bg-gradient-to-br from-white/10 to-white/0">
        
        {/* Brand Logo */}
        <div className="flex justify-center h-14 items-center overflow-hidden mb-5">
          <img 
            src="/logo.webp" 
            alt="MYHitch Pass Logo" 
            width={200}
            height={200}
            className="w-[170px] md:w-[200px] h-auto object-contain select-none filter drop-shadow-[0_0_8px_rgba(255,255,255,0.15)]"
            style={{ filter: "invert(1) hue-rotate(180deg)" }}
          />
        </div>

        {/* Dynamic Forgot Password View */}
        {isForgotState ? (
          <div key="forgot" className="w-full animate-fade">
            <div className="text-center mb-5">
              <h2 className="text-lg font-extrabold tracking-[0.25em] text-white uppercase mb-1">
                RECOVER
              </h2>
              <p className="text-[10px] text-slate-400">
                Retrieve your credentials to access your pass.
              </p>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="p-2.5 mb-3 text-[10px] text-red-200 bg-red-950/20 border border-red-500/20 rounded-xl text-center">
                {errorMessage}
              </div>
            )}

            {/* Success Password Reset Feedback */}
            {showRecovered ? (
              <form onSubmit={handleResetPassword} className="flex flex-col gap-4">
                <div className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-center text-xs">
                  <Sparkles className="mx-auto text-blue-400 mb-1.5 animate-pulse" size={18} />
                  <p className="font-bold text-white mb-0.5">Pass Credentials Found!</p>
                  <p className="text-blue-300 font-mono text-[10px] py-1.5 px-2.5 bg-black/30 rounded border border-white/5 break-all select-all my-1.5">
                    {recoveryCode}
                  </p>
                  <p className="text-[9px] text-slate-400 leading-normal">
                    You can sign in using this pass, or set a new secure password below:
                  </p>
                </div>

                <div className="flex flex-col">
                  <label className="text-[8.5px] font-bold tracking-widest text-slate-400 ml-3 mb-1 uppercase">
                    New Secure Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3 text-slate-400/40 pointer-events-none" size={16} />
                    <input 
                      type="password"
                      value={newRequestedPass}
                      onChange={(e) => setNewRequestedPass(e.target.value)}
                      placeholder="••••••••"
                      className="w-full h-10 bg-white/5 border border-white/10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-full pl-10 pr-4 text-white transition-all outline-none placeholder:text-slate-500 text-xs"
                      required
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full h-10 bg-[#3b82f6] text-white font-bold rounded-full shadow-lg shadow-blue-500/25 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-1.5 group text-xs mt-0.5 disabled:opacity-50"
                >
                  {isSubmitting ? "Updating secure pass..." : "Reset secure password"}
                  <ArrowRight size={14} />
                </button>

                <button 
                  type="button"
                  onClick={() => {
                    setIsForgotState(false);
                    setShowRecovered(false);
                    setErrorMessage("");
                  }}
                  className="w-full h-10 border border-white/10 hover:bg-white/5 text-white font-bold rounded-full transition-all text-xs"
                >
                  Cancel and Sign In
                </button>
              </form>
            ) : (
              <form onSubmit={handleForgotSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col">
                  <label className="text-[8.5px] font-bold tracking-widest text-slate-400 ml-3 mb-1 uppercase">
                    Registered Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3 text-slate-400/40 pointer-events-none" size={16} />
                    <input 
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="sarahj@example.com"
                      className="w-full h-10 bg-white/5 border border-white/10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-full pl-10 pr-4 text-white transition-all outline-none placeholder:text-slate-500 text-xs"
                      required
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full h-10 bg-[#3b82f6] text-white font-bold rounded-full shadow-lg shadow-blue-500/25 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-1.5 group text-xs mt-0.5 disabled:opacity-50"
                >
                  {isSubmitting ? "Searching databases..." : "Request pass recovery"}
                  <ArrowRight size={14} />
                </button>

                <button 
                  type="button"
                  onClick={() => {
                    setIsForgotState(false);
                    setErrorMessage("");
                  }}
                  className="w-full h-10 border border-white/10 hover:bg-white/5 text-white font-bold rounded-full transition-all text-xs"
                >
                  Cancel and Sign In
                </button>
              </form>
            )}
          </div>
        ) : (
          <div key="auth" className="w-full animate-fade">
            {/* Header Titles */}
            <div className="text-center mb-5">
              <h2 className="text-lg font-extrabold tracking-[0.25em] text-white uppercase mb-1">
                {activeTab === "signin" ? "SIGN IN" : "SIGN UP"}
              </h2>
              <p className="text-[10px] text-slate-400">
                {activeTab === "signin" 
                  ? "Welcome back. Sign in to see your tickets." 
                  : "Join millions accessing the world's best experiences."}
              </p>
            </div>

            {/* Pill Switcher */}
            <div className="flex bg-white/5 border border-white/10 rounded-full p-0.5 w-full mb-5">
              <button 
                onClick={() => {
                  setActiveTab("signin");
                  setErrorMessage("");
                  setSuccessMsg("");
                }}
                className={`flex-1 text-center py-1.5 rounded-full text-[10px] font-bold transition-all select-none ${
                  activeTab === "signin" 
                    ? "bg-[#3b82f6] text-white shadow-lg shadow-blue-500/20" 
                    : "text-slate-400 hover:text-white"
                }`}
              >
                SIGN IN
              </button>
              <button 
                onClick={() => {
                  setActiveTab("signup");
                  setErrorMessage("");
                  setSuccessMsg("");
                }}
                className={`flex-1 text-center py-1.5 rounded-full text-[10px] font-bold transition-all select-none ${
                  activeTab === "signup" 
                    ? "bg-[#3b82f6] text-white shadow-lg shadow-blue-500/20" 
                    : "text-slate-400 hover:text-white"
                }`}
              >
                SIGN UP
              </button>
            </div>

            {/* Action Messages alerts */}
            {errorMessage && (
              <div className="p-2.5 mb-3 text-[10px] text-red-200 bg-red-950/20 border border-red-500/20 rounded-xl text-center">
                {errorMessage}
              </div>
            )}
            {successMsg && (
              <div className="p-2.5 mb-3 text-[10px] text-emerald-200 bg-emerald-950/20 border border-emerald-500/20 rounded-xl text-center">
                {successMsg}
              </div>
            )}

            {/* Auth Form */}
            <form key={activeTab} onSubmit={handleAuthSubmit} className="flex flex-col gap-4 animate-fade">
              <div className="flex flex-col gap-3.5">
                
                {/* Full Name input (Sign Up Only) */}
                {activeTab === "signup" && (
                  <div className="flex flex-col">
                    <label className="text-[8.5px] font-bold tracking-widest text-slate-400 ml-3 mb-1 uppercase">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-3 text-slate-400/40 pointer-events-none" size={16} />
                      <input 
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Alex Rivera"
                        className="w-full h-10 bg-white/5 border border-white/10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-full pl-10 pr-4 text-white transition-all outline-none placeholder:text-slate-500 text-xs"
                        required
                      />
                    </div>
                  </div>
                )}

                {/* Email Input */}
                <div className="flex flex-col">
                  <label className="text-[8.5px] font-bold tracking-widest text-slate-400 ml-3 mb-1 uppercase">
                    E-Mail Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3 text-slate-400/40 pointer-events-none" size={16} />
                    <input 
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="sarahj@example.com"
                      className="w-full h-10 bg-white/5 border border-white/10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-full pl-10 pr-4 text-white transition-all outline-none placeholder:text-slate-500 text-xs"
                      required
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div className="flex flex-col">
                  <div className="flex justify-between items-center px-3 mb-2">
                    <label className="text-[8.5px] font-bold tracking-widest text-slate-400 uppercase">
                      Secure Password
                    </label>
                    {activeTab === "signin" && (
                      <button 
                        type="button"
                        onClick={() => {
                          setIsForgotState(true);
                          setErrorMessage("");
                          setSuccessMsg("");
                        }}
                        className="text-[10px] font-bold tracking-widest text-[#3b82f6] hover:underline uppercase py-0.5"
                      >
                        Forgot Password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3 text-slate-400/40 pointer-events-none" size={16} />
                    <input 
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full h-10 bg-white/5 border border-white/10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-full pl-10 pr-4 text-white transition-all outline-none placeholder:text-slate-500 text-xs"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Agree to Terms Checkbox (Sign Up Only) */}
              {activeTab === "signup" && (
                <label className="flex items-start gap-2 cursor-pointer mt-1 px-1">
                  <input 
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="mt-0.5 accent-blue-500 rounded border-white/10 bg-white/5 w-3.5 h-3.5" 
                    required
                  />
                  <span className="text-slate-400 text-[10px] leading-3.5 select-none">
                    I agree to the <a href="/terms" className="text-[#3b82f6] hover:underline">Terms</a> and <a href="/privacy" className="text-[#3b82f6] hover:underline">Privacy</a>
                  </span>
                </label>
              )}

              {/* Action Submit Button */}
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full h-10 bg-[#3b82f6] text-white font-bold rounded-full shadow-lg shadow-blue-500/25 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-1.5 group text-xs mt-0.5 disabled:opacity-50"
              >
                <span>{activeTab === "signin" ? "SIGN IN" : "CREATE MY PASS"}</span>
                {isSubmitting ? (
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <ArrowRight className="transition-transform group-hover:translate-x-0.5" size={14} />
                )}
              </button>

              {/* SSO Divider */}
              <div className="flex items-center gap-3 py-1">
                <div className="h-[1px] flex-1 bg-white/10"></div>
                <span className="text-[8.5px] font-bold text-slate-500 uppercase tracking-widest">
                  or {activeTab === "signin" ? "sign in" : "sign up"} with
                </span>
                <div className="h-[1px] flex-1 bg-white/10"></div>
              </div>

              {/* Social Logins */}
              <div className="flex gap-2.5">
                <button 
                  type="button" 
                  onClick={onBackToHome}
                  className="flex-1 flex items-center justify-center gap-2 h-10 bg-white/5 hover:bg-white/10 text-white font-semibold text-[10px] rounded-full border border-white/10 transition-all duration-300 active:scale-95"
                >
                  <Chrome size={14} className="text-white" />
                  <span>Google</span>
                </button>
                {activeTab === "signin" && (
                  <button 
                    type="button" 
                    onClick={onBackToHome}
                    className="flex-1 flex items-center justify-center gap-2 h-10 bg-white/5 hover:bg-white/10 text-white font-semibold text-[10px] rounded-full border border-white/10 transition-all duration-300 active:scale-95"
                  >
                    <Apple size={14} className="text-white" />
                    <span>Apple ID</span>
                  </button>
                )}
              </div>

              {/* Details Safety Banner */}
              <div className="p-3 rounded-2xl bg-emerald-950/20 border border-emerald-500/15 flex gap-3 items-start mt-1.5">
                <ShieldCheck className="text-emerald-400 shrink-0 mt-0.5" size={16} />
                <div className="flex flex-col gap-0.5 text-left">
                  <span className="text-[10px] font-bold text-emerald-200 leading-tight">Your details are safe</span>
                  <span className="text-[9px] text-emerald-300/70 leading-normal">
                    We use bank-grade security. Your password and card details are never shared.
                  </span>
                </div>
              </div>
            </form>
          </div>
        )}
      </div>
    </main>
    </>
  );
}
