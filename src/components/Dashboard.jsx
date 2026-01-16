import React, { useState, useMemo } from 'react';
import { TransactionService } from '../services/storage.js';
import '../components.css';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from 'recharts';
import {
    startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth,
    format, parseISO, isWithinInterval, subDays
} from 'date-fns';

const Dashboard = () => {
    const [rawTransactions] = useState(TransactionService.getTransactions());
    const [statsPeriod, setStatsPeriod] = useState('monthly');
    const [chartPeriod, setChartPeriod] = useState('monthly');

    const PIE_COLORS = ['#000000', '#444444', '#888888', '#aaaaaa', '#cccccc', '#eeeeee'];

    const transactions = useMemo(() => {
        return rawTransactions.sort((a, b) => new Date(a.date) - new Date(b.date));
    }, [rawTransactions]);

    const totalSalesAllTime = useMemo(() => {
        return transactions.reduce((sum, t) => sum + t.totalPrice, 0);
    }, [transactions]);

    const currentPeriodSales = useMemo(() => {
        const now = new Date();
        let start, end;

        if (statsPeriod === 'daily') {
            start = startOfDay(now);
            end = endOfDay(now);
        } else if (statsPeriod === 'weekly') {
            start = startOfWeek(now, { weekStartsOn: 1 });
            end = endOfWeek(now, { weekStartsOn: 1 });
        } else { // monthly
            start = startOfMonth(now);
            end = endOfMonth(now);
        }

        return transactions.filter(t => {
            const d = parseISO(t.date);
            return isWithinInterval(d, { start, end });
        }).reduce((sum, t) => sum + t.totalPrice, 0);
    }, [transactions, statsPeriod]);

    const topItems = useMemo(() => {
        const map = {};
        transactions.forEach(t => {
            if (!map[t.itemName]) map[t.itemName] = 0;
            map[t.itemName] += t.quantity;
        });

        return Object.entries(map)
            .map(([name, qty]) => ({ name, qty }))
            .sort((a, b) => b.qty - a.qty)
            .slice(0, 5);
    }, [transactions]);

    const lineChartData = useMemo(() => {
        const dataMap = {};
        const now = new Date();
        const daysToLookBack = chartPeriod === 'monthly' ? 365 : 30;
        const cutoff = subDays(now, daysToLookBack);

        // 1. Generate all expected keys and initialize with 0 in chronological order
        for (let i = daysToLookBack; i >= 0; i--) {
            const date = subDays(now, i);
            const key = chartPeriod === 'monthly'
                ? format(date, 'MMM yyyy')
                : format(date, 'MMM dd');
            if (!dataMap[key]) dataMap[key] = 0;
        }

        // 2. Aggregate actual sales
        transactions.forEach(t => {
            const tDate = parseISO(t.date);
            if (tDate >= cutoff) {
                const key = chartPeriod === 'monthly'
                    ? format(tDate, 'MMM yyyy')
                    : format(tDate, 'MMM dd');
                if (Object.prototype.hasOwnProperty.call(dataMap, key)) {
                    dataMap[key] += t.totalPrice;
                }
            }
        });

        // 3. Convert to array (Object.entries maintains insertion order, which is chronological here)
        return Object.entries(dataMap).map(([name, value]) => ({ name, value }));
    }, [transactions, chartPeriod]);

    const pieChartData = useMemo(() => {
        const map = {};
        transactions.forEach(t => {
            if (!map[t.category]) map[t.category] = 0;
            map[t.category] += t.totalPrice;
        });
        return Object.entries(map).map(([name, value]) => ({ name, value }));
    }, [transactions]);

    return (
        <div className="dashboard-container">
            {/* Header */}
            <div className="dashboard-header">
                <h2 className="dashboard-header-title">Dashboard</h2>

                <div className="dashboard-sales-stats-container">
                    <span className="dashboard-sales-stats-label">Sales Stats:</span>
                    <div className="dashboard-sales-stats-buttons">
                        {['daily', 'weekly', 'monthly'].map(p => (
                            <button
                                key={p}
                                onClick={() => setStatsPeriod(p)}
                                className={`btn ${statsPeriod === p ? 'dashboard-period-button-active' : 'dashboard-period-button'}`}
                            >
                                {p}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="dashboard-stats">
                <div className="card stat-card">
                    <h3 className="dashboard-stat-title">Total Sales</h3>
                    <p className="dashboard-stat-value">{totalSalesAllTime.toLocaleString()}</p>
                </div>
                <div className="card stat-card">
                    <h3 className="dashboard-stat-title">Sales ({statsPeriod})</h3>
                    <p className="dashboard-stat-value">{currentPeriodSales.toLocaleString()}</p>
                </div>
                <div className="card stat-card">
                    <h3 className="dashboard-stat-title">Transactions</h3>
                    <p className="dashboard-stat-value">{transactions.length}</p>
                </div>
            </div>

            {/* Main Charts Area */}
            <div className="dashboard-main">

                {/* Left Column: Line Chart */}
                <div className="card chart-column-left">
                    <div className="dashboard-chart-header">
                        <h3 className="dashboard-chart-title">Sales Trend</h3>
                        <div>
                            {['daily', 'monthly'].map(p => (
                                <button
                                    key={p}
                                    onClick={() => setChartPeriod(p)}
                                    className={`btn ${chartPeriod === p ? 'dashboard-chart-button-active' : 'dashboard-chart-button'}`}
                                >
                                    {p}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="chart-wrapper dashboard-chart-container">
                        <ResponsiveContainer width="100%" height={450} debounce={1}>
                            <LineChart data={lineChartData} margin={{ top: 5, right: 30, left: 20, bottom: 25 }} style={{ fontFamily: 'Arial, sans-serif' }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
                                <XAxis
                                    dataKey="name"
                                    stroke="black"
                                    style={{ fontSize: '0.7rem', fontFamily: 'Arial' }}
                                    label={{ value: 'Date', position: 'insideBottom', offset: -15, fontSize: '0.8rem', fontFamily: 'Arial' }}
                                />
                                <YAxis
                                    stroke="black"
                                    style={{ fontSize: '0.7rem', fontFamily: 'Arial' }}
                                    label={{ value: 'Sales ($)', angle: -90, position: 'insideLeft', fontSize: '0.8rem', fontFamily: 'Arial' }}
                                />
                                <Tooltip contentStyle={{ fontFamily: 'Arial' }} />
                                <Line type="monotone" dataKey="value" stroke="black" dot={{ r: 2 }} activeDot={{ r: 4 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Right Column: Top Items & Pie Chart */}
                <div className="chart-column-right">

                    {/* Top Items - Upper Half */}
                    <div className="card top-items-wrapper">
                        <h3 className="dashboard-top-items-title">Top 5 Items</h3>
                        <ul className="dashboard-top-items-list">
                            {topItems.map((item, idx) => (
                                <li key={idx} className="dashboard-top-items-item">
                                    <span>{idx + 1}. {item.name}</span>
                                    <strong>{item.qty}</strong>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Pie Chart - Lower Half */}
                    <div className="card pie-chart-wrapper">
                        <h3 className="dashboard-pie-chart-title">By Category</h3>
                        <div className="chart-wrapper">
                            <ResponsiveContainer width="100%" height={250} debounce={1}>
                                <PieChart style={{ fontFamily: 'Arial, sans-serif' }}>
                                    <Pie
                                        data={pieChartData}
                                        cx="50%"
                                        cy="50%"
                                        outerRadius="60%"
                                        fill="#8884d8"
                                        dataKey="value"
                                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                        labelLine={true}
                                        style={{ fontSize: '0.7rem', fontFamily: 'Arial' }}
                                    >
                                        {pieChartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip wrapperStyle={{ fontSize: '0.8rem', fontFamily: 'Arial' }} contentStyle={{ fontFamily: 'Arial' }} />
                                    <Legend wrapperStyle={{ fontSize: '0.7rem', fontFamily: 'Arial' }} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                </div>
            </div>

        </div>
    );
};

export default Dashboard;
