import { useEffect, useState } from "react";
import api from "../services/api";

const initialEvent = { title: "", category: "skill", eventDate: new Date().toISOString().slice(0, 10), description: "" };

function JourneyTimeline() {
  const [events, setEvents] = useState([]);
  const [draft, setDraft] = useState(initialEvent);
  const [status, setStatus] = useState("");

  useEffect(() => {
    let cancelled = false;
    const fetchEvents = async () => {
      try { const { data } = await api.get("/journey/me"); if (!cancelled) setEvents(data.events); }
      catch { if (!cancelled) setStatus("Unable to load your timeline."); }
    };
    fetchEvents();
    return () => { cancelled = true; };
  }, []);

  const addEvent = async (event) => {
    event.preventDefault();
    if (!draft.title.trim()) return setStatus("Add a title for this milestone.");
    try {
      const { data } = await api.post("/journey/me", { ...draft, title: draft.title.trim() });
      setEvents((current) => [data.event, ...current]); setDraft(initialEvent); setStatus("Timeline milestone added.");
    } catch (error) { setStatus(error.response?.data?.message || "Could not add milestone."); }
  };

  const removeEvent = async (id) => {
    try { await api.delete(`/journey/me/${id}`); setEvents((current) => current.filter((item) => item._id !== id)); setStatus("Timeline milestone removed."); }
    catch { setStatus("Could not remove milestone."); }
  };

  return <section className="feature-card timeline-card"><div className="section-heading"><div><p className="eyebrow">PLACEMENT JOURNEY</p><h2>Your growth timeline</h2></div><span>{events.length} milestones</span></div><form className="timeline-form" onSubmit={addEvent}><input value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} placeholder="Milestone title *" /><select value={draft.category} onChange={(event) => setDraft({ ...draft, category: event.target.value })}><option value="skill">Skill learned</option><option value="project">Project completed</option><option value="certification">Certification earned</option><option value="internship">Internship</option><option value="interview">Interview</option><option value="achievement">Achievement</option></select><input type="date" value={draft.eventDate} onChange={(event) => setDraft({ ...draft, eventDate: event.target.value })} /><input className="timeline-description" value={draft.description} onChange={(event) => setDraft({ ...draft, description: event.target.value })} placeholder="A short note (optional)" /><button>Add milestone</button></form>{status && <p className="status">{status}</p>}<div className="timeline-list">{events.map((item) => <article key={item._id}><time>{new Date(item.eventDate).toLocaleDateString(undefined, { month: "short", year: "numeric" })}</time><div><span className="category-tag">{item.category}</span><h3>{item.title}</h3>{item.description && <p>{item.description}</p>}</div><button type="button" className="delete-action" onClick={() => removeEvent(item._id)}>Remove</button></article>)}{events.length === 0 && <p className="empty-state">Add milestones such as “Built my first React project” to make your career journey visible.</p>}</div></section>;
}

export default JourneyTimeline;
