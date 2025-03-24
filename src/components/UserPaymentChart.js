import React, { useEffect, useState } from "react";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import axios from "axios";

export default function Dashboard() {
    const [users, setUsers] = useState([]);
    const [payments, setPayments] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem("authToken");
        if (!token) {
            console.error("Token not found! User is not logged in.");
            return;
        }

        const headers = {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        };

        Promise.all([
            axios.get("/api/users/all", { headers }),
            axios.get("/api/payment/all", { headers }),
        ])
            .then(([usersResponse, paymentsResponse]) => {
                setUsers(usersResponse.data);
                setPayments(paymentsResponse.data);
            })
            .catch((error) => {
                console.error("Error loading data:", error.response ? error.response.data : error);
            });
    }, []);

    const totalUsers = users.length;
    const uniqueBuyers = new Set(payments.map(p => p.userId)).size;
    const totalRevenue = payments.reduce((sum, p) => sum + (p.typeStorage?.price || 0), 0);

    const userData = [{ name: "Users", count: totalUsers }];

    const paymentData = [
        { name: "Purchased", value: uniqueBuyers },
        { name: "Not Purchased", value: totalUsers - uniqueBuyers }
    ];

    const COLORS = ["#0088FE", "#FF8042"];

    return (
        <div className="container mt-4" style={{ marginLeft: "350px", width: "10000px" }}>
            <h2 className="text-center">User and Payment Statistics</h2>

            <div className="row mt-5">
                <div className="col-md-6">
                    <h4 className="text-center">Total Users</h4>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={userData}>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="count" fill="#82ca9d" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="col-md-6">
                    <h4 className="text-center">Purchase Ratio & Total Revenue</h4>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie data={paymentData} cx="50%" cy="50%" outerRadius={100} fill="#8884d8" dataKey="value" label>
                                {paymentData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                    <h5 className="text-center mt-3">Total Revenue: {totalRevenue.toLocaleString()} VND</h5>
                </div>
            </div>
        </div>
    );
}