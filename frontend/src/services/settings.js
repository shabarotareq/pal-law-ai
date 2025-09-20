import api from "./api";

export const getSettings = async (userId) => {
  try {
    const response = await api.get(`/settings/user/${userId}`);
    return {
      success: true,
      data: response.data.settings || response.data,
    };
  } catch (error) {
    console.error("Error fetching settings:", error);
    return {
      success: false,
      error: error.response?.data?.message || "فشل في تحميل الإعدادات",
    };
  }
};

export const updateSettings = async (userId, settings) => {
  try {
    const response = await api.put(`/settings/user/${userId}`, settings);
    return {
      success: true,
      data: response.data.settings || response.data,
      message: response.data.message || "تم تحديث الإعدادات بنجاح",
    };
  } catch (error) {
    console.error("Error updating settings:", error);
    return {
      success: false,
      error: error.response?.data?.message || "فشل في تحديث الإعدادات",
      validationErrors: error.response?.data?.errors,
    };
  }
};

export const resetSettings = async (userId) => {
  try {
    const response = await api.post(`/settings/user/${userId}/reset`);
    return {
      success: true,
      data: response.data.settings || response.data,
      message: response.data.message || "تم إعادة تعيين الإعدادات بنجاح",
    };
  } catch (error) {
    console.error("Error resetting settings:", error);
    return {
      success: false,
      error: error.response?.data?.message || "فشل في إعادة تعيين الإعدادات",
    };
  }
};

export const getPlatformSettings = async () => {
  try {
    const response = await api.get("/settings/platform");
    return {
      success: true,
      data: response.data.settings || response.data,
    };
  } catch (error) {
    console.error("Error fetching platform settings:", error);
    return {
      success: false,
      error: error.response?.data?.message || "فشل في تحميل إعدادات المنصة",
    };
  }
};

export const updatePlatformSettings = async (settings) => {
  try {
    const response = await api.put("/settings/platform", settings);
    return {
      success: true,
      data: response.data.settings || response.data,
      message: response.data.message || "تم تحديث إعدادات المنصة بنجاح",
    };
  } catch (error) {
    console.error("Error updating platform settings:", error);
    return {
      success: false,
      error: error.response?.data?.message || "فشل في تحديث إعدادات المنصة",
      validationErrors: error.response?.data?.errors,
    };
  }
};
