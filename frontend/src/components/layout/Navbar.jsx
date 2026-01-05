import { Link, useNavigate, useLocation } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:8001/api/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.error("Logout error:", error);
    }

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/auth");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <h2>Book Management System</h2>
      </div>
      
      <ul className="navbar-menu">
        <li>
          <Link to="/home" className={isActive("/home") ? "active" : ""}>
            Home
          </Link>
        </li>
        <li>
          <Link to="/manage-books" className={isActive("/manage-books") ? "active" : ""}>
            Manage Books
          </Link>
        </li>
        <li>
          <Link to="/borrowed-books" className={isActive("/borrowed-books") ? "active" : ""}>
            My Borrowed Books
          </Link>
        </li>
      </ul>

      <div className="navbar-user">
        <span className="user-name">Welcome, {user.name}</span>
        <button onClick={handleLogout} className="btn-logout">
          Logout
        </button>
      </div>
    </nav>
  );
}