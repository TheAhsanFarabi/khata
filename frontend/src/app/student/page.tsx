"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { DashboardSummaryCard } from "@/components/DashboardSummaryCard";
import { StatusBadge } from "@/components/StatusBadge";
import { fetchApi } from "@/services/api";

export default function StudentDashboard() {
  const [assignments, setAssignments] = useState<any[]>([]);
  const [mySubmissions, setMySubmissions] = useState<any[]>([]);
  const [activeAssignment, setActiveAssignment] = useState<any>(null);
  const [answerText, setAnswerText] = useState("");

  const loadData = async () => {
    try {
      const [assns, subs] = await Promise.all([
        fetchApi<any[]>("/Assignments"),
        fetchApi<any[]>("/Submissions/mine")
      ]);
      setAssignments(assns);
      setMySubmissions(subs);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeAssignment) return;
    
    try {
      await fetchApi("/Submissions", {
        method: "POST",
        body: JSON.stringify({ assignmentId: activeAssignment.id, answerText: answerText })
      });
      setActiveAssignment(null);
      setAnswerText("");
      loadData();
    } catch (err: any) { alert(err.message); }
  };

  // derived stats
  const totalDue = assignments.length;
  const submittedCount = mySubmissions.length;
  const gradedCount = mySubmissions.filter(s => s.status === 'Graded').length;

  return (
    <DashboardLayout title="Coursework">
      
      <div id="overview" className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 pt-4 scroll-mt-20">
        <DashboardSummaryCard title="Total Assignments" value={totalDue} />
        <DashboardSummaryCard title="Submitted" value={submittedCount} />
        <DashboardSummaryCard title="Graded" value={gradedCount} />
      </div>

      <div id="coursework" className="bg-card-bg rounded-xl border border-card-border shadow-sm overflow-hidden scroll-mt-20">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-background-panel text-gray-500 uppercase text-xs tracking-wider border-b border-card-border">
              <tr>
                <th className="px-6 py-4 font-medium">Assignment</th>
                <th className="px-6 py-4 font-medium">Deadline</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-card-border bg-card-bg">
              {assignments.map(a => {
                const submission = mySubmissions.find(s => s.assignmentId === a.id);
                const isGraded = submission?.status === 'Graded';
                const canSubmit = !isGraded && (!submission || a.allowResubmission);
                // Simple late logic for visual (if past deadline and not submitted)
                const isLate = !submission && new Date(a.deadline) < new Date();

                return (
                  <tr key={a.id} className="hover:bg-background-panel/50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-medium text-foreground">{a.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{a.subjectName}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="inline-flex items-center px-2 py-1 rounded-md bg-background-panel text-gray-600 text-xs font-medium font-mono">
                        {new Date(a.deadline).toLocaleDateString()} {new Date(a.deadline).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={submission ? submission.status : (isLate ? 'Late' : 'Published')} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => { setActiveAssignment(a); setAnswerText(submission?.answerText || ""); }}
                        className="text-primary font-medium hover:text-primary/80 transition-colors text-sm"
                      >
                        {submission ? 'View Details' : 'Start'}
                      </button>
                    </td>
                  </tr>
                );
              })}
              {assignments.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-400">
                    <div className="flex flex-col items-center">
                      <svg className="w-12 h-12 mb-3 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                      <p>No coursework found.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {activeAssignment && (() => {
        const submission = mySubmissions.find(s => s.assignmentId === activeAssignment.id);
        const isGraded = submission?.status === 'Graded';
        const canSubmit = !isGraded && (!submission || activeAssignment.allowResubmission);

        return (
          <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-card-bg rounded-xl shadow-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-card-border flex flex-col">
              
              <div className="mb-6 border-b border-card-border pb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold text-foreground">{activeAssignment.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">{activeAssignment.subjectName}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600 font-mono bg-background-panel px-2 py-1 rounded">Max Marks: {activeAssignment.maxMarks}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-700 mt-4 leading-relaxed">{activeAssignment.description}</p>
              </div>
              
              {submission && (
                <div className="mb-6 p-4 rounded-lg bg-background-panel border border-card-border">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Your Status</span>
                    <StatusBadge status={submission.status} />
                  </div>
                  {isGraded && (
                    <div className="mt-4 pt-4 border-t border-card-border">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-foreground">Score:</span>
                        <span className="text-lg font-bold text-primary">{submission.marks} <span className="text-sm text-gray-400 font-normal">/ {activeAssignment.maxMarks}</span></span>
                      </div>
                      {submission.feedback && (
                        <div className="mt-4">
                          <span className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Teacher's Feedback</span>
                          <p className="text-sm text-gray-700 font-mono bg-card-bg p-3 border border-card-border rounded">{submission.feedback}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {canSubmit ? (
                <form onSubmit={handleSubmit} className="mt-auto">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Your Answer</label>
                  <textarea 
                    required rows={6} value={answerText} onChange={e => setAnswerText(e.target.value)}
                    className="w-full border border-card-border p-3 rounded-md text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary font-mono bg-card-bg text-foreground" 
                    placeholder="Write your answer here..."
                  />
                  <div className="flex justify-end space-x-3 pt-5 border-t border-card-border mt-6">
                    <button type="button" onClick={() => setActiveAssignment(null)} className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-foreground transition-colors">Close</button>
                    <button type="submit" className="px-5 py-2 text-sm font-medium bg-foreground text-card-bg rounded-md hover:bg-foreground/80 transition-colors">
                      {submission ? 'Resubmit' : 'Submit'}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="mt-auto flex justify-end pt-5 border-t border-card-border">
                  <button type="button" onClick={() => setActiveAssignment(null)} className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-foreground transition-colors">Close</button>
                </div>
              )}

            </div>
          </div>
        );
      })()}
      
    </DashboardLayout>
  );
}
