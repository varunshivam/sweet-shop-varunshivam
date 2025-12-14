import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../api";

export default function Register() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await registerUser(form);
      // Redirect to login after successful registration
      window.location.href = "/login";
    } catch (err: any) {
      console.error("Registration error:", err);
      setError(
        err.response?.data?.error || "Registration failed. Please try again."
      );
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card auth-card">
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <div style={{ fontSize: "64px", marginBottom: "16px" }}>✨</div>
          <h2>Join Sweet Paradise</h2>
          <p style={{ color: "#718096", marginTop: "10px" }}>
            Create an account to start shopping
          </p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="👤 Username"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            required
            autoComplete="username"
          />
          <input
            type="email"
            placeholder="📧 Email Address"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
            autoComplete="email"
          />
          <input
            type="password"
            placeholder="🔒 Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
            minLength={6}
            autoComplete="new-password"
          />
          <button type="submit" disabled={loading}>
            {loading ? "🔄 Creating Account..." : "🎉 Create Account"}
          </button>
        </form>

        <div
          style={{ textAlign: "center", marginTop: "24px", color: "#718096" }}
        >
          Already have an account?{" "}
          <Link
            to="/login"
            style={{
              color: "#667eea",
              textDecoration: "none",
              fontWeight: "600",
              transition: "color 0.3s ease",
            }}
          >
            Login here
          </Link>
        </div>
      </div>
    </div>
  );
}
