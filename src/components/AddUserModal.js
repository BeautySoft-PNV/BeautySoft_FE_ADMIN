import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import axios from "axios";

export default function AddUserModal({ show, handleClose, refreshUsers }) {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        roleId: "",
    });

    const [roles, setRoles] = useState([]);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const response = await axios.get("http://18.142.0.155:5001/api/role");
                setRoles(response.data);
            } catch (error) {
                console.error("Error getting list of roles", error);
            }
        };

        if (show) {
            fetchRoles();
            setErrors({});
        }
    }, [show]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const handleAddUser = async (e) => {
        e.preventDefault();
        setErrors({});
        const newErrors = {};

        if (!formData.username) {
            newErrors.username = "Username is required!";
        }
        if (!formData.email) {
            newErrors.email = "Email is required!";
        } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email)) {
            newErrors.email = "Email is not in correct format! Example: example@gmail.com";
        }
        if (!formData.password) {
            newErrors.password = "Password is required!";
        } else if (formData.email === formData.password) {
            newErrors.password = "Email and Password cannot be the same!";
        }
        if (!formData.roleId || parseInt(formData.roleId, 10) <= 0) {
            newErrors.roleId = "Role is required and must be greater than 0!";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            await axios.post(
                "http://18.142.0.155:5001/api/auth/register",
                {
                    username: formData.username,
                    email: formData.email,
                    password: formData.password,
                    roleId: parseInt(formData.roleId, 10),
                },
                {
                    headers: { "Content-Type": "application/json" },
                }
            );
            await refreshUsers();
            handleClose();
        } catch (error) {
            if (error.response) {
                const { data } = error.response;
                if (data.errors) {
                    const serverErrors = {};
                    if (data.errors.Email) {
                        serverErrors.email = data.errors.Email[0];
                    }
                    if (data.errors.RoleId) {
                        serverErrors.roleId = data.errors.RoleId[0];
                    }
                    if (data.errors.Password) {
                        serverErrors.password = data.errors.Password[0];
                    }
                    if (data.errors.Username) {
                        serverErrors.username = data.errors.Username[0];
                    }
                    setErrors((prev) => ({ ...prev, ...serverErrors }));
                } else if (data.message === "Account already exists!") {
                    newErrors.email = "Account already exists!";
                    setErrors((prev) => ({ ...prev, ...newErrors }));
                }
            }
        }
    };

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Add Account</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form onSubmit={handleAddUser}>
                    <div className="mb-3">
                        <label className="form-label">Full Name</label>
                        <input
                            type="text"
                            className={`form-control ${errors.username ? "is-invalid" : ""}`}
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                        />
                        {errors.username && <div className="invalid-feedback">{errors.username}</div>}
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Email</label>
                        <input
                            type="email"
                            className={`form-control ${errors.email ? "is-invalid" : ""}`}
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                        />
                        {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            className={`form-control ${errors.password ? "is-invalid" : ""}`}
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                        />
                        {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Roles</label>
                        <select
                            className={`form-control ${errors.roleId ? "is-invalid" : ""}`}
                            name="roleId"
                            value={formData.roleId}
                            onChange={handleChange}
                        >
                            <option value="">-- Select role --</option>
                            {roles.map((role) => (
                                <option key={role.id} value={role.id}>
                                    {role.name}
                                </option>
                            ))}
                        </select>
                        {errors.roleId && <div className="invalid-feedback">{errors.roleId}</div>}
                    </div>
                    <Button variant="success" type="submit">
                        Add
                    </Button>
                </form>
            </Modal.Body>
        </Modal>
    );
}