import { useState, useMemo } from 'react';
//Copied from Ai
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, format, parseISO, isWithinInterval, subDays } from 'date-fns';

//Note: After pulling the repo, run "npm install" to install all dependencies :D

const Dashboard = ({ transactions }) => {
    return (
        <div style={{ padding: '20px', backgroundColor: '#000000ff', border: '5px solid red', margin: '20px' }}>
            <h2>Test View :D</h2>

            <div>
                <strong>Count: </strong> {transactions.length} items
            </div>

            <table border="1" style={{ width: '100%', marginBottom: '20px', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ backgroundColor: '#010000ff' }}>
                        <th>Index</th>
                        <th>Date</th>
                        <th>Item Name</th>
                        <th>Category</th>
                        <th>Qty</th>
                        <th>Total Price</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.map((t, index) => (
                        <tr key={index}>
                            <td>{index}</td>
                            <td>{t.date}</td>
                            <td>{t.itemName}</td>
                            <td>{t.category}</td>
                            <td>{t.quantity}</td>
                            <td>{t.totalPrice}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Dashboard;