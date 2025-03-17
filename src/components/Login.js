import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { jwtDecode } from "jwt-decode"; // Import thư viện giải mã JWT

export default function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response = await fetch("http://192.168.11.183:5280/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });
            console.log(response)
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Đăng nhập thất bại!");
            }

            const decodedToken = jwtDecode(data.token);

            if (decodedToken.role !== "admin") {
                throw new Error("Bạn không có quyền truy cập!");
            }

            localStorage.setItem("authToken", data.token);
            alert("Đăng nhập thành công!");

            window.location.href = "/";
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
            <div className="card p-4 shadow-lg" style={{ width: "400px" }}>
                <h2 className="text-center fw-bold mb-3" style={{ color: "#ff69b4", textShadow: "2px 2px 4px rgba(255, 105, 180, 0.5)" }}>
                    BeautySoft
                </h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3 text-start">
                        <label className="form-label">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="form-control p-2"
                            required
                        />
                    </div>
                    <div className="mb-3 text-start position-relative">
                        <label className="form-label">Password</label>
                        <div className="input-group">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="form-control p-2 border-end-0"
                                required
                            />
                            <span
                                className="input-group-text border border-start-0 text-secondary"
                                style={{ cursor: "pointer", backgroundColor: "#eef5ff" }}
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
                            </span>
                        </div>
                    </div>
                    {error && <p className="text-danger text-sm mb-2">{error}</p>}
                    <button type="submit" className="btn btn-primary w-100">
                        Đăng Nhập
                    </button>
                </form>
            </div>
        </div>
    );
}
