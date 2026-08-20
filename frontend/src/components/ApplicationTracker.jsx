import { useEffect, useState } from "react";
import api from "../services/api";

const initialApplication = { company: "", role: "", status: "applied", appliedDate: new Date().toISOString().slice(0, 10), nextStep: "" };
const statuses = ["applied", "assessment", "interview", "offer", "rejected", "withdrawn"];

function ApplicationTracker() {
  const [applications, setApplications] = useState([]);
  const [draft, setDraft] = useState(initialApplication);
  const [status, setStatus] = useState("");

  useEffect(() => {
    let cancelled = false;
    const fetchApplications = async () => {
      try { const { data } = await api.get("/applications/me"); if (!cancelled) setApplications(data.applications); }
      catch { if (!cancelled) setStatus("Unable to load your applications."); }
    };
    fetchApplications();
    return () => { cancelled = true; };
  }, []);

  const addApplication = async (event) => {
    event.preventDefault();
    if (!draft.company.trim() || !draft.role.trim()) return setStatus("Company and role are required.");
    try { const { data } = await api.post("/applications/me", draft); setApplications((current) => [data.application, ...current]); setDraft(initialApplication); setStatus("Application added."); }
    catch (error) { setStatus(error.response?.data?.message || "Could not add application."); }
  };
  const updateStatus = async (application, nextStatus) => {
    try { const { data } = await api.put(`/applications/me/${application._id}`, { status: nextStatus }); setApplications((current) => current.map((item) => item._id === application._id ? data.application : item)); }
    catch { setStatus("Could not update application status."); }
  };
  const removeApplication = async (id) => {
    try { await api.delete(`/applications/me/${id}`); setApplications((current) => current.filter((item) => item._id !== id)); setStatus("Application removed."); }
    catch { setStatus("Could not remove application."); }
  };

  return <section className="feature-card application-card"><div className="section-heading"><div><p className="eyebrow">PLACEMENT TRACKER</p><h2>Applications</h2></div><span>{applications.length} tracked</span></div><form className="application-form" onSubmit={addApplication}><input value={draft.company} onChange={(event) => setDraft({ ...draft, company: event.target.value })} placeholder="Company *" /><input value={draft.role} onChange={(event) => setDraft({ ...draft, role: event.target.value })} placeholder="Role *" /><select value={draft.status} onChange={(event) => setDraft({ ...draft, status: event.target.value })}>{statuses.slice(0, 3).map((item) => <option key={item} value={item}>{item}</option>)}</select><input type="date" value={draft.appliedDate} onChange={(event) => setDraft({ ...draft, appliedDate: event.target.value })} /><input value={draft.nextStep} onChange={(event) => setDraft({ ...draft, nextStep: event.target.value })} placeholder="Next step (optional)" /><button>Add application</button></form>{status && <p className="status">{status}</p>}<div className="application-list">{applications.map((item) => <article key={item._id}><div><h3>{item.company}</h3><p>{item.role}{item.nextStep ? ` · ${item.nextStep}` : ""}</p></div><select className={`application-status ${item.status}`} value={item.status} onChange={(event) => updateStatus(item, event.target.value)}>{statuses.map((value) => <option value={value} key={value}>{value}</option>)}</select><button type="button" className="delete-action" onClick={() => removeApplication(item._id)}>Remove</button></article>)}{applications.length === 0 && <p className="empty-state">Track applications here once you begin applying for internships or placements.</p>}</div></section>;
}

export default ApplicationTracker;
