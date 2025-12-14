import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../api";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
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
      const response = await loginUser(form);
      console.log("Login response:", response.data);

      // ✅ STORE TOKEN
      localStorage.setItem("token", response.data.token);

      // ✅ STORE ROLE (CRITICAL FIX)
      const user = response.data.user;
      const role = user.is_admin ? "admin" : "user";
      localStorage.setItem("role", role);

      // ✅ REDIRECT BASED ON ROLE
      if (role === "admin") {
        window.location.href = "/admin";
      } else {
        window.location.href = "/dashboard";
      }
    } catch (err: any) {
      console.error("Login error:", err);
      setError(
        err.response?.data?.error ||
          "Login failed. Please check your credentials."
      );
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card auth-card">
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <div style={{ fontSize: "64px", marginBottom: "16px" }}>🍬</div>
          <h2>Welcome Back!</h2>
          <p style={{ color: "#718096", marginTop: "10px" }}>
            Login to explore our sweet collection
          </p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
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
            autoComplete="current-password"
          />
          <button type="submit" disabled={loading}>
            {loading ? "🔄 Logging in..." : "🚀 Login"}
          </button>
        </form>

        <div
          style={{ textAlign: "center", marginTop: "24px", color: "#718096" }}
        >
          Don't have an account?{" "}
          <Link
            to="/register"
            style={{
              color: "#667eea",
              textDecoration: "none",
              fontWeight: "600",
            }}
          >
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
}
