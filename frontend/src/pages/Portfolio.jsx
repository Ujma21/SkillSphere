import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../services/api";

const careerLabels = { "java-backend": "Java Backend Developer", frontend: "Frontend Developer", "full-stack": "Full Stack Developer" };

function Portfolio() {
  const { userId } = useParams();
  const [portfolio, setPortfolio] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    const loadPortfolio = async () => {
      try { const endpoint = userId === "preview" ? "/portfolio/preview" : `/portfolio/${userId}`; const { data } = await api.get(endpoint); if (!cancelled) setPortfolio(data.portfolio); }
      catch (requestError) { if (!cancelled) setError(requestError.response?.data?.message || "This portfolio could not be loaded."); }
    };
    loadPortfolio();
    return () => { cancelled = true; };
  }, [userId]);

  if (error) return <main className="portfolio-page"><section className="portfolio-empty"><p className="eyebrow">SKILLSPHERE</p><h1>Portfolio unavailable</h1><p>{error}</p><Link to={localStorage.getItem("token") ? "/dashboard" : "/login"}>Go to SkillSphere</Link></section></main>;
  if (!portfolio) return <main className="portfolio-page"><section className="portfolio-empty"><p className="eyebrow">SKILLSPHERE</p><h1>Loading Career Passport...</h1></section></main>;

  const { student, profile, readiness } = portfolio;
  const skills = profile.skills || [];
  const projects = profile.projects || [];
  const certifications = profile.certifications || [];
  return <main className="portfolio-page"><header className="portfolio-nav"><Link to="/" className="brand">SkillSphere</Link><span>Career Passport</span></header><section className="portfolio-hero"><div><p className="eyebrow">CAREER PASSPORT</p><h1>{student.name}</h1><p className="portfolio-role">{careerLabels[profile.targetCareer] || "Career Explorer"}</p>{profile.college && <p className="portfolio-meta">{profile.degree}{profile.degree && profile.college ? " · " : ""}{profile.college}{profile.graduationYear ? ` · Class of ${profile.graduationYear}` : ""}</p>}<div className="portfolio-links">{profile.githubUrl && <a href={profile.githubUrl} target="_blank" rel="noreferrer">GitHub</a>}{profile.linkedinUrl && <a href={profile.linkedinUrl} target="_blank" rel="noreferrer">LinkedIn</a>}</div></div><div className="portfolio-score"><span>CAREER READINESS</span><strong>{readiness.score}%</strong><p>{readiness.career || "Target role not selected"}</p></div></section><section className="portfolio-grid"><article className="portfolio-card"><p className="eyebrow">SKILL SET</p><h2>Technical skills</h2>{skills.length ? <div className="portfolio-skills">{skills.map((skill) => <span key={skill.name}>{skill.name}</span>)}</div> : <p className="empty-state">No skills added yet.</p>}<div className="portfolio-stat"><strong>{profile.dsaProblemsSolved || 0}</strong><span>DSA problems solved</span></div></article><article className="portfolio-card"><p className="eyebrow">CAREER GPS</p><h2>Next best action</h2><p className="portfolio-action">{readiness.nextAction}</p><h3>Learning path</h3><ol className="portfolio-roadmap">{readiness.roadmap.map((step) => <li key={step}>{step}</li>)}</ol></article></section><section className="portfolio-card portfolio-wide"><p className="eyebrow">PROJECTS</p><h2>Portfolio work</h2>{projects.length ? <div className="public-projects">{projects.map((project, index) => <article key={`${project.title}-${index}`}><h3>{project.title}</h3><p>{project.description || "Project description not provided."}</p><div>{(project.techStack || []).map((tech) => <span key={tech}>{tech}</span>)}</div>{project.url && <a href={project.url} target="_blank" rel="noreferrer">View project</a>}</article>)}</div> : <p className="empty-state">No projects added yet.</p>}</section><section className="portfolio-card portfolio-wide"><p className="eyebrow">CERTIFICATIONS</p><h2>Verified learning</h2>{certifications.length ? <div className="public-certifications">{certifications.map((certification, index) => <article key={`${certification.title}-${index}`}><h3>{certification.title}</h3><p>{certification.issuer || "Issuer not specified"}{certification.year ? ` · ${certification.year}` : ""}</p></article>)}</div> : <p className="empty-state">No certifications added yet.</p>}</section><footer className="portfolio-footer">Built with SkillSphere · Intelligent Career Readiness & Placement Ecosystem</footer></main>;
}

export default Portfolio;
