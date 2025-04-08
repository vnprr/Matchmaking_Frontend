// src/App.jsx
import { AuthProvider } from './context/AuthContext';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import ResendVerificationEmail  from "./pages/ResendVerificationEmail.jsx";
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import PrivateRoute from './routes/PrivateRoute';

function App() {
    return (
        // <AuthProvider>
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/resend-verification-email" element={<ResendVerificationEmail />} />
                <Route path="/register" element={<Register />} />
                {/* Trasy zabezpieczone: */}
                <Route element={<PrivateRoute />}>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/profile" element={<Profile />} />
                </Route>
            </Routes>
        </BrowserRouter>
        // </AuthProvider>
    );
}

export default App;