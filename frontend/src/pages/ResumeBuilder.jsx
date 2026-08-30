import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useAuth from "../context/useAuth";
import api from "../services/api";

const emptyResume = {
  targetCareer: "",
  summary: "",
  phone: "",
  location: "",
  education: [],
  experience: [],
  achievements: [],
  additionalSections: [],
};

function ResumeBuilder() {
  const { user } = useAuth();

  const [resume, setResume] = useState(emptyResume);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("");

  useEffect(() => {
    const loadResume = async () => {
      try {
        const response = await api.get("/resume/me");

        if (response.data.resume) {
          setResume({
            ...emptyResume,
            ...response.data.resume,
          });
        }
      } catch (error) {
        console.error("Failed to load resume:", error);
        setStatus("Could not load your resume.");
      } finally {
        setLoading(false);
      }
    };

    loadResume();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setResume((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const saveResume = async (event) => {
    event.preventDefault();

    setSaving(true);
    setStatus("");

    try {
      const response = await api.put("/resume/me", resume);

      setResume({
        ...emptyResume,
        ...response.data.resume,
      });

      setStatus("Resume saved successfully.");
    } catch (error) {
      console.error("Failed to save resume:", error);

      setStatus(
        error.response?.data?.message ||
          "Could not save your resume."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <main className="dashboard-shell">Loading Resume Builder...</main>;
  }

  return (
    <main className="dashboard-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">SKILLSPHERE</p>
          <h1>ATS Resume Builder</h1>
        </div>

        <div className="topbar-actions">
          <Link className="portfolio-link" to="/dashboard">
            Back to Dashboard
          </Link>
        </div>
      </header>

      <section className="hero-card">
        <div>
          <p className="eyebrow">RESUME BUILDER</p>

          <h2>
            Build an ATS-friendly resume,{" "}
            {user?.name || "Student"}.
          </h2>

          <p>
            Create a clean, professional resume optimized for
            applicant tracking systems and your target career.
          </p>
        </div>
      </section>

      <section className="passport-layout">
        <form className="passport-card" onSubmit={saveResume}>
          <div>
            <p className="eyebrow">RESUME INFORMATION</p>
            <h2>Basic Details</h2>
          </div>

          <label>
            Target Career
            <input
              name="targetCareer"
              value={resume.targetCareer}
              onChange={handleChange}
              placeholder="Java Backend Developer"
            />
          </label>

          <label>
            Professional Summary
            <textarea
              name="summary"
              value={resume.summary}
              onChange={handleChange}
              placeholder="Write a concise professional summary..."
              rows="6"
            />
          </label>

          <div className="form-grid">
            <label>
              Phone
              <input
                name="phone"
                value={resume.phone}
                onChange={handleChange}
                placeholder="+91 XXXXX XXXXX"
              />
            </label>

            <label>
              Location
              <input
                name="location"
                value={resume.location}
                onChange={handleChange}
                placeholder="Pune, Maharashtra"
              />
            </label>
          </div>

          <button disabled={saving}>
            {saving ? "Saving..." : "Save Resume"}
          </button>

          {status && <p className="status">{status}</p>}
        </form>

        <aside className="next-card">
          <p className="eyebrow">COMING NEXT</p>

          <ol>
            <li className="active">Basic resume information</li>
            <li>Import Career Passport</li>
            <li>Education & experience</li>
            <li>Select skills & projects</li>
            <li>ATS analysis</li>
            <li>Resume preview</li>
            <li>PDF download</li>
          </ol>
        </aside>
      </section>
    </main>
  );
}

export default ResumeBuilder;