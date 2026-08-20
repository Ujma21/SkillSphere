const careerRoadmaps = {
  "java-backend": {
    label: "Java Backend Developer",
    requiredSkills: ["Java", "SQL", "Git", "Spring Boot", "REST API", "JWT", "Docker"],
    roadmap: ["Java fundamentals and collections", "SQL and database design", "Spring Boot", "REST APIs", "JWT authentication", "Docker and deployment"],
  },
  frontend: {
    label: "Frontend Developer",
    requiredSkills: ["HTML", "CSS", "JavaScript", "Git", "React", "REST API"],
    roadmap: ["HTML and semantic web", "CSS and responsive design", "JavaScript fundamentals", "Git and GitHub", "React", "REST API integration"],
  },
  "full-stack": {
    label: "Full Stack Developer",
    requiredSkills: ["HTML", "CSS", "JavaScript", "React", "Node.js", "Express", "MongoDB", "Git", "REST API"],
    roadmap: ["HTML, CSS, and JavaScript", "Git and GitHub", "React", "Node.js and Express", "MongoDB", "REST APIs and authentication", "Deploy a full-stack project"],
  },
};

const normalise = (value) => value.toLowerCase().replace(/[^a-z0-9]/g, "");

const calculateReadiness = (profile) => {
  const career = careerRoadmaps[profile.targetCareer];
  if (!career) {
    return { score: 0, career: null, breakdown: [], missingSkills: [], roadmap: [], nextAction: "Choose Java Backend, Frontend, or Full Stack as your target career to calculate readiness." };
  }

  const studentSkills = new Set((profile.skills || []).map((skill) => normalise(skill.name)));
  const matchedSkills = career.requiredSkills.filter((skill) => studentSkills.has(normalise(skill)));
  const missingSkills = career.requiredSkills.filter((skill) => !studentSkills.has(normalise(skill)));
  const profileFields = [profile.college, profile.degree, profile.graduationYear, profile.targetCareer];
  const profileScore = Math.round((profileFields.filter(Boolean).length / profileFields.length) * 10);
  const skillScore = Math.round((matchedSkills.length / career.requiredSkills.length) * 35);
  const projectScore = Math.min((profile.projects || []).length, 3) * 7;
  const dsaScore = Math.round((Math.min(profile.dsaProblemsSolved || 0, 100) / 100) * 15);
  const certificationScore = Math.min((profile.certifications || []).length, 2) * 5;
  const githubScore = profile.githubUrl ? 5 : 0;
  const linkedinScore = profile.linkedinUrl ? 5 : 0;
  const score = profileScore + skillScore + projectScore + dsaScore + certificationScore + githubScore + linkedinScore;

  const breakdown = [
    { label: "Profile essentials", score: profileScore, max: 10 },
    { label: "Target-role skills", score: skillScore, max: 35 },
    { label: "Projects", score: projectScore, max: 21 },
    { label: "DSA practice", score: dsaScore, max: 15 },
    { label: "Certifications", score: certificationScore, max: 10 },
    { label: "Professional links", score: githubScore + linkedinScore, max: 10 },
  ];

  const nextAction = missingSkills.length
    ? `Learn ${missingSkills[0]} next to move closer to ${career.label}.`
    : (profile.projects || []).length < 3
      ? "Add another relevant project to strengthen your portfolio."
      : (profile.dsaProblemsSolved || 0) < 100
        ? "Continue DSA practice until you reach 100 solved problems."
        : "Your essentials are strong. Keep refining your projects and prepare for interviews.";

  return { score, career: career.label, breakdown, matchedSkills, missingSkills, roadmap: career.roadmap, nextAction };
};

module.exports = { calculateReadiness, careerRoadmaps };
