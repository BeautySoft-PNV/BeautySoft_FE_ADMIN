import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

export default function EditUserModal({ show, handleClose, formData, handleChange, handleFileChange, handleUpdate }) {
    const [roles, setRoles] = useState([]);

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const response = await axios.get("http://192.168.11.183:5280/api/role");
                setRoles(response.data);
            } catch (error) {
                console.error("Lỗi khi lấy danh sách roles", error);
            }
        };

        if (show) {
            fetchRoles();
        }
    }, [show]);

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Chỉnh sửa người dùng</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form onSubmit={handleUpdate}>
                    <p>Đang chỉnh sửa user ID: {formData.id}</p>
                    <div className="mb-3">
                        <label className="form-label">Tên</label>
                        <input type="text" className="form-control" name="name" value={formData.name} onChange={handleChange} required />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Email</label>
                        <input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} required />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Mật khẩu mới (nếu muốn thay đổi)</label>
                        <input type="password" className="form-control" name="newPassword" value={formData.newPassword} onChange={handleChange} />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Tải lên Avatar mới</label>
                        <input type="file" className="form-control" name="imageFile" onChange={handleFileChange} />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Vai trò (Role)</label>
                        <select className="form-control" name="roleId" value={formData.roleId} onChange={handleChange} required>
                            <option value="">Chọn vai trò</option>
                            {roles.map((role) => (
                                <option key={role.id} value={role.id}>{role.name}</option>
                            ))}
                        </select>
                    </div>
                    <Button variant="success" type="submit" className="me-2">Lưu thay đổi</Button>
                    <Button variant="secondary" onClick={handleClose}>Hủy</Button>
                </form>
            </Modal.Body>
        </Modal>
    );
}
