import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthLayout from './layouts/AuthLayout';
import MainLayout from './layouts/MainLayout';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Mentee from './pages/Mentee';
import Mentor from './pages/Mentor';
import Admin from './pages/Admin';

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Route>

        <Route element={<MainLayout />}>
          <Route path="/mentee" element={<Mentee />} />
          <Route path="/mentor" element={<Mentor />} />
          <Route path="/admin" element={<Admin />} />
        </Route>

        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;

