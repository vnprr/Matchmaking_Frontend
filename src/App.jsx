import { AuthProvider } from './context/AuthContext';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/navbar/Navbar.jsx';
import Login from './pages/Login';
import ResendVerificationEmail from "./pages/ResendVerificationEmail.jsx";
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import PrivateRoute from './routes/PrivateRoute';
import AdminRoute from './routes/AdminRoute';
import Verify from './pages/Verify';
import OAuth2RedirectHandler from './components/OAuth2RedirectHandler';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import AccountSecurityPage from './pages/AccountSecurityPage';
import AdminPanel from './pages/admin/AdminPanel';
import AdminUsersList from './pages/admin/AdminUsersList';
import AdminUserDetails from './pages/admin/AdminUserDetails';
import AdminConfig from './pages/admin/AdminConfig';
import AdminProfileSections from "./pages/admin/AdminProfileSections.jsx";
import { ProfileProvider } from './context/ProfileContext';
import ChatPage from "./pages/ChatPage.jsx";
import GalleryPage from "./pages/GalleryPage.jsx";
import ImageCropPage from "./pages/ImageCropPage.jsx";

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Navbar />
                <div>
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                        <Route path="/reset-password" element={<ResetPasswordPage />} />
                        <Route path="/verify" element={<Verify />} />
                        <Route path="/verify-account" element={<ResendVerificationEmail />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/oauth-callback" element={<OAuth2RedirectHandler />} />

                        <Route element={<PrivateRoute />}>
                            <Route path="/" element={<Dashboard />} />
                            <Route path="/gallery" element={<GalleryPage />} />
                            <Route path="/image-crop/:imageId" element={<ImageCropPage />} />
                            <Route path="/profile" element={<ProfileProvider><Profile /></ProfileProvider>} />
                            <Route path="/profile/:profileId" element={<ProfileProvider><Profile /></ProfileProvider>} />
                            <Route path="/account-security" element={<AccountSecurityPage />} />
                            <Route path="/chat" element={<ChatPage />} />
                        </Route>

                        <Route element={<AdminRoute />}>
                            <Route path="/admin" element={<AdminPanel />} />
                            <Route path="/admin/users" element={<AdminUsersList />} />
                            <Route path="/admin/users/:userId" element={<AdminUserDetails />} />
                            <Route path="/admin/config" element={<AdminConfig />} />
                            <Route path="/admin/profile-sections" element={<AdminProfileSections />} />
                        </Route>
                    </Routes>
                </div>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
