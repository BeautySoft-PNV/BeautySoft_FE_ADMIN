import React from "react";
import { Link, useLocation, useNavigate  } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Sidebar() {
    const location = useLocation();
    const navigate = useNavigate()

    const handleLogout = () => {
        localStorage.removeItem("authToken");
        navigate("/login");
        window.location.reload();
    };

    return (
        <div className="d-flex flex-column p-4 bg-dark text-white vh-100 position-fixed">
            <h4 className="text-center fw-bold mb-4">Admin Panel</h4>
            <hr className="border-secondary w-100 my-3" style={{ borderWidth: "3px" }} />
            <ul className="nav nav-pills flex-column">
                <li className="nav-item">
                    <Link
                        to="/users"
                        className={`nav-link fw-semibold d-flex align-items-center gap-2 px-3 rounded hover-effect ${
                            location.pathname === "/users" ? "active" : "text-white"
                        }`}
                    >
                        <span className="fs-5">👥</span>
                        <span>User Management</span>
                    </Link>
                </li>
                <hr className="border-secondary w-100 my-3" style={{ borderWidth: "3px" }} />
                <li className="nav-item">
                    <Link
                        to="/payment"
                        className={`nav-link fw-semibold d-flex align-items-center gap-2 px-3 rounded hover-effect ${
                            location.pathname === "/payment" ? "active" : "text-white"
                        }`}
                    >
                        <span className="fs-5" style={{marginBottom:"8px"}}>💳</span>
                        <span>Payment Management</span>
                    </Link>
                </li>
                <hr className="border-secondary w-100 my-3" style={{ borderWidth: "3px" }} />
                <li className="nav-item">
                    <Link
                        to="/chart"
                        className={`nav-link fw-semibold d-flex align-items-center gap-2 px-3 rounded hover-effect ${
                            location.pathname === "/chart" ? "active" : "text-white"
                        }`}
                    >
                        <span className="fs-5">📊</span>
                        <span>Chart</span>
                    </Link>
                </li>
            </ul>

            <button
                className="btn btn-danger mt-auto  fw-bold"
                onClick={handleLogout}
                style={{height:"50px", textAlign:"center"}}>
                🚪 Logout
            </button>
        </div>
    );
}
