import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

export default function EditUserModal({ show, handleClose, formData, handleChange, handleFileChange, handleUpdate }) {
    const [roles, setRoles] = useState([]);

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const response = await axios.get("/api/role");
                setRoles(response.data);
            } catch (error) {
                console.error("Error getting list of roles", error);
            }
        };

        if (show) {
            fetchRoles();
        }
    }, [show]);

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Edit users</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form onSubmit={handleUpdate}>
                    <p>Editing user ID:{formData.id}</p>
                    <div className="mb-3">
                        <label className="form-label">Name</label>
                        <input type="text" className="form-control" name="name" value={formData.name} onChange={handleChange} required />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Email</label>
                        <input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} required />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">New password (if you want to change)</label>
                        <input type="password" className="form-control" name="newPassword" value={formData.newPassword} onChange={handleChange} />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Upload new Avatar</label>
                        <input type="file" className="form-control" name="imageFile" onChange={handleFileChange} />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Role</label>
                        <select className="form-control" name="roleId" value={formData.roleId} onChange={handleChange} required>
                            <option value="">Select role</option>
                            {roles.map((role) => (
                                <option key={role.id} value={role.id}>{role.name}</option>
                            ))}
                        </select>
                    </div>
                    <Button variant="success" type="submit" className="me-2">Save changes</Button>
                    <Button variant="secondary" onClick={handleClose}>Cancel</Button>
                </form>
            </Modal.Body>
        </Modal>
    );
}
