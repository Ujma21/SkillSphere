import { useEffect, useState } from "react";
import api from "../services/api";

function JobBoard() {
  const [jobs, setJobs] = useState([]);
  const [appliedJobIds, setAppliedJobIds] = useState(new Set());
  const [status, setStatus] = useState("");
  const [applyingId, setApplyingId] = useState("");

  useEffect(() => {
    let cancelled = false;
    const loadJobs = async () => {
      try {
        const [jobsResponse, applicationsResponse] = await Promise.all([api.get("/jobs"), api.get("/jobs/my-applications")]);
        if (!cancelled) { setJobs(jobsResponse.data.jobs); setAppliedJobIds(new Set(applicationsResponse.data.applications.map((application) => application.job?._id).filter(Boolean))); }
      } catch (error) { if (!cancelled) setStatus(error.response?.data?.message || "Unable to load jobs."); }
    };
    loadJobs(); return () => { cancelled = true; };
  }, []);

  const apply = async (jobId) => {
    setApplyingId(jobId); setStatus("");
    try { await api.post(`/jobs/${jobId}/apply`); setAppliedJobIds((current) => new Set([...current, jobId])); setStatus("Application submitted. Track its status in Applications below."); }
    catch (error) { setStatus(error.response?.data?.message || "Could not submit application."); }
    finally { setApplyingId(""); }
  };

  return <section className="job-board"><div className="section-heading"><div><p className="eyebrow">JOB PORTAL</p><h2>Open opportunities</h2></div><span>{jobs.length} open</span></div>{status && <p className="status">{status}</p>}<div className="job-board-list">{jobs.map((job) => <article key={job._id}><div><div className="job-title-row"><h3>{job.title}</h3><span>{job.type}</span></div><p>{job.company} · {job.location || "Location flexible"}</p>{job.description && <p className="job-description">{job.description}</p>}<div className="job-skills">{job.skills.map((skill) => <span key={skill}>{skill}</span>)}</div></div><button disabled={appliedJobIds.has(job._id) || applyingId === job._id} onClick={() => apply(job._id)}>{appliedJobIds.has(job._id) ? "Applied" : applyingId === job._id ? "Applying..." : "Apply now"}</button></article>)}{jobs.length === 0 && <p className="empty-state">No recruiter jobs are open yet. Check back soon.</p>}</div></section>;
}

export default JobBoard;
