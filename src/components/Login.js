import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { jwtDecode } from "jwt-decode";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const validatePassword = (password) => {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{10,}$/;
        return regex.test(password);
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        if (!email.trim()) {
            setError("Email cannot be empty!");
            return;
        }
        if (!password.trim()) {
            setError("Password cannot be empty!");
            return;
        }
        if (!validatePassword(password)) {
            setError("Wrong password!");
            return;
        }
        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({ email, password }),
            });
        
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message ||"Login failed! You have not registered an account." );
            }

            const decodedToken = jwtDecode(data.token);

            if (decodedToken.role !== "ADMIN") {
                throw new Error("You do not have access!");
            }

            localStorage.setItem("authToken", data.token);

            window.location.href = "/users";
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div
        className="d-flex justify-content-center align-items-center min-vh-100"
        style={{ backgroundColor: "white", fontFamily: "'Playfair Display', sans-serif" }}
      >
        <div
          className="d-flex align-items-center"
          style={{ boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.5)", border: "10px solid #ED1E51", backgroundColor: "white", borderRadius: "10px",width: "50%",}}
        >
          <div className="m-5 d-flex justify-content-center align-items-center w-50">
            <div className="card p-4" style={{ width: "400px",borderRadius: "10px",border: "1px",backgroundColor: "white"}}
            >
              <h1 className="text-center fw-bold mb-3" style={{color: "#ED1E51",  fontFamily: "'Playfair Display', sans-serif",}}>
                Log in
              </h1>
              <p
                className="text-center"
                style={{
                  color: "#ED1E51",
                  fontSize: "18px",
                  fontFamily: "'Playfair Display', sans-serif",
                }}
              >
                Login with your admin credentials.
              </p>
              <form onSubmit={handleSubmit}>
                <div className="mb-3 text-start">
                  <label
                    className="form-label fw-bold"
                    style={{
                      fontSize: "20px",
                      fontFamily: "'Playfair Display', sans-serif",
                    }}
                  >
                    Your e-mail <span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-control p-3 border"
                    style={{
                      borderColor: "#ED1E51",
                      borderRadius: "5px",
                      fontSize: "20px",
                      color: "black",
                      fontFamily: "'Playfair Display', sans-serif",
                    }}
                    placeholder="admin@gmail.com..."
                    required
                  />
                </div>
                <div className="mb-3 text-start position-relative">
                  <label
                    className="form-label fw-bold"
                    style={{
                      fontSize: "20px",
                      fontFamily: "'Playfair Display', sans-serif",
                    }}
                  >
                    Password <span style={{ color: "red" }}>*</span>
                  </label>
                  <div className="input-group">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="form-control p-3 border-end-0"
                      style={{
                        borderRadius: "5px",
                        fontSize: "20px",
                        color: "black",
                        fontFamily: "'Playfair Display', sans-serif",
                      }}
                      placeholder="********"
                      required
                    />
                    <span
                      className="input-group-text border border-start-0 text-secondary"
                      style={{
                        cursor: "pointer",
                        backgroundColor: "#FFBBC0",
                        fontFamily: "'Playfair Display', sans-serif",
                      }}
                      onClick={() => setShowPassword(!showPassword)}
                    >
                     <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"} text-black fw-bold`}></i>
                    </span>
                  </div>
                </div>
                {error && <p className="text-danger text-sm mb-3 fw-bold">{error}</p>}
                <button
                  type="submit"
                  className="btn w-100 p-3"
                  style={{backgroundColor: "#ED1E51",color: "white",fontSize: "20px",fontWeight: "bold",borderRadius: "5px",fontFamily: "'Playfair Display', sans-serif",
                  }}
                >
                  Log In
                </button>
              </form>
            </div>
          </div>
          <div className="w-50  justify-content-center align-items-center m-4">
            <img
              src="/logoBeautySoft.png"
              alt="Logo BeautySoft"
              style={{ maxWidth: "80%", borderRadius: "10px", marginLeft: "40px" }}
            />
            <p
                className="text-center mt-3"
                style={{ fontSize: "18px", fontFamily: "'Playfair Display', sans-serif" }}
              >
                Don't have an account yet?
              </p>
              <p
                className="text-center"
                style={{fontSize: "18px", fontFamily: "'Playfair Display', sans-serif", color: "#ED1E51",}}
              >
                Contact us at Loan@gmail.com and We will take care of everything!!
              </p>
          </div>
        </div>
      </div>
      
    );
}
