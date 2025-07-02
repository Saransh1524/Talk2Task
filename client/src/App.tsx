import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import './App.css';
import Home from './pages/Home';
import Login from './pages/Login';
import History from './pages/History';
import Navbar from './components/Navbar';
import Register from './pages/Register';
import { Toaster } from "@/components/ui/toaster";
// Layout component with conditional Navbar
function LayoutWithNavbar() {
  const location = useLocation();
  const hideNavbar = location.pathname === "/login" || location.pathname === "/register";

  return (
    <>

      {!hideNavbar && <Navbar />}
      <Toaster />
      <Routes>
        
        <Route path="/" element={<Home />} />
        <Route path="/history" element={<History />} />
        {/* Keep /login and /register inside if you want transitions/guards/etc */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <LayoutWithNavbar />
    </BrowserRouter>
  );
}

export default App;
