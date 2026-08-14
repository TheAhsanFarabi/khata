"use client";

import { useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { fetchApi } from "@/services/api";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  
  const { login } = useAuth();

  const validate = () => {
    let isValid = true;
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError(true);
      isValid = false;
    } else {
      setEmailError(false);
    }
    
    if (!password) {
      setPasswordError(true);
      isValid = false;
    } else {
      setPasswordError(false);
    }
    
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!validate()) return;
    
    setLoading(true);

    try {
      const data = await fetchApi<{ token: string; user: any }>("/Auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      login(data.user, data.token);
    } catch (err: any) {
      setError(err.message || "Failed to login");
    } finally {
      setLoading(false);
    }
  };

  // Determine implicit role based on email input for subtle visual feedback
  let impliedRole = "";
  if (email.startsWith("admin")) impliedRole = "Admin";
  if (email.startsWith("john") || email.startsWith("teacher")) impliedRole = "Teacher";
  if (email.startsWith("alice") || email.startsWith("student")) impliedRole = "Student";

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-background text-foreground">

      {/* LEFT PANEL - Branding (collapses on mobile) */}
      <div className="md:w-[55%] bg-background-panel flex flex-col justify-between p-8 md:p-16 border-b md:border-b-0 md:border-r border-card-border transition-colors duration-200">
        <div>
          {/* Logo Lockup */}
          <div className="flex items-center gap-3 mb-16">
            <div className="relative w-8 h-8 flex items-center justify-center">
              <div className="absolute w-5 h-6 bg-primary/20 border-2 border-primary rounded-sm -rotate-6 transform -translate-x-1" />
              <div className="absolute w-5 h-6 bg-transparent border-2 border-primary rounded-sm" />
            </div>
            <span className="font-serif text-2xl font-bold text-primary tracking-tight mt-1">Khata</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground leading-tight mb-4 max-w-sm">
            Assignments, submissions and grades in one place.
          </h1>
          <p className="text-gray-500 text-sm md:text-base max-w-md mb-12 leading-relaxed">
            A lightweight academic workflow platform for schools and colleges. Built for admins, teachers and students.
          </p>

          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <div className="mt-0.5 p-1 rounded-full bg-primary/10 text-primary">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
              </div>
              <div>
                <h3 className="font-medium text-foreground text-sm">Role-based Access</h3>
                <p className="text-gray-500 text-xs mt-0.5">Custom views for students, teachers and administrators.</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="mt-0.5 p-1 rounded-full bg-primary/10 text-primary">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
              </div>
              <div>
                <h3 className="font-medium text-foreground text-sm">Centralized Submissions</h3>
                <p className="text-gray-500 text-xs mt-0.5">Collect, organize and grade coursework without clutter.</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="mt-0.5 p-1 rounded-full bg-primary/10 text-primary">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <div>
                <h3 className="font-medium text-foreground text-sm">Real-time Status</h3>
                <p className="text-gray-500 text-xs mt-0.5">Track missing, late, or graded assignments instantly.</p>
              </div>
            </li>
          </ul>
        </div>
        
        <div className="mt-12 text-xs text-gray-400">
          Developer: Ahsan Farabi, CSE Graduate from UIU, Assignment for Onnorkom Projokti
        </div>
      </div>

      {/* RIGHT PANEL - Login Form */}
      <div className="md:w-[45%] flex items-center justify-center p-8 bg-background transition-colors duration-200">
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground tracking-tight">Sign in</h2>
            <p className="text-gray-500 text-sm mt-1">Enter your credentials to access your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Email</label>
              <div className="relative">
                <input 
                  type="email" 
                  required
                  autoFocus
                  placeholder="name@example.com"
                  className={`w-full p-2.5 rounded-md text-sm border bg-background text-foreground outline-none transition-all duration-200
                    ${emailError ? 'border-red-300 focus:border-red-500 focus:ring-1 focus:ring-red-500' : 'border-card-border focus:border-primary focus:ring-1 focus:ring-primary'}`}
                  value={email} 
                  onChange={e => {
                    setEmail(e.target.value);
                    if (emailError) setEmailError(false);
                  }} 
                />
                {impliedRole && (
                  <span className="absolute right-3 top-2.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-card-bg border border-card-border text-gray-500">
                    {impliedRole}
                  </span>
                )}
              </div>
              {emailError && <p className="text-red-500 text-xs">Please enter a valid email address.</p>}
            </div>
            
            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-foreground">Password</label>
                <a href="#" className="text-xs text-primary hover:text-accent transition-colors font-medium">Forgot?</a>
              </div>
              <input 
                type="password" 
                required
                placeholder="••••••••"
                className={`w-full p-2.5 rounded-md text-sm border bg-background text-foreground outline-none transition-all duration-200
                  ${passwordError ? 'border-red-300 focus:border-red-500 focus:ring-1 focus:ring-red-500' : 'border-card-border focus:border-primary focus:ring-1 focus:ring-primary'}`}
                value={password} 
                onChange={e => {
                  setPassword(e.target.value);
                  if (passwordError) setPasswordError(false);
                }} 
              />
              {passwordError && <p className="text-red-500 text-xs">Password is required.</p>}
            </div>
            
            {error && (
              <div className="p-3 bg-red-50 border border-red-100 rounded-md">
                <p className="text-red-600 text-sm font-medium">{error}</p>
              </div>
            )}
            
            <button 
              type="submit" 
              disabled={loading}
              className={`w-full py-2.5 px-4 rounded-md text-sm font-medium text-white transition-all duration-200 
                ${loading ? 'bg-primary/70 cursor-not-allowed' : 'bg-primary hover:bg-primary/90 shadow-sm'}`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </span>
              ) : "Sign in to account"}
            </button>
          </form>

          {/* Demo Credentials Section */}
          <div className="mt-10 p-4 bg-background-panel rounded-md border border-card-border text-sm text-gray-500">
            <p className="font-semibold text-foreground mb-2">Demo Credentials (Click to auto-fill):</p>
            <ul className="space-y-1">
              <li onClick={() => { setEmail("admin@khata.com"); setPassword("admin123"); }} className="cursor-pointer hover:text-primary transition-colors"><span className="font-medium text-foreground">Admin:</span> admin@khata.com / admin123</li>
              <li onClick={() => { setEmail("teacher@khata.com"); setPassword("teacher123"); }} className="cursor-pointer hover:text-primary transition-colors"><span className="font-medium text-foreground">Teacher:</span> teacher@khata.com / teacher123</li>
              <li onClick={() => { setEmail("student@khata.com"); setPassword("student123"); }} className="cursor-pointer hover:text-primary transition-colors"><span className="font-medium text-foreground">Student:</span> student@khata.com / student123</li>
            </ul>
          </div>
          
        </div>
      </div>
    </div>
  );
}
