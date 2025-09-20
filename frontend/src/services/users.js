import api from "./api";

// الحصول على جميع المستخدمين مع إمكانية التصفية والترتيب
export const getUsers = async (params = {}) => {
  try {
    const response = await api.get("/users", { params });
    return {
      success: true,
      data: response.data.users || response.data,
      total: response.data.total,
      page: response.data.page,
      totalPages: response.data.totalPages,
    };
  } catch (error) {
    console.error("Error fetching users:", error);
    return {
      success: false,
      error: error.response?.data?.message || "فشل في تحميل المستخدمين",
      data: [],
      total: 0,
    };
  }
};

// الحصول على مستخدم معين بواسطة ID
export const getUser = async (id) => {
  try {
    const response = await api.get(`/users/${id}`);
    return {
      success: true,
      data: response.data.user || response.data,
    };
  } catch (error) {
    console.error("Error fetching user:", error);
    return {
      success: false,
      error: error.response?.data?.message || "فشل في تحميل بيانات المستخدم",
    };
  }
};

// إنشاء مستخدم جديد
export const createUser = async (userData) => {
  try {
    const response = await api.post("/users", userData);
    return {
      success: true,
      data: response.data.user || response.data,
      message: response.data.message || "تم إنشاء المستخدم بنجاح",
    };
  } catch (error) {
    console.error("Error creating user:", error);
    return {
      success: false,
      error: error.response?.data?.message || "فشل في إنشاء المستخدم",
      validationErrors: error.response?.data?.errors,
    };
  }
};

// تحديث بيانات مستخدم
export const updateUser = async (id, userData) => {
  try {
    const response = await api.put(`/users/${id}`, userData);
    return {
      success: true,
      data: response.data.user || response.data,
      message: response.data.message || "تم تحديث المستخدم بنجاح",
    };
  } catch (error) {
    console.error("Error updating user:", error);
    return {
      success: false,
      error: error.response?.data?.message || "فشل في تحديث المستخدم",
      validationErrors: error.response?.data?.errors,
    };
  }
};

// حذف مستخدم
export const deleteUser = async (id) => {
  try {
    const response = await api.delete(`/users/${id}`);
    return {
      success: true,
      message: response.data.message || "تم حذف المستخدم بنجاح",
    };
  } catch (error) {
    console.error("Error deleting user:", error);
    return {
      success: false,
      error: error.response?.data?.message || "فشل في حذف المستخدم",
    };
  }
};

// تحديث الملف الشخصي للمستخدم الحالي
export const updateProfile = async (userData) => {
  try {
    const response = await api.put("/users/profile", userData);
    return {
      success: true,
      data: response.data.user || response.data,
      message: response.data.message || "تم تحديث الملف الشخصي بنجاح",
    };
  } catch (error) {
    console.error("Error updating profile:", error);
    return {
      success: false,
      error: error.response?.data?.message || "فشل في تحديث الملف الشخصي",
      validationErrors: error.response?.data?.errors,
    };
  }
};

// تعطيل/إيقاف مستخدم
export const suspendUser = async (id) => {
  try {
    const response = await api.patch(`/users/${id}/suspend`);
    return {
      success: true,
      data: response.data.user || response.data,
      message: response.data.message || "تم تعطيل المستخدم بنجاح",
    };
  } catch (error) {
    console.error("Error suspending user:", error);
    return {
      success: false,
      error: error.response?.data?.message || "فشل في تعطيل المستخدم",
    };
  }
};

// تفعيل مستخدم
export const activateUser = async (id) => {
  try {
    const response = await api.patch(`/users/${id}/activate`);
    return {
      success: true,
      data: response.data.user || response.data,
      message: response.data.message || "تم تفعيل المستخدم بنجاح",
    };
  } catch (error) {
    console.error("Error activating user:", error);
    return {
      success: false,
      error: error.response?.data?.message || "فشل في تفعيل المستخدم",
    };
  }
};

// تغيير كلمة المرور
export const changePassword = async (passwordData) => {
  try {
    const response = await api.patch("/users/change-password", passwordData);
    return {
      success: true,
      message: response.data.message || "تم تغيير كلمة المرور بنجاح",
    };
  } catch (error) {
    console.error("Error changing password:", error);
    return {
      success: false,
      error: error.response?.data?.message || "فشل في تغيير كلمة المرور",
      validationErrors: error.response?.data?.errors,
    };
  }
};

// إعادة تعيين كلمة المرور
export const resetPassword = async (email) => {
  try {
    const response = await api.post("/users/reset-password", { email });
    return {
      success: true,
      message: response.data.message || "تم إرسال رابط إعادة التعيين بنجاح",
    };
  } catch (error) {
    console.error("Error resetting password:", error);
    return {
      success: false,
      error: error.response?.data?.message || "فشل في إعادة تعيين كلمة المرور",
    };
  }
};

// الحصول على إحصائيات المستخدمين
export const getUserStats = async () => {
  try {
    const response = await api.get("/users/stats");
    return {
      success: true,
      data: response.data.stats || response.data,
    };
  } catch (error) {
    console.error("Error fetching user stats:", error);
    return {
      success: false,
      error:
        error.response?.data?.message || "فشل في تحميل إحصائيات المستخدمين",
    };
  }
};

