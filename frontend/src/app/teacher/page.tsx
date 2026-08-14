"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { DashboardSummaryCard } from "@/components/DashboardSummaryCard";
import { StatusBadge } from "@/components/StatusBadge";
import { fetchApi } from "@/services/api";

export default function TeacherDashboard() {
  const [assignments, setAssignments] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  
  const [showCreate, setShowCreate] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<any>(null);
  
  const [viewingSubmissionsFor, setViewingSubmissionsFor] = useState<any>(null);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [gradingSubmission, setGradingSubmission] = useState<any>(null);

  const [formData, setFormData] = useState({
    title: "", description: "", deadlineDate: "", deadlineTime: "", maxMarks: 100, subjectId: "", allowResubmission: false, isPublished: true
  });
  
  const [gradeData, setGradeData] = useState({ marks: 0, feedback: "" });

  const loadAssignments = () => {
    fetchApi<any[]>("/Assignments").then(setAssignments).catch(console.error);
  };

  useEffect(() => {
    loadAssignments();
    fetchApi<any[]>("/Subjects").then(setSubjects).catch(console.error);
  }, []);

  const resetForm = () => setFormData({ title: "", description: "", deadlineDate: "", deadlineTime: "", maxMarks: 100, subjectId: "", allowResubmission: false, isPublished: true });

  const handleCreateOrUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const selectedSubject = subjects.find(s => s.id === formData.subjectId);
      if (!selectedSubject) return alert("Select a subject");
      
      const deadlineIso = new Date(`${formData.deadlineDate}T${formData.deadlineTime}`).toISOString();

      const payload = {
        title: formData.title,
        description: formData.description,
        deadline: deadlineIso,
        maxMarks: Number(formData.maxMarks),
        subjectId: formData.subjectId,
        classId: selectedSubject.classId,
        allowResubmission: formData.allowResubmission,
        isPublished: formData.isPublished
      };

      if (editingAssignment) {
        await fetchApi(`/Assignments/${editingAssignment.id}`, { method: "PUT", body: JSON.stringify(payload) });
      } else {
        await fetchApi("/Assignments", { method: "POST", body: JSON.stringify(payload) });
      }
      
      setShowCreate(false);
      setEditingAssignment(null);
      resetForm();
      loadAssignments();
    } catch (err: any) { alert(err.message); }
  };

  const openEdit = (a: any) => {
    const matchingSubject = subjects.find(s => s.name === a.subjectName && s.className === a.className);
    const localDate = new Date(a.deadline);
    const year = localDate.getFullYear();
    const month = String(localDate.getMonth() + 1).padStart(2, '0');
    const day = String(localDate.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    const timeStr = localDate.toTimeString().slice(0, 5); // HH:mm
    
    setFormData({
      title: a.title, description: a.description, deadlineDate: dateStr, deadlineTime: timeStr,
      maxMarks: a.maxMarks, subjectId: matchingSubject ? matchingSubject.id : "",
      allowResubmission: a.allowResubmission, isPublished: a.isPublished
    });
    setEditingAssignment(a);
    setShowCreate(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this assignment?")) return;
    try {
      await fetchApi(`/Assignments/${id}`, { method: "DELETE" });
      loadAssignments();
    } catch (err: any) { alert(err.message); }
  };

  const loadSubmissions = async (assignment: any) => {
    try {
      setViewingSubmissionsFor(assignment);
      const subs = await fetchApi<any[]>(`/Submissions/assignment/${assignment.id}`);
      setSubmissions(subs);
    } catch (err: any) { alert(err.message); }
  };

  const handleGrade = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetchApi(`/Submissions/${gradingSubmission.id}/grade`, {
        method: "POST", body: JSON.stringify({ marks: Number(gradeData.marks), feedback: gradeData.feedback })
      });
      setGradingSubmission(null);
      loadSubmissions(viewingSubmissionsFor);
    } catch (err: any) { alert(err.message); }
  };

  return (
    <DashboardLayout title="My Assignments">
      
      <div id="overview" className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 pt-4 scroll-mt-20">
        <DashboardSummaryCard title="Total Assignments" value={assignments.length} />
        <DashboardSummaryCard title="Published" value={assignments.filter(a => a.isPublished).length} />
        <DashboardSummaryCard title="Drafts" value={assignments.filter(a => !a.isPublished).length} />
      </div>

      <div id="assignments" className="bg-card-bg rounded-xl border border-card-border shadow-sm overflow-hidden flex flex-col scroll-mt-20">
        <div className="p-5 border-b border-card-border flex justify-between items-center bg-card-bg">
          <h2 className="text-lg font-semibold text-foreground">Coursework</h2>
          <button onClick={() => { resetForm(); setEditingAssignment(null); setShowCreate(true); }} className="bg-foreground text-card-bg px-4 py-2 rounded-md text-sm font-medium hover:bg-foreground/80 transition-colors">
            + New Assignment
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-background-panel text-gray-500 uppercase text-xs tracking-wider border-b border-card-border">
              <tr>
                <th className="px-6 py-3 font-medium">Title</th>
                <th className="px-6 py-3 font-medium">Subject & Class</th>
                <th className="px-6 py-3 font-medium">Deadline</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-card-border bg-card-bg">
              {assignments.map(a => (
                <tr key={a.id} className="hover:bg-background-panel/50 transition-colors group">
                  <td className="px-6 py-4">
                    <p className="font-medium text-foreground truncate max-w-[250px]">{a.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5 truncate max-w-[250px]">{a.description}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-foreground">{a.subjectName}</p>
                    <p className="text-xs text-gray-500">{a.className}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="inline-flex items-center px-2 py-1 rounded-md bg-background-panel text-gray-600 text-xs font-medium font-mono">
                      {new Date(a.deadline).toLocaleDateString()} {new Date(a.deadline).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={a.isPublished ? 'Published' : 'Draft'} />
                  </td>
                  <td className="px-6 py-4 text-right space-x-3 transition-opacity">
                    <button onClick={() => loadSubmissions(a)} className="text-primary hover:text-primary/80 font-medium text-sm">Submissions</button>
                    <button onClick={() => openEdit(a)} className="text-gray-400 hover:text-gray-700 font-medium text-sm">Edit</button>
                    <button onClick={() => handleDelete(a.id)} className="text-red-400 hover:text-red-600 font-medium text-sm">Delete</button>
                  </td>
                </tr>
              ))}
              {assignments.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                    <div className="flex flex-col items-center">
                      <svg className="w-12 h-12 mb-3 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                      <p>No assignments found. Create one to get started.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Assignment Create/Edit Modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-card-bg rounded-xl shadow-2xl p-6 w-full max-w-lg border border-card-border">
            <h3 className="text-lg font-semibold text-foreground mb-5">{editingAssignment ? "Edit Assignment" : "New Assignment"}</h3>
            <form onSubmit={handleCreateOrUpdate} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Title</label>
                <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full border border-card-border p-2.5 rounded-md text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-card-bg text-foreground" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Description</label>
                <textarea required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full border border-card-border p-2.5 rounded-md text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-card-bg text-foreground" rows={3} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-xs font-medium text-gray-500 mb-1">Subject</label>
                  <select required value={formData.subjectId} onChange={e => setFormData({...formData, subjectId: e.target.value})} className="w-full border border-card-border p-2.5 rounded-md text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-card-bg text-foreground">
                    <option value="">Select...</option>
                    {subjects.map(s => <option key={s.id} value={s.id}>{s.name} ({s.className})</option>)}
                  </select>
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-xs font-medium text-gray-500 mb-1">Max Marks</label>
                  <input required type="number" min="1" value={formData.maxMarks} onChange={e => setFormData({...formData, maxMarks: Number(e.target.value)})} className="w-full border border-card-border p-2.5 rounded-md text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-card-bg text-foreground" />
                </div>
              </div>
              
              <div className="border border-card-border p-3 rounded-md bg-background-panel">
                <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">Deadline</label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Date</label>
                    <input required type="date" value={formData.deadlineDate} onChange={e => setFormData({...formData, deadlineDate: e.target.value})} className="w-full border border-card-border p-2.5 rounded-md text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-card-bg text-foreground" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Time</label>
                    <input required type="time" value={formData.deadlineTime} onChange={e => setFormData({...formData, deadlineTime: e.target.value})} className="w-full border border-card-border p-2.5 rounded-md text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-card-bg text-foreground" />
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-6 pt-2">
                <label className="flex items-center space-x-2 text-sm cursor-pointer group">
                  <input type="checkbox" checked={formData.allowResubmission} onChange={e => setFormData({...formData, allowResubmission: e.target.checked})} className="rounded border-card-border text-primary focus:ring-primary cursor-pointer w-4 h-4" />
                  <span className="text-gray-600 group-hover:text-foreground transition-colors">Allow Resubmit</span>
                </label>
                <label className="flex items-center space-x-2 text-sm cursor-pointer group">
                  <input type="checkbox" checked={formData.isPublished} onChange={e => setFormData({...formData, isPublished: e.target.checked})} className="rounded border-card-border text-primary focus:ring-primary cursor-pointer w-4 h-4" />
                  <span className="text-gray-600 group-hover:text-foreground transition-colors">Publish</span>
                </label>
              </div>
              <div className="flex justify-end space-x-3 pt-5 border-t border-card-border mt-6">
                <button type="button" onClick={() => setShowCreate(false)} className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-foreground transition-colors">Cancel</button>
                <button type="submit" className="px-5 py-2 text-sm font-medium bg-foreground text-card-bg rounded-md hover:bg-foreground/80 transition-colors">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Submissions Viewer Modal */}
      {viewingSubmissionsFor && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-card-bg rounded-xl shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col border border-card-border">
            <div className="p-5 border-b border-card-border flex justify-between items-center bg-card-bg rounded-t-xl">
              <div>
                <h3 className="text-lg font-semibold text-foreground">Submissions</h3>
                <p className="text-xs text-gray-500 mt-0.5">{viewingSubmissionsFor.title}</p>
              </div>
              <button onClick={() => setViewingSubmissionsFor(null)} className="text-gray-400 hover:text-gray-600 transition-colors p-1">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            
            <div className="overflow-y-auto flex-1">
              <table className="min-w-full text-sm text-left">
                <thead className="bg-background-panel text-gray-500 uppercase text-xs tracking-wider sticky top-0 border-b border-card-border">
                  <tr>
                    <th className="px-6 py-3 font-medium">Student</th>
                    <th className="px-6 py-3 font-medium">Submitted At</th>
                    <th className="px-6 py-3 font-medium">Status</th>
                    <th className="px-6 py-3 font-medium">Score</th>
                    <th className="px-6 py-3 font-medium text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-card-border bg-card-bg">
                  {submissions.map(sub => (
                    <tr key={sub.id} className="hover:bg-background-panel/50">
                      <td className="px-6 py-4 font-medium text-foreground">{sub.studentName}</td>
                      <td className="px-6 py-4 text-gray-500">{new Date(sub.submittedAt).toLocaleString()}</td>
                      <td className="px-6 py-4"><StatusBadge status={sub.status} /></td>
                      <td className="px-6 py-4 text-foreground font-medium">
                        {sub.status === 'Graded' ? `${sub.marks}/${viewingSubmissionsFor.maxMarks}` : '-'}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button onClick={() => { setGradingSubmission(sub); setGradeData({ marks: sub.marks || 0, feedback: sub.feedback || "" }); }} className="text-primary font-medium hover:text-primary/80 transition-colors">
                          {sub.status === 'Graded' ? 'Edit Grade' : 'Grade'}
                        </button>
                      </td>
                    </tr>
                  ))}
                  {submissions.length === 0 && (
                    <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-400">No submissions yet.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Grade Modal */}
      {gradingSubmission && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-[60]">
          <div className="bg-card-bg rounded-xl shadow-2xl p-6 w-full max-w-lg border border-card-border">
            <h3 className="text-lg font-semibold text-foreground mb-4">Evaluate</h3>
            
            <div className="mb-6">
              <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">{gradingSubmission.studentName}'s Answer</label>
              <div className="bg-background-panel border border-card-border p-4 rounded-md text-sm text-foreground whitespace-pre-wrap max-h-48 overflow-y-auto font-mono">
                {gradingSubmission.answerText}
              </div>
            </div>

            <form onSubmit={handleGrade} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Marks (Max: {viewingSubmissionsFor?.maxMarks})</label>
                <input required type="number" max={viewingSubmissionsFor?.maxMarks} min="0" value={gradeData.marks} onChange={e => setGradeData({...gradeData, marks: Number(e.target.value)})} className="w-full border border-card-border p-2.5 rounded-md text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-card-bg text-foreground" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Feedback</label>
                <textarea value={gradeData.feedback} onChange={e => setGradeData({...gradeData, feedback: e.target.value})} className="w-full border border-card-border p-2.5 rounded-md text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-card-bg text-foreground" rows={3} placeholder="Optional note for student..." />
              </div>
              <div className="flex justify-end space-x-3 pt-5 border-t border-card-border mt-6">
                <button type="button" onClick={() => setGradingSubmission(null)} className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-foreground transition-colors">Cancel</button>
                <button type="submit" className="px-5 py-2 text-sm font-medium bg-primary text-white rounded-md hover:bg-primary/90 transition-colors">Submit Grade</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </DashboardLayout>
  );
}
