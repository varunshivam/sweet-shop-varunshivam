import { Routes, Route, Navigate, Link } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";
import Cart from "./pages/Cart";
import { getRole, logout } from "./utils";

export default function App() {
  const token = localStorage.getItem("token");
  const role = getRole();

  return (
    <>
      <div className="nav">
        <b>🍬 Sweet Shop</b>
        <div>
          {!token && <Link to="/login">Login</Link>}
          {!token && <Link to="/register">Register</Link>}

          {token && <Link to="/dashboard">Home</Link>}
          {token && <Link to="/cart">My Cart</Link>}
          {token && role === "admin" && <Link to="/admin">Admin</Link>}

          {token && (
            <button className="secondary" onClick={logout}>
              Logout
            </button>
          )}
        </div>
      </div>

      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/dashboard"
          element={token ? <Dashboard /> : <Navigate to="/login" />}
        />

        <Route
          path="/cart"
          element={token ? <Cart /> : <Navigate to="/login" />}
        />

        <Route
          path="/admin"
          element={
            token && role === "admin" ? <Admin /> : <Navigate to="/dashboard" />
          }
        />
      </Routes>
    </>
  );
}