// البحث في المستخدمين
export const searchUsers = async (query, filters = {}) => {
  try {
    const response = await api.get("/users/search", {
      params: { q: query, ...filters },
    });
    return {
      success: true,
      data: response.data.users || response.data,
      total: response.data.total,
    };
  } catch (error) {
    console.error("Error searching users:", error);
    return {
      success: false,
      error: error.response?.data?.message || "فشل في البحث",
      data: [],
      total: 0,
    };
  }
};

// تصدير بيانات المستخدمين
export const exportUsers = async (format = "csv", filters = {}) => {
  try {
    const response = await api.get("/users/export", {
      params: { format, ...filters },
      responseType: "blob",
    });

    // إنشاء رابط للتحميل
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `users_export.${format}`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);

    return {
      success: true,
      message: "تم تصدير البيانات بنجاح",
    };
  } catch (error) {
    console.error("Error exporting users:", error);
    return {
      success: false,
      error: error.response?.data?.message || "فشل في تصدير البيانات",
    };
  }
};

// تحميل صورة المستخدم
export const uploadUserAvatar = async (userId, file) => {
  try {
    const formData = new FormData();
    formData.append("avatar", file);

    const response = await api.post(`/users/${userId}/avatar`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return {
      success: true,
      data: response.data.user || response.data,
      message: response.data.message || "تم رفع الصورة بنجاح",
    };
  } catch (error) {
    console.error("Error uploading avatar:", error);
    return {
      success: false,
      error: error.response?.data?.message || "فشل في رفع الصورة",
    };
  }
};

// حذف صورة المستخدم
export const deleteUserAvatar = async (userId) => {
  try {
    const response = await api.delete(`/users/${userId}/avatar`);
    return {
      success: true,
      data: response.data.user || response.data,
      message: response.data.message || "تم حذف الصورة بنجاح",
    };
  } catch (error) {
    console.error("Error deleting avatar:", error);
    return {
      success: false,
      error: error.response?.data?.message || "فشل في حذف الصورة",
    };
  }
};

// الحصول على سجل نشاط المستخدم
export const getUserActivity = async (userId, params = {}) => {
  try {
    const response = await api.get(`/users/${userId}/activity`, { params });
    return {
      success: true,
      data: response.data.activities || response.data,
      total: response.data.total,
    };
  } catch (error) {
    console.error("Error fetching user activity:", error);
    return {
      success: false,
      error: error.response?.data?.message || "فشل في تحميل سجل النشاط",
      data: [],
      total: 0,
    };
  }
};

// إرسال إشعار للمستخدم
export const sendUserNotification = async (userId, notificationData) => {
  try {
    const response = await api.post(
      `/users/${userId}/notify`,
      notificationData
    );
    return {
      success: true,
      message: response.data.message || "تم إرسال الإشعار بنجاح",
    };
  } catch (error) {
    console.error("Error sending notification:", error);
    return {
      success: false,
      error: error.response?.data?.message || "فشل في إرسال الإشعار",
    };
  }
};

// تحديث إعدادات المستخدم
export const updateUserSettings = async (userId, settings) => {
  try {
    const response = await api.put(`/users/${userId}/settings`, settings);
    return {
      success: true,
      data: response.data.settings || response.data,
      message: response.data.message || "تم تحديث الإعدادات بنجاح",
    };
  } catch (error) {
    console.error("Error updating user settings:", error);
    return {
      success: false,
      error: error.response?.data?.message || "فشل في تحديث الإعدادات",
    };
  }
};

// التحقق من توفر البريد الإلكتروني
export const checkEmailAvailability = async (email) => {
  try {
    const response = await api.get("/users/check-email", {
      params: { email },
    });
    return {
      success: true,
      available: response.data.available,
      message: response.data.message,
    };
  } catch (error) {
    console.error("Error checking email availability:", error);
    return {
      success: false,
      error:
        error.response?.data?.message || "فشل في التحقق من البريد الإلكتروني",
    };
  }
};

// التحقق من توفر اسم المستخدم
export const checkUsernameAvailability = async (username) => {
  try {
    const response = await api.get("/users/check-username", {
      params: { username },
    });
    return {
      success: true,
      available: response.data.available,
      message: response.data.message,
    };
  } catch (error) {
    console.error("Error checking username availability:", error);
    return {
      success: false,
      error: error.response?.data?.message || "فشل في التحقق من اسم المستخدم",
    };
  }
};

// دمج حسابات المستخدمين
export const mergeUsers = async (sourceUserId, targetUserId) => {
  try {
    const response = await api.post("/users/merge", {
      sourceUserId,
      targetUserId,
    });
    return {
      success: true,
      data: response.data.user || response.data,
      message: response.data.message || "تم دمج الحسابات بنجاح",
    };
  } catch (error) {
    console.error("Error merging users:", error);
    return {
      success: false,
      error: error.response?.data?.message || "فشل في دمج الحسابات",
    };
  }
};

// تحديث حالة تسجيل الدخول
export const updateLoginStatus = async (userId, status) => {
  try {
    const response = await api.patch(`/users/${userId}/login-status`, {
      status,
    });
    return {
      success: true,
      data: response.data.user || response.data,
      message: response.data.message || "تم تحديث حالة التسجيل بنجاح",
    };
  } catch (error) {
    console.error("Error updating login status:", error);
    return {
      success: false,
      error: error.response?.data?.message || "فشل في تحديث حالة التسجيل",
    };
  }
};
