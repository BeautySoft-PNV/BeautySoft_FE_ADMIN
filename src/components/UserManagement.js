import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import EditUserModal from "./EditUserModal"; 
import AddUserModal from "./AddUserModal";
import { useNavigate } from "react-router-dom";
export default function UserManagement() {
    const [users, setUsers] = useState([]);
    const [editingUser, setEditingUser] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const navigate = useNavigate();
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
            const response = await axios.get("/api/users/all", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setUsers(response.data);
        } catch (error) {
            if (error.response && error.response.status === 401) {
                localStorage.removeItem("authToken");
                navigate("/login");
            }
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
            await axios.put(`/api/users/me/${formData.id}`, formDataToSend, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data"
                },
            });
            await fetchUsers();
            setShowModal(false);
        } catch (error) {
            console.error("Error updating user", error);
        }
    };

    const handleBlockUser = async (user) => {
        const newStatus = !user.isBlocked;
        const action = newStatus ? "block" : "unblock";

        try {
            const token = localStorage.getItem("authToken");
            const response = await axios.put(
                `/api/users/${action}/${user.id}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.status === 200) {

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
            <h2
                className="text-center mb-4"
                style={{
                    color: "#ED1E51",
                    fontWeight: "bold",
                    textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)"
                }}
            >
                User Management
            </h2>


            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px",  }}>
                <input
                    type="text"
                    className="form-control"
                    placeholder="Search by email..."
                    value={searchTerm}
                    onChange={handleSearch}
                    style={{ width: "30%" }}
                />
                <button className="btn" style={{background:'#ED1E51', color:"white"}} onClick={() => setShowAddModal(true)}>
                    Add Account
                </button>
            </div>
            <table className="table table-bordered text-center">
                <thead >
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Avatar</th>
                    <th>Act</th>
                </tr>
                </thead>
                <tbody>
                {users.length === 0 ? (
                    <tr>
                        <td
                            colSpan="7"
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
                            There are no payments yet
                        </td>
                    </tr>
                ) : currentUsers.length === 0 ? (
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
                <td style={{ verticalAlign: "middle" }}>{user.id}</td>
                <td style={{ verticalAlign: "middle" }}>{user.name}</td>
                <td style={{ verticalAlign: "middle" }}>{user.email}</td>
                <td style={{ width: "50px", height: "50px", verticalAlign: "middle" }}>
                    <img
                        src={user.avatar || "https://via.placeholder.com/50"}
                        alt="Avatar"
                        width="50"
                        height="50"
                        className="rounded-circle"
                        style={{ objectFit: "cover" }}
                    />
                </td>
                <td style={{ verticalAlign: "middle" }}>
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

            {Math.ceil(filteredUsers.length / usersPerPage) > 1 && (
                <div className="d-flex justify-content-center mt-4">
                    <button
                        className="btn me-2"
                        onClick={prevPage}
                        disabled={currentPage === 1}
                        style={{
                            background: "#ED1E51",
                            borderColor: "#ED1E51",
                            color: "white"
                        }}
                    >
                        Previous
                    </button>
                    {pageNumbers.map((number) => (
                        <button
                            key={number}
                            className="btn me-2"
                            onClick={() => paginate(number)}
                            style={{
                                background: "#FFBBC0",
                                borderColor: "#FFBBC0",
                                color: "black"
                            }}
                        >
                            {number}
                        </button>
                    ))}
                    <button
                        className="btn"
                        onClick={nextPage}
                        disabled={currentPage === Math.ceil(filteredUsers.length / usersPerPage)}
                        style={{
                            background: "#ED1E51",
                            borderColor: "#ED1E51",
                            color: "white"
                        }}
                    >
                        Next
                    </button>
                </div>
            )}



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