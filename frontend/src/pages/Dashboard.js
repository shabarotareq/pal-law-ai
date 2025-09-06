import { useEffect, useState } from "react";
import { getProfile, logout } from "../services/authService";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        setUser(data);
      } catch (err) {
        navigate("/login");
      }
    };
    fetchProfile();
  }, [navigate]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!user) return <p>جاري تحميل البيانات...</p>;

  return (
    <div className="container mt-5">
      <h2>لوحة التحكم</h2>
      <p>مرحبا {user.name} 👋</p>
      <p>بريدك الإلكتروني: {user.email}</p>
      <p>دورك: {user.role}</p>
      <button onClick={handleLogout} className="btn btn-danger mt-3">
        تسجيل الخروج
      </button>
    </div>
  );
};

export default Dashboard;
