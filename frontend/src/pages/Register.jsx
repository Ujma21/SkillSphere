import { useState } from "react";
import useAuth from "../context/useAuth";

const Register = () => {
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    try {
      const data = await register(formData);

      setMessage(data.message || "Registration successful!");

      setFormData({
        name: "",
        email: "",
        password: "",
        role: "student",
      });
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
    }
  };

  return (
    <div>
      <h1>Create SkillSphere Account</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your name"
            required
          />
        </div>

        <div>
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
          />
        </div>

        <div>
          <label>Account type</label>
          <select name="role" value={formData.role} onChange={handleChange}>
            <option value="student">Student</option>
            <option value="recruiter">Recruiter</option>
          </select>
        </div>

        <div>
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            required
          />
        </div>

        <button type="submit">
          Register
        </button>
      </form>

      {message && <p>{message}</p>}

      {error && <p>{error}</p>}
    </div>
  );
};

export default Register;
