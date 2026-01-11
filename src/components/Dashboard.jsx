import { useState } from 'react';
import { LineChart, PieChart, BarChart } from 'recharts';



//Note: After pulling the repo, run "npm install" to install all dependencies :D
function Dashboard() {
    const [period, setPeriod] = useState('daily');
    return(
        <div>
        <div>
        <h2> Dashboard </h2>
        </div>

        <div>
            <label>Sales Trend View: </label>
            <select value={period} onChange={(e) => setPeriod(e.target.value)}>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
            </select>
        </div>
        




        </div>
    )
}

export default Dashboard;