
import { useEffect, useState } from "react";
import useAuth from "../context/useAuth";
import api from "../services/api";
import { Link, Navigate } from "react-router-dom";
import JourneyTimeline from "../components/JourneyTimeline";
import ApplicationTracker from "../components/ApplicationTracker";
import JobBoard from "../components/JobBoard";

const careers = [
  ["java-backend", "Java Backend Developer"],
  ["frontend", "Frontend Developer"],
  ["full-stack", "Full Stack Developer"],
];

const emptyProfile = {
  college: "",
  degree: "",
  graduationYear: "",
  targetCareer: "",
  githubUrl: "",
  linkedinUrl: "",
  dsaProblemsSolved: 0,
  projects: [],
  certifications: [],
};

const emptyProject = {
  title: "",
  description: "",
  techStack: "",
  url: "",
};

const emptyCertification = {
  title: "",
  issuer: "",
  year: "",
};

function Dashboard() {
  const { user, logout } = useAuth();

  const [profile, setProfile] = useState(emptyProfile);
  const [skillsText, setSkillsText] = useState("");
  const [projectDraft, setProjectDraft] = useState(emptyProject);
  const [certificationDraft, setCertificationDraft] =
    useState(emptyCertification);

  const [editingProject, setEditingProject] = useState(null);
  const [editingCertification, setEditingCertification] = useState(null);

  const [readiness, setReadiness] = useState({
    score: 0,
    career: null,
    breakdown: [],
    missingSkills: [],
    roadmap: [],
    nextAction: "Complete your Passport to calculate readiness.",
  });

  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("");

  const applyProfile = (savedProfile) => {
    setProfile({
      ...emptyProfile,
      ...savedProfile,
      graduationYear: savedProfile.graduationYear || "",
      projects: savedProfile.projects || [],
      certifications: savedProfile.certifications || [],
    });

    setSkillsText(
      (savedProfile.skills || [])
        .map((skill) => skill.name)
        .join(", ")
    );
  };

  useEffect(() => {
    let cancelled = false;

    const fetchPassport = async () => {
      try {
        const [profileResponse, readinessResponse] = await Promise.all([
          api.get("/profile/me"),
          api.get("/readiness/me"),
        ]);

        if (cancelled) return;

        if (profileResponse.data.profile) {
          applyProfile(profileResponse.data.profile);
        }

        setReadiness(readinessResponse.data.readiness);
      } catch {
        if (!cancelled) {
          setStatus("Unable to load your passport yet.");
        }
      }
    };

    fetchPassport();

    return () => {
      cancelled = true;
    };
  }, []);

  const persistProfile = async (nextProfile, successMessage) => {
    setSaving(true);
    setStatus("");

    try {
      const payload = {
        ...nextProfile,

        graduationYear: nextProfile.graduationYear
          ? Number(nextProfile.graduationYear)
          : undefined,

        dsaProblemsSolved: Number(
          nextProfile.dsaProblemsSolved || 0
        ),

        skills: skillsText
          .split(",")
          .map((name) => name.trim())
          .filter(Boolean)
          .map((name) => ({ name })),
      };

      const { data } = await api.put("/profile/me", payload);

      applyProfile(data.profile);

      const readinessResponse = await api.get("/readiness/me");

      setReadiness(readinessResponse.data.readiness);

      setStatus(successMessage);

      return true;
    } catch (error) {
      setStatus(
        error.response?.data?.message ||
          "Could not save your passport."
      );

      return false;
    } finally {
      setSaving(false);
    }
  };

  const saveEssentials = (event) => {
    event.preventDefault();

    persistProfile(
      profile,
      "Career Passport saved."
    );
  };

  const handleProfileChange = (event) => {
    setProfile({
      ...profile,
      [event.target.name]: event.target.value,
    });
  };

  const addOrUpdateProject = async (event) => {
    event.preventDefault();

    if (!projectDraft.title.trim()) {
      return setStatus("A project title is required.");
    }

    const item = {
      ...projectDraft,
      title: projectDraft.title.trim(),
      techStack: projectDraft.techStack
        .split(",")
        .map((tech) => tech.trim())
        .filter(Boolean),
    };

    const projects = [...profile.projects];

    if (editingProject === null) {
      projects.push(item);
    } else {
      projects[editingProject] = item;
    }

    const saved = await persistProfile(
      {
        ...profile,
        projects,
      },
      editingProject === null
        ? "Project added to your passport."
        : "Project updated."
    );

    if (saved) {
      setProjectDraft(emptyProject);
      setEditingProject(null);
    }
  };

  const editProject = (index) => {
    const project = profile.projects[index];

    setProjectDraft({
      ...project,
      techStack: (project.techStack || []).join(", "),
    });

    setEditingProject(index);
  };

  const deleteProject = (index) => {
    persistProfile(
      {
        ...profile,
        projects: profile.projects.filter(
          (_, itemIndex) => itemIndex !== index
        ),
      },
      "Project removed."
    );
  };

  const addOrUpdateCertification = async (event) => {
    event.preventDefault();

    if (!certificationDraft.title.trim()) {
      return setStatus("A certification title is required.");
    }

    const item = {
      ...certificationDraft,
      title: certificationDraft.title.trim(),
      year: certificationDraft.year
        ? Number(certificationDraft.year)
        : undefined,
    };

    const certifications = [...profile.certifications];

    if (editingCertification === null) {
      certifications.push(item);
    } else {
      certifications[editingCertification] = item;
    }

    const saved = await persistProfile(
      {
        ...profile,
        certifications,
      },
      editingCertification === null
        ? "Certification added to your passport."
        : "Certification updated."
    );

    if (saved) {
      setCertificationDraft(emptyCertification);
      setEditingCertification(null);
    }
  };

  const editCertification = (index) => {
    setCertificationDraft(profile.certifications[index]);
    setEditingCertification(index);
  };

  const deleteCertification = (index) => {
    persistProfile(
      {
        ...profile,
        certifications: profile.certifications.filter(
          (_, itemIndex) => itemIndex !== index
        ),
      },
      "Certification removed."
    );
  };

  if (user?.role === "recruiter") {
    return <Navigate to="/recruiter" replace />;
  }

  if (user?.role === "admin") {
    return <Navigate to="/admin" replace />;
  }

  return (
    <main className="dashboard-shell">

      {/* TOP BAR */}
      <header className="topbar">
        <div>
          <p className="eyebrow">SKILLSPHERE</p>
          <h1>Your Career Passport</h1>
        </div>

        <div className="topbar-actions">
          <Link
            className="portfolio-link"
            to="/portfolio/preview"
          >
            View public portfolio
          </Link>

          <button
            className="secondary"
            onClick={logout}
          >
            Log out
          </button>
        </div>
      </header>

      {/* HERO */}
      <section className="hero-card">
        <div>
          <p className="eyebrow">WELCOME BACK</p>

          <h2>
            {user?.name || "Student"}, build your career signal.
          </h2>

          <p>
            Your Passport captures the evidence that drives your
            readiness score and tailored career guidance.
          </p>
        </div>

        <div className="score-preview">
          <span>READINESS</span>

          <strong>{readiness.score}%</strong>

          <small>
            {readiness.career ||
              "Choose a supported target role"}
          </small>
        </div>
      </section>

      {/* READINESS */}
      <section className="readiness-grid">

        <article className="readiness-card">
          <p className="eyebrow">CAREER GPS</p>

          <h2>
            {readiness.career ||
              "Choose a target career"}
          </h2>

          <p className="next-action">
            {readiness.nextAction}
          </p>

          <div className="breakdown-list">
            {readiness.breakdown.map((item) => (
              <div key={item.label}>
                <span>{item.label}</span>

                <strong>
                  {item.score}/{item.max}
                </strong>

                <div className="progress-track">
                  <i
                    style={{
                      width: `${
                        (item.score / item.max) * 100
                      }%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="readiness-card">
          <p className="eyebrow">SKILL GAP ANALYSIS</p>

          <h2>What to learn next</h2>

          {readiness.missingSkills.length ? (
            <div className="skill-chips">
              {readiness.missingSkills.map((skill) => (
                <span key={skill}>{skill}</span>
              ))}
            </div>
          ) : (
            <p className="empty-state">
              {readiness.career
                ? "No required skills are missing. Keep building projects."
                : "Select Java Backend, Frontend, or Full Stack to unlock your roadmap."}
            </p>
          )}

          <p className="eyebrow roadmap-label">
            RECOMMENDED ORDER
          </p>

          <ol className="roadmap">
            {readiness.roadmap.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </article>

      </section>

      {/* PROFILE ESSENTIALS */}
      <section className="passport-layout">

        <form
          className="passport-card"
          onSubmit={saveEssentials}
        >
          <div>
            <p className="eyebrow">PHASE 1</p>
            <h2>Profile essentials</h2>
          </div>

          <div className="form-grid">
            <label>
              College

              <input
                name="college"
                value={profile.college}
                onChange={handleProfileChange}
                placeholder="Your college"
              />
            </label>

            <label>
              Degree

              <input
                name="degree"
                value={profile.degree}
                onChange={handleProfileChange}
                placeholder="MCA, B.Tech, etc."
              />
            </label>
          </div>

          <div className="form-grid">
            <label>
              Graduation year

              <input
                type="number"
                min="2000"
                max="2100"
                name="graduationYear"
                value={profile.graduationYear}
                onChange={handleProfileChange}
                placeholder="2027"
              />
            </label>

            <label>
              DSA problems solved

              <input
                type="number"
                min="0"
                name="dsaProblemsSolved"
                value={profile.dsaProblemsSolved}
                onChange={handleProfileChange}
              />
            </label>
          </div>

          <label>
            Target career

            <select
              name="targetCareer"
              value={profile.targetCareer}
              onChange={handleProfileChange}
            >
              <option value="">
                Choose your target role
              </option>

              {careers.map(([value, label]) => (
                <option
                  value={value}
                  key={value}
                >
                  {label}
                </option>
              ))}
            </select>
          </label>

          <label>
            Skills <span>Separate with commas</span>

            <input
              value={skillsText}
              onChange={(event) =>
                setSkillsText(event.target.value)
              }
              placeholder="React, Node.js, MongoDB"
            />
          </label>

          <div className="form-grid">
            <label>
              GitHub URL

              <input
                type="url"
                name="githubUrl"
                value={profile.githubUrl}
                onChange={handleProfileChange}
                placeholder="https://github.com/..."
              />
            </label>

            <label>
              LinkedIn URL

              <input
                type="url"
                name="linkedinUrl"
                value={profile.linkedinUrl}
                onChange={handleProfileChange}
                placeholder="https://linkedin.com/in/..."
              />
            </label>
          </div>

          <button disabled={saving}>
            {saving
              ? "Saving..."
              : "Save profile essentials"}
          </button>

          {status && (
            <p className="status">{status}</p>
          )}
        </form>

        <aside className="next-card">
          <p className="eyebrow">YOUR MILESTONES</p>

          <ol>
            <li className="active">
              Complete your Career Passport
            </li>

            <li>
              Add projects and certifications
            </li>

            <li>
              Calculate your readiness score
            </li>

            <li>
              Follow a role-based roadmap
            </li>
          </ol>

          <p className="note">
            Java is a target-career option, not a
            requirement for this MERN application.
          </p>
        </aside>

      </section>

      {/* PROJECTS AND CERTIFICATIONS */}
      <section className="evidence-grid">

        {/* PROJECTS */}
        <section className="evidence-card">

          <div className="section-heading">
            <div>
              <p className="eyebrow">
                PORTFOLIO EVIDENCE
              </p>

              <h2>Projects</h2>
            </div>

            <span>
              {profile.projects.length} added
            </span>
          </div>

          <form
            className="compact-form"
            onSubmit={addOrUpdateProject}
          >
            <input
              value={projectDraft.title}
              onChange={(event) =>
                setProjectDraft({
                  ...projectDraft,
                  title: event.target.value,
                })
              }
              placeholder="Project title *"
            />

            <input
              value={projectDraft.techStack}
              onChange={(event) =>
                setProjectDraft({
                  ...projectDraft,
                  techStack: event.target.value,
                })
              }
              placeholder="Tech stack (React, Node.js)"
            />

            <input
              value={projectDraft.url}
              onChange={(event) =>
                setProjectDraft({
                  ...projectDraft,
                  url: event.target.value,
                })
              }
              placeholder="Project URL"
            />

            <textarea
              value={projectDraft.description}
              onChange={(event) =>
                setProjectDraft({
                  ...projectDraft,
                  description: event.target.value,
                })
              }
              placeholder="What problem does it solve?"
              rows="3"
            />

            <div>
              <button disabled={saving}>
                {editingProject === null
                  ? "Add project"
                  : "Update project"}
              </button>

              {editingProject !== null && (
                <button
                  type="button"
                  className="text-button"
                  onClick={() => {
                    setProjectDraft(emptyProject);
                    setEditingProject(null);
                  }}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>

          <div className="evidence-list">
            {profile.projects.map((project, index) => (
              <article
                key={`${project.title}-${index}`}
              >
                <div>
                  <h3>{project.title}</h3>

                  <p>
                    {project.description ||
                      "No description yet."}
                  </p>

                  <small>
                    {(project.techStack || []).join(" / ")}
                  </small>
                </div>

                <div className="item-actions">
                  <button
                    type="button"
                    onClick={() =>
                      editProject(index)
                    }
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      deleteProject(index)
                    }
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}

            {profile.projects.length === 0 && (
              <p className="empty-state">
                Add your best work to begin building
                portfolio evidence.
              </p>
            )}
          </div>

        </section>

        {/* CERTIFICATIONS */}
        <section className="evidence-card">

          <div className="section-heading">
            <div>
              <p className="eyebrow">
                LEARNING EVIDENCE
              </p>

              <h2>Certifications</h2>
            </div>

            <span>
              {profile.certifications.length} added
            </span>
          </div>

          <form
            className="compact-form"
            onSubmit={addOrUpdateCertification}
          >
            <input
              value={certificationDraft.title}
              onChange={(event) =>
                setCertificationDraft({
                  ...certificationDraft,
                  title: event.target.value,
                })
              }
              placeholder="Certification title *"
            />

            <input
              value={certificationDraft.issuer}
              onChange={(event) =>
                setCertificationDraft({
                  ...certificationDraft,
                  issuer: event.target.value,
                })
              }
              placeholder="Issuer, e.g. Coursera"
            />

            <input
              type="number"
              min="2000"
              max="2100"
              value={certificationDraft.year}
              onChange={(event) =>
                setCertificationDraft({
                  ...certificationDraft,
                  year: event.target.value,
                })
              }
              placeholder="Year"
            />

            <div>
              <button disabled={saving}>
                {editingCertification === null
                  ? "Add certification"
                  : "Update certification"}
              </button>

              {editingCertification !== null && (
                <button
                  type="button"
                  className="text-button"
                  onClick={() => {
                    setCertificationDraft(
                      emptyCertification
                    );

                    setEditingCertification(null);
                  }}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>

          <div className="evidence-list">
            {profile.certifications.map(
              (certification, index) => (
                <article
                  key={`${certification.title}-${index}`}
                >
                  <div>
                    <h3>
                      {certification.title}
                    </h3>

                    <p>
                      {certification.issuer ||
                        "Issuer not specified"}

                      {certification.year
                        ? ` - ${certification.year}`
                        : ""}
                    </p>
                  </div>

                  <div className="item-actions">
                    <button
                      type="button"
                      onClick={() =>
                        editCertification(index)
                      }
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        deleteCertification(index)
                      }
                    >
                      Delete
                    </button>
                  </div>
                </article>
              )
            )}

            {profile.certifications.length === 0 && (
              <p className="empty-state">
                Add certificates that show verified
                learning.
              </p>
            )}
          </div>

        </section>

      </section>

      {/* ATS RESUME BUILDER */}
      <section className="resume-cta">

        <div>
          <p className="eyebrow">
            CAREER DOCUMENT
          </p>

          <h2>
            Build your ATS-friendly resume
          </h2>

          <p>
            Create a professional resume using your
            Career Passport, optimize it for your
            target role, and check your ATS score.
          </p>
        </div>

        <Link
          className="resume-cta-button"
          to="/resume"
        >
          Build My Resume →
        </Link>

      </section>

      {/* JOURNEY AND APPLICATION TRACKER */}
      <section className="tracking-grid">
        <JourneyTimeline />
        <ApplicationTracker />
      </section>

      {/* JOB BOARD */}
      <JobBoard />

    </main>
  );
}

export default Dashboard;

