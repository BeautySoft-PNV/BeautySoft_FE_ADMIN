import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginForm from "./components/Login";
import Sidebar from "./components/Sidebar";
import UserManagement from "./components/UserManagement";
import Payment from "./components/Payment";
import UserPaymentChart from "./components/UserPaymentChart";
import "./App.css"; // Thêm file CSS để chỉnh layout

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true); // Thêm state loading

    useEffect(() => {
        const token = localStorage.getItem("authToken");
        setIsAuthenticated(!!token); // Kiểm tra token
        setLoading(false); // Đánh dấu đã kiểm tra xong
    }, []);

    const handleLoginSuccess = () => {
        setIsAuthenticated(true);
    };

    // 🔄 Nếu đang kiểm tra token, hiển thị loading
    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <Router>
            <Routes>
                {!isAuthenticated ? (
                    <>
                        <Route path="/login" element={<LoginForm onLoginSuccess={handleLoginSuccess} />} />
                        <Route path="*" element={<Navigate to="/login" />} />
                    </>
                ) : (
                    <>
                        <Route path="/" element={<Navigate to="/users" />} />
                        <Route
                            path="*"
                            element={
                                <div className="app-container">
                                    <Sidebar />
                                    <div className="content-container">
                                        <Routes>
                                            <Route path="/users" element={<UserManagement />} />
                                            <Route path="/payment" element={<Payment />} />
                                            <Route path="/chart" element={<UserPaymentChart />} />
                                        </Routes>
                                    </div>
                                </div>
                            }
                        />
                    </>
                )}
            </Routes>
        </Router>
    );
}

export default App;
