import React from 'react';

type SidebarProps = {
  role: string;
  onLogout: () => void;
};

export const Sidebar = ({ role, onLogout }: SidebarProps) => {
  return (
    <aside className="w-64 bg-background-panel border-r border-card-border h-screen sticky top-0 flex flex-col">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-6 border-b border-card-border">
        <div className="flex items-center gap-3">
          <div className="relative w-6 h-6 flex items-center justify-center">
            <div className="absolute w-4 h-5 bg-primary/20 border-2 border-primary rounded-sm -rotate-6 transform -translate-x-1" />
            <div className="absolute w-4 h-5 bg-transparent border-2 border-primary rounded-sm" />
          </div>
          <span className="font-serif text-2xl font-bold text-primary tracking-tight mt-1">Khata</span>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
        <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-4 px-2">Menu</div>
        
        {role === 'Admin' && (
          <>
            <a href="#overview" className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-card-bg text-foreground font-medium transition-colors text-sm">
              <svg className="w-4 h-4 text-primary opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
              Overview
            </a>
            <a href="#users" className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-card-bg text-foreground font-medium transition-colors text-sm">
              <svg className="w-4 h-4 text-primary opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
              Users
            </a>
            <a href="#academic" className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-card-bg text-foreground font-medium transition-colors text-sm">
              <svg className="w-4 h-4 text-primary opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
              Academic Structure
            </a>
            <a href="#settings" className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-card-bg text-foreground font-medium transition-colors text-sm">
              <svg className="w-4 h-4 text-primary opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              Settings
            </a>
          </>
        )}
        
        {role === 'Teacher' && (
          <>
            <a href="#overview" className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-card-bg text-foreground font-medium transition-colors text-sm">
              <svg className="w-4 h-4 text-primary opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
              Dashboard
            </a>
            <a href="#assignments" className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-card-bg text-foreground font-medium transition-colors text-sm">
              <svg className="w-4 h-4 text-primary opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
              Assignments
            </a>
          </>
        )}

        {role === 'Student' && (
          <>
            <a href="#overview" className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-card-bg text-foreground font-medium transition-colors text-sm">
               <svg className="w-4 h-4 text-primary opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
               Dashboard
            </a>
            <a href="#coursework" className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-card-bg text-foreground font-medium transition-colors text-sm">
              <svg className="w-4 h-4 text-primary opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
              Coursework
            </a>
          </>
        )}
      </div>

      {/* User Footer */}
      <div className="p-4 border-t border-card-border bg-background-panel">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-foreground">{role} Account</span>
          </div>
          <button onClick={onLogout} className="text-gray-400 hover:text-accent transition-colors" title="Log out">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
          </button>
        </div>
      </div>
    </aside>
  );
};
