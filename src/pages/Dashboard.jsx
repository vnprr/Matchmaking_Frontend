// src/components/Dashboard.jsx
import { Link } from 'react-router-dom';

const Dashboard = () => (
    <div>
        <h2>Witam na Dashboardzie!</h2>
        <Link to="/profile">Mój Profil</Link>
    </div>
);

export default Dashboard;