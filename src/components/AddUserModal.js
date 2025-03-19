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
                const response = await axios.get("http://192.168.31.183:5280/api/role");
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

        try {
            await axios.post(
                "http://192.168.31.183:5280/api/auth/register",
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

            alert("Account added successfully!");
            refreshUsers();
            handleClose();
        } catch (error) {
            if (error.response) {
                const { data } = error.response;
                if (data.message === "Account already exists!") {
                    setErrors((prev) => ({ ...prev, email: "Account already exists!" }));
                } else if (data.errors && data.errors.Password) {
                    setErrors((prev) => ({ ...prev, password: data.errors.Password[0] }));
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
                            className="form-control"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Email</label>
                        <input
                            type="email"
                            className={`form-control ${errors.email ? "is-invalid" : ""}`}
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
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
                            required
                        />
                        {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Roles</label>
                        <select
                            className="form-control"
                            name="roleId"
                            value={formData.roleId}
                            onChange={handleChange}
                            required
                        >
                            <option value="">-- Select role --</option>
                            {roles.map((role) => (
                                <option key={role.id} value={role.id}>
                                    {role.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <Button variant="success" type="submit">
                        Add
                    </Button>
                </form>
            </Modal.Body>
        </Modal>
    );
}