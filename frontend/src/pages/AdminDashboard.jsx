import { useEffect, useState } from "react";
import useAuth from "../context/useAuth";
import api from "../services/api";

function AdminDashboard() {
  const { user, logout } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    const loadAnalytics = async () => { try { const { data } = await api.get("/admin/analytics"); if (!cancelled) setAnalytics(data.analytics); } catch (requestError) { if (!cancelled) setError(requestError.response?.data?.message || "Unable to load placement analytics."); } };
    loadAnalytics(); return () => { cancelled = true; };
  }, []);

  const careerLabels = { "java-backend": "Java Backend", frontend: "Frontend", "full-stack": "Full Stack" };
  return <main className="role-shell"><header className="role-header"><div><p className="eyebrow">SKILLSPHERE · PLACEMENT ADMIN</p><h1>Placement readiness at a glance.</h1><p>Welcome, {user?.name}. Monitor career activity across the student community.</p></div><button className="secondary" onClick={logout}>Log out</button></header>{error && <p className="status">{error}</p>}{!analytics && !error ? <section className="role-card"><p>Loading analytics...</p></section> : analytics && <><section className="metric-grid"><article><span>Students</span><strong>{analytics.students}</strong></article><article><span>Career Passports</span><strong>{analytics.profiles}</strong></article><article><span>Average readiness</span><strong>{analytics.averageReadiness}%</strong></article><article><span>Open jobs</span><strong>{analytics.openJobs}</strong></article><article><span>Applications tracked</span><strong>{analytics.applications}</strong></article><article><span>Recruiters</span><strong>{analytics.recruiters}</strong></article></section><section className="role-grid"><section className="role-card"><p className="eyebrow">CAREER DISTRIBUTION</p><h2>Target paths</h2><div className="analytics-list">{Object.entries(analytics.byTargetCareer).map(([career, total]) => <div key={career}><span>{careerLabels[career] || career}</span><strong>{total} students</strong></div>)}{Object.keys(analytics.byTargetCareer).length === 0 && <p className="empty-state">No target-career data yet.</p>}</div></section><section className="role-card"><p className="eyebrow">APPLICATION FUNNEL</p><h2>Current status</h2><div className="analytics-list">{Object.entries(analytics.applicationStatus).map(([state, total]) => <div key={state}><span>{state}</span><strong>{total}</strong></div>)}{Object.keys(analytics.applicationStatus).length === 0 && <p className="empty-state">No applications tracked yet.</p>}</div></section></section></>}</main>;
}

export default AdminDashboard;
