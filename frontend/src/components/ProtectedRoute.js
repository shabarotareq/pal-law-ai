import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getStoredUser } from "../services/authService";

export default function ProtectedRoute({ children }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const user = getStoredUser(); // جلب المستخدم من localStorage

    if (!user) {
      router.push("/Login"); // لو مافي مستخدم مسجل → توجيه لصفحة تسجيل الدخول
    } else {
      setAuthorized(true);
    }

    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>جاري التحقق من الصلاحيات...</p>
      </div>
    );
  }

  return authorized ? children : null;
}
