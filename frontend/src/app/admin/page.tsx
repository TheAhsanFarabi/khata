"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { DashboardSummaryCard } from "@/components/DashboardSummaryCard";
import { StatusBadge } from "@/components/StatusBadge";
import { fetchApi } from "@/services/api";

export default function AdminDashboard() {
  const [users, setUsers] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  
  const [newClass, setNewClass] = useState("");
  const [newSubject, setNewSubject] = useState({ name: "", classId: "" });
  
  const [newUser, setNewUser] = useState({ name: "", email: "", password: "", role: 2, classId: "" });

  const [assignments, setAssignments] = useState<any[]>([]);
  const [allSubmissions, setAllSubmissions] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>(null);

  const loadData = async () => {
    try {
      const [u, c, s, a, sub, sett] = await Promise.all([
        fetchApi<any[]>("/Users"),
        fetchApi<any[]>("/Classes"),
        fetchApi<any[]>("/Subjects"),
        fetchApi<any[]>("/Assignments"),
        fetchApi<any[]>("/Submissions/all"),
        fetchApi<any>("/Settings")
      ]);
      setUsers(u);
      setClasses(c);
      setSubjects(s);
      setAssignments(a);
      setAllSubmissions(sub);
      setSettings(sett);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateClass = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetchApi("/Classes", { method: "POST", body: JSON.stringify({ name: newClass }) });
      setNewClass("");
      loadData();
    } catch (err: any) { alert(err.message); }
  };

  const handleCreateSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetchApi("/Subjects", { method: "POST", body: JSON.stringify(newSubject) });
      setNewSubject({ name: "", classId: "" });
      loadData();
    } catch (err: any) { alert(err.message); }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetchApi("/Users", { 
        method: "POST", 
        body: JSON.stringify({
          name: newUser.name,
          email: newUser.email,
          password: newUser.password,
          role: Number(newUser.role),
          classId: newUser.role === 2 ? newUser.classId : null
        }) 
      });
      setNewUser({ name: "", email: "", password: "", role: 2, classId: "" });
      loadData();
    } catch (err: any) { alert(err.message); }
  };

  const handleUpdateSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetchApi("/Settings", { method: "PUT", body: JSON.stringify(settings) });
      alert("Settings updated!");
      loadData();
    } catch (err: any) { alert(err.message); }
  };

  const handleDeleteUser = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      await fetchApi(`/Users/${id}`, { method: "DELETE" });
      loadData();
    } catch (err: any) { alert(err.message); }
  };

  const [assignData, setAssignData] = useState({ teacherId: "", subjectId: "" });
  const handleAssignTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetchApi("/Admin/assign-teacher", { method: "POST", body: JSON.stringify(assignData) });
      alert("Teacher assigned successfully");
      setAssignData({ teacherId: "", subjectId: "" });
      loadData();
    } catch (err: any) { alert(err.message); }
  };

  return (
    <DashboardLayout title="System Overview">
      
      {/* Summary Cards */}
      <div id="overview" className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 pt-4 scroll-mt-20">
        <DashboardSummaryCard title="Total Users" value={users.length} />
        <DashboardSummaryCard title="Active Classes" value={classes.length} />
        <DashboardSummaryCard title="Total Assignments" value={assignments.length} />
        <DashboardSummaryCard title="Graded Submissions" value={allSubmissions.length} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Core Management */}
        <div className="space-y-8">
          
          <div id="users" className="bg-card-bg p-6 rounded-xl border border-card-border shadow-sm scroll-mt-20">
            <h2 className="text-lg font-semibold mb-5 text-foreground">User Management</h2>
            <form onSubmit={handleCreateUser} className="space-y-4 mb-6">
              <div className="grid grid-cols-2 gap-4">
                <input required type="text" placeholder="Name" value={newUser.name} onChange={e => setNewUser({...newUser, name: e.target.value})} className="border border-card-border p-2.5 rounded-md text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary" />
                <input required type="email" placeholder="Email" value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})} className="border border-card-border p-2.5 rounded-md text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input required type="password" placeholder="Password" value={newUser.password} onChange={e => setNewUser({...newUser, password: e.target.value})} className="border border-card-border p-2.5 rounded-md text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary" />
                <select required value={newUser.role} onChange={e => setNewUser({...newUser, role: Number(e.target.value)})} className="border border-card-border p-2.5 rounded-md text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-card-bg">
                  <option value={1}>Teacher</option>
                  <option value={2}>Student</option>
                </select>
              </div>
              {newUser.role === 2 && (
                <select required value={newUser.classId} onChange={e => setNewUser({...newUser, classId: e.target.value})} className="w-full border border-card-border p-2.5 rounded-md text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-card-bg">
                  <option value="">Select Class...</option>
                  {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              )}
              <button type="submit" className="w-full bg-primary text-white font-medium py-2.5 rounded-md hover:bg-primary/90 transition-colors">Register User</button>
            </form>

            <div className="overflow-x-auto border border-card-border rounded-lg">
              <table className="w-full text-sm text-left">
                <thead className="bg-background-panel text-gray-500 uppercase text-xs tracking-wider border-b border-card-border">
                  <tr>
                    <th className="px-4 py-3 font-medium">Name</th>
                    <th className="px-4 py-3 font-medium">Role</th>
                    <th className="px-4 py-3 font-medium text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-card-border">
                  {users.map(u => (
                    <tr key={u.id} className="hover:bg-background-panel/50">
                      <td className="px-4 py-2.5 font-medium text-foreground">{u.name}</td>
                      <td className="px-4 py-2.5 text-gray-500">{u.role === 0 ? 'Admin' : u.role === 1 ? 'Teacher' : 'Student'}</td>
                      <td className="px-4 py-2.5 text-right">
                        {u.role !== 0 && (
                          <button onClick={() => handleDeleteUser(u.id)} className="text-red-500 hover:text-red-700 font-medium text-xs">Delete</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          <div id="academic" className="bg-card-bg p-6 rounded-xl border border-card-border shadow-sm scroll-mt-20">
            <h2 className="text-lg font-semibold mb-5 text-foreground">Academic Structure</h2>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <form onSubmit={handleCreateClass} className="flex gap-2 mb-4">
                  <input required type="text" placeholder="New class name" value={newClass} onChange={e => setNewClass(e.target.value)} className="flex-1 border border-card-border p-2 text-sm rounded-md outline-none focus:border-primary focus:ring-1 focus:ring-primary" />
                  <button type="submit" className="bg-foreground text-card-bg px-3 py-2 rounded-md text-sm font-medium hover:bg-foreground/80 transition-colors">Add</button>
                </form>
                <div className="border border-card-border rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-background-panel border-b border-card-border"><tr className="text-left text-xs uppercase text-gray-500"><th className="px-3 py-2 font-medium">Class List</th></tr></thead>
                    <tbody className="divide-y divide-card-border">
                      {classes.map(c => <tr key={c.id}><td className="px-3 py-2 text-foreground font-medium">{c.name}</td></tr>)}
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div>
                <form onSubmit={handleCreateSubject} className="space-y-2 mb-4">
                  <input required type="text" placeholder="Subject name" value={newSubject.name} onChange={e => setNewSubject({...newSubject, name: e.target.value})} className="w-full border border-card-border p-2 text-sm rounded-md outline-none focus:border-primary focus:ring-1 focus:ring-primary" />
                  <div className="flex gap-2">
                    <select required value={newSubject.classId} onChange={e => setNewSubject({...newSubject, classId: e.target.value})} className="flex-1 border border-card-border p-2 text-sm rounded-md outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-card-bg">
                      <option value="">Select Class...</option>
                      {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                    <button type="submit" className="bg-foreground text-card-bg px-3 py-2 rounded-md text-sm font-medium hover:bg-foreground/80 transition-colors">Add</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* System Activity */}
        <div className="space-y-8">
          <div className="bg-card-bg p-6 rounded-xl border border-card-border shadow-sm">
            <h2 className="text-lg font-semibold mb-5 text-foreground">System Activity</h2>
            
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Recent Assignments</h3>
            <div className="border border-card-border rounded-lg overflow-x-auto mb-6">
              <table className="w-full text-sm text-left">
                <thead className="bg-background-panel text-gray-500 uppercase text-xs tracking-wider border-b border-card-border">
                  <tr><th className="px-4 py-2 font-medium">Title</th><th className="px-4 py-2 font-medium">Subject</th><th className="px-4 py-2 font-medium">Status</th></tr>
                </thead>
                <tbody className="divide-y divide-card-border">
                  {assignments.slice(0, 5).map(a => (
                    <tr key={a.id} className="hover:bg-background-panel/50">
                      <td className="px-4 py-2.5 font-medium text-foreground truncate max-w-[150px]">{a.title}</td>
                      <td className="px-4 py-2.5 text-gray-500">{a.subjectName}</td>
                      <td className="px-4 py-2.5"><StatusBadge status={a.isPublished ? 'Published' : 'Draft'} /></td>
                    </tr>
                  ))}
                  {assignments.length === 0 && <tr><td colSpan={3} className="px-4 py-4 text-center text-gray-400">No data</td></tr>}
                </tbody>
              </table>
            </div>

            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Recent Submissions</h3>
            <div className="border border-card-border rounded-lg overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-background-panel text-gray-500 uppercase text-xs tracking-wider border-b border-card-border">
                  <tr><th className="px-4 py-2 font-medium">Student</th><th className="px-4 py-2 font-medium">Assignment</th><th className="px-4 py-2 font-medium">Status</th><th className="px-4 py-2 font-medium text-right">Score</th></tr>
                </thead>
                <tbody className="divide-y divide-card-border">
                  {allSubmissions.slice(0, 5).map(s => (
                    <tr key={s.id} className="hover:bg-background-panel/50">
                      <td className="px-4 py-2.5 font-medium text-foreground truncate max-w-[120px]">{s.studentName}</td>
                      <td className="px-4 py-2.5 text-gray-500 truncate max-w-[120px]">{s.assignmentTitle}</td>
                      <td className="px-4 py-2.5"><StatusBadge status={s.status} /></td>
                      <td className="px-4 py-2.5 text-right font-medium">{s.marks ?? '-'}</td>
                    </tr>
                  ))}
                  {allSubmissions.length === 0 && <tr><td colSpan={4} className="px-4 py-4 text-center text-gray-400">No data</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
      
      {/* Settings Panel */}
      {settings && (
        <div id="settings" className="mt-8 bg-card-bg p-6 rounded-xl border border-card-border shadow-sm scroll-mt-20">
          <h2 className="text-lg font-semibold mb-6 text-foreground">Global App Settings</h2>
          <form onSubmit={handleUpdateSettings} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">System Toggles</h3>
              <label className="flex items-center space-x-3 text-sm cursor-pointer group">
                <input type="checkbox" checked={settings.maintenanceMode} onChange={e => setSettings({...settings, maintenanceMode: e.target.checked})} className="rounded border-card-border text-primary focus:ring-primary cursor-pointer w-4 h-4" />
                <span className="group-hover:text-primary transition-colors text-gray-700">Maintenance Mode</span>
              </label>
              <label className="flex items-center space-x-3 text-sm cursor-pointer group">
                <input type="checkbox" checked={settings.allowPublicRegistration} onChange={e => setSettings({...settings, allowPublicRegistration: e.target.checked})} className="rounded border-card-border text-primary focus:ring-primary cursor-pointer w-4 h-4" />
                <span className="group-hover:text-primary transition-colors text-gray-700">Public Registration</span>
              </label>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Academic Config</h3>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Active Semester</label>
                <input type="text" value={settings.activeSemester} onChange={e => setSettings({...settings, activeSemester: e.target.value})} className="w-full border border-card-border p-2.5 rounded-md text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Academic Year</label>
                <input type="text" value={settings.academicYear} onChange={e => setSettings({...settings, academicYear: e.target.value})} className="w-full border border-card-border p-2.5 rounded-md text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary" />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Grading Scales</h3>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Default Grading System</label>
                <select value={settings.gradingScale} onChange={e => setSettings({...settings, gradingScale: e.target.value})} className="w-full border border-card-border p-2.5 rounded-md text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-card-bg">
                  <option value="Percentage">0-100% (Percentage)</option>
                  <option value="Letter">Letter Grades (A/B/C/F)</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Platform Limits</h3>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Max Upload Size (Bytes)</label>
                <input type="number" value={settings.maxFileUploadSizeBytes} onChange={e => setSettings({...settings, maxFileUploadSizeBytes: Number(e.target.value)})} className="w-full border border-card-border p-2.5 rounded-md text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Default Timezone</label>
                <input type="text" value={settings.defaultTimezone} onChange={e => setSettings({...settings, defaultTimezone: e.target.value})} className="w-full border border-card-border p-2.5 rounded-md text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary" />
              </div>
            </div>

            <div className="col-span-full pt-4 border-t border-card-border mt-2">
              <button type="submit" className="bg-foreground text-card-bg font-medium px-5 py-2 rounded-md hover:bg-foreground/80 transition-colors text-sm">Save Settings</button>
            </div>
          </form>
        </div>
      )}
    </DashboardLayout>
  );
}
