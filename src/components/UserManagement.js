import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import EditUserModal from "./EditUserModal"; 
import AddUserModal from "./AddUserModal";

export default function UserManagement() {
    const [users, setUsers] = useState([]);
    const [editingUser, setEditingUser] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false); 
    const [formData, setFormData] = useState({
        id: "",
        name: "",
        email: "",
        newPassword: "",
        avatar: "",
        roleId: "",
        imageFile: null,
    });

    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage] = useState(10);

    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchUsers();
    }, []);


    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem("authToken");
            const response = await axios.get("http://192.168.31.183:5280/api/users/all", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setUsers(response.data);
        } catch (error) {
            console.error("Error while getting user list", error);
        }
    };

    const handleEdit = (user) => {
        if (!user || !user.id) {
            console.error("Invalid User ID:", user);
            return;
        }
        setEditingUser(user.id);
        setFormData({
            id: user.id,
            name: user.name || "",
            email: user.email || "",
            avatar: user.avatar || "",
            roleId: user.roleId || "",
            newPassword: "",
            imageFile: null,
        });
        setShowModal(true);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        setFormData((prev) => ({ ...prev, imageFile: e.target.files[0] }));
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        const formDataToSend = new FormData();
        formDataToSend.append("id", formData.id);
        formDataToSend.append("name", formData.name);
        formDataToSend.append("email", formData.email);
        formDataToSend.append("newPassword", formData.newPassword);
        formDataToSend.append("avatar", formData.avatar);
        formDataToSend.append("roleId", formData.roleId);
        if (formData.imageFile) {
            formDataToSend.append("imageFile", formData.imageFile);
        }

        try {
            const token = localStorage.getItem("authToken");
            await axios.put(`http://192.168.31.183:5280/api/users/me/${formData.id}`, formDataToSend, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data"
                },
            });
            alert("Update successful!");
            await fetchUsers();
            setShowModal(false);
        } catch (error) {
            console.error("Error updating user", error);
        }
    };

    const handleBlockUser = async (user) => {
        const newStatus = !user.isBlocked;
        const action = newStatus ? "block" : "unblock";
        const confirmMessage = newStatus
            ? `Are you sure you want to LOCK the user? ${user.name}?`
            : `Are you sure you want to UNLOCK the user? ${user.name}?`;

        if (!window.confirm(confirmMessage)) return;

        try {
            const token = localStorage.getItem("authToken");
            const response = await axios.put(
                `http://192.168.31.183:5280/api/users/${action}/${user.id}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.status === 200) {
                alert(`User ${user.name} has been ${newStatus ? "LOCK" : "UNLOCK"}!`);

                setUsers((prevUsers) =>
                    prevUsers.map((u) =>
                        u.id === user.id ? { ...u, isBlocked: newStatus } : u
                    )
                );
            }
        } catch (error) {
            console.error("Error updating user status", error);
            alert("An error occurred, please try again.");
        }
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const filteredUsers = users.filter((user) =>
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const nextPage = () => {
        if (currentPage < Math.ceil(filteredUsers.length / usersPerPage)) {
            setCurrentPage(currentPage + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(filteredUsers.length / usersPerPage); i++) {
        pageNumbers.push(i);
    }

    return (
        <div className="container mt-4" style={{ marginLeft: "350px", width: "10000px" }}>
            <h2 className="text-center mb-4">User Management</h2>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px", marginTop: "35px" }}>
                <input
                    type="text"
                    className="form-control"
                    placeholder="Search by name..."
                    value={searchTerm}
                    onChange={handleSearch}
                    style={{ width: "30%" }}
                />
                <button className="btn btn-success" onClick={() => setShowAddModal(true)}>
                    Add Account
                </button>
            </div>
            <table className="table table-bordered text-center">
                <thead className="table-dark">
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Avatar</th>
                    <th>Act</th>
                </tr>
                </thead>
                <tbody>
    {currentUsers.length === 0 ? (
    <tr>
        <td 
            colSpan="5" 
            className="text-center" 
            style={{
                color: '#dc3545', 
                fontSize: '1.5rem', 
                padding: '20px', 
                backgroundColor: '#f8d7da', 
                border: '1px solid #f5c6cb', 
                borderRadius: '5px', 
                fontWeight: 'bold', 
                textAlign: 'center',
            }}
        >
        No search results
    </td>
</tr>
    ) : (
        currentUsers.map((user) => (
            <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td style={{ width: "50px", height: "50px" }}>
                    <img
                        src={user.avatar || "https://via.placeholder.com/50"}
                        alt="Avatar"
                        width="50"
                        height="50"
                        className="rounded-circle"
                    />
                </td>
                <td>
                    <button className="btn btn-primary btn-sm me-2" onClick={() => handleEdit(user)}>
                        Edit
                    </button>
                    <button
                        className={`btn ${user.isBlocked ? "btn-success" : "btn-danger"} btn-sm me-2`}
                        onClick={() => handleBlockUser(user)}
                    >
                        {user.isBlocked ? "Unlock" : "Lock"}
                    </button>
                </td>
            </tr>
        ))
    )}
</tbody>

            </table>

            <div className="d-flex justify-content-center mt-4">
                <button
                    className="btn btn-secondary me-2"
                    onClick={prevPage}
                    disabled={currentPage === 1}
                >
                    Previous page
                </button>
                {pageNumbers.map((number) => (
                    <button
                        key={number}
                        className={`btn ${currentPage === number ? "btn-primary" : "btn-secondary"} me-2`}
                        onClick={() => paginate(number)}
                    >
                        {number}
                    </button>
                ))}
                <button
                    className="btn btn-secondary"
                    onClick={nextPage}
                    disabled={currentPage === Math.ceil(filteredUsers.length / usersPerPage)}
                >
                    Next page
                </button>
            </div>

            <EditUserModal
                show={showModal}
                handleClose={() => setShowModal(false)}
                formData={formData}
                handleChange={handleChange}
                handleFileChange={handleFileChange}
                handleUpdate={handleUpdate}
            />

            <AddUserModal
                show={showAddModal}
                handleClose={() => setShowAddModal(false)}
                refreshUsers={fetchUsers}
            />
        </div>
    );
}