// src/App.jsx
import { AuthProvider } from './context/AuthContext';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import ResendVerificationEmail from "./pages/ResendVerificationEmail.jsx";
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import PrivateRoute from './routes/PrivateRoute';
import Verify from './pages/Verify';

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Navbar />
                <div>
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/verify" element={<Verify />} />
                        <Route path="/verify-account" element={<ResendVerificationEmail />} />
                        <Route path="/register" element={<Register />} />
                        {/* Trasy zabezpieczone: */}
                        <Route element={<PrivateRoute />}>
                            <Route path="/" element={<Dashboard />} />
                            <Route path="/profile" element={<Profile />} />
                        </Route>
                    </Routes>
                </div>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;