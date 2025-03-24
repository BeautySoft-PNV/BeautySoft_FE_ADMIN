import React, { useState, useEffect } from "react";

export default function Payment() {
    const [payments, setPayments] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
   const [users, setUsers] = useState([]);
    useEffect(() => {
        const token = localStorage.getItem("authToken");
        if (!token) {
            console.error("Token not found! User is not logged in.");
            return;
        }

        fetch("http://192.168.31.183:5280/api/payment/all", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Error: ${response.status}`);
                }
                return response.json();
            })
            .then(data => setPayments(data))
            .catch(error => console.error("Error while retrieving payment list:", error));
    }, []);

    const [usersPerPage] = useState(10);
    const filteredPayments = payments.filter(payment =>
        payment.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.typeStorage?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const filteredUsers = users.filter((user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
  
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredPayments.slice(indexOfFirstItem, indexOfLastItem);
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
    const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);

    return (
        <div className="container mt-4" style={{ marginLeft: "350px", width: "10000px" }}>
            <h2 className="text-center">Payment Management</h2>
            <input
                type="text"
                placeholder="Search..."
                className="form-control mb-3"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ width: "30%" }}
            />
            <table className="table table-bordered text-center">
                <thead>
                <tr>
                    <th  style={{ textAlign: "center", verticalAlign: "middle" }}>ID</th>
                    <th>User Name</th>
                    <th>Email</th>
                    <th>Storage Name</th>
                    <th>Price</th>
                    <th>Description</th>
                    <th>Date Start</th>
                </tr>
                </thead>
                <tbody>
    {currentItems.length === 0 ? (
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
                No search results
            </td>
        </tr>
    ) : (
        currentItems.map(payment => (
            <tr key={payment.id}>
                <td style={{textAlign: "center", verticalAlign: "middle", height: "50px" }}>{payment.id}</td>
                <td>{payment.user?.name || "N/A"}</td>
                <td>{payment.user?.email || "N/A"}</td>
                <td>{payment.typeStorage?.name || "N/A"}</td>
                <td>{payment.typeStorage?.price ? payment.typeStorage.price.toLocaleString() : "N/A"}</td>
                <td>{payment.typeStorage?.description || "N/A"}</td>
                <td>{new Date(payment.dateTimeStart).toLocaleDateString()}</td>
            </tr>
        ))
    )}
</tbody>

            </table>
            <div className="pagination d-flex justify-content-center mt-3">
                <button
                    className="btn btn-primary mx-1"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                >
                    Previous
                </button>
                {[...Array(totalPages)].map((_, index) => (
                    <button
                        key={index + 1}
                        className={`btn mx-1 ${currentPage === index + 1 ? "btn-secondary" : "btn-light"}`}
                        onClick={() => setCurrentPage(index + 1)}
                    >
                        {index + 1}
                    </button>
                ))}
                <button
                    className="btn btn-primary mx-1"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                >
                    Next
                </button>
            </div>
        </div>
    );
}