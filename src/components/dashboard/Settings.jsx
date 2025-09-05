import React, { useState } from "react";
import { useTheme } from "../../hooks/useTheme";
import { updateSettings } from "../../services/settings";

const Settings = () => {
  const { theme, updateTheme } = useTheme();
  const [settings, setSettings] = useState(theme);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateSettings(settings);
      updateTheme(settings);
      alert("تم حفظ الإعدادات بنجاح");
    } catch (error) {
      console.error("Error saving settings:", error);
      alert("حدث خطأ أثناء حفظ الإعدادات");
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setSettings(theme);
  };

  return (
    <div className="settings">
      <div className="page-header">
        <h2>إعدادات المنصة</h2>
        <div className="actions">
          <button className="btn btn-secondary" onClick={handleReset}>
            إعادة تعيين
          </button>
          <button
            className="btn btn-primary"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "جاري الحفظ..." : "حفظ الإعدادات"}
          </button>
        </div>
      </div>

      <div className="settings-sections">
        <div className="settings-section">
          <h3>الألوان</h3>
          <div className="color-pickers">
            <div className="form-group">
              <label>اللون الأساسي</label>
              <input
                type="color"
                value={settings.primaryColor}
                onChange={(e) =>
                  setSettings({ ...settings, primaryColor: e.target.value })
                }
              />
            </div>
            <div className="form-group">
              <label>لون الخلفية</label>
              <input
                type="color"
                value={settings.backgroundColor}
                onChange={(e) =>
                  setSettings({ ...settings, backgroundColor: e.target.value })
                }
              />
            </div>
            <div className="form-group">
              <label>لون النص</label>
              <input
                type="color"
                value={settings.textColor}
                onChange={(e) =>
                  setSettings({ ...settings, textColor: e.target.value })
                }
              />
            </div>
          </div>
        </div>

        <div className="settings-section">
          <h3>المظهر</h3>
          <div className="form-group">
            <label>حجم الخط</label>
            <select
              value={settings.fontSize}
              onChange={(e) =>
                setSettings({ ...settings, fontSize: e.target.value })
              }
            >
              <option value="small">صغير</option>
              <option value="medium">متوسط</option>
              <option value="large">كبير</option>
            </select>
          </div>
          <div className="form-group">
            <label>نمط التصميم</label>
            <select
              value={settings.themeMode}
              onChange={(e) =>
                setSettings({ ...settings, themeMode: e.target.value })
              }
            >
              <option value="light">فاتح</option>
              <option value="dark">داكن</option>
              <option value="auto">تلقائي</option>
            </select>
          </div>
        </div>

        <div className="settings-section">
          <h3>الصور</h3>
          <div className="form-group">
            <label>صورة الخلفية</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (e) => {
                    setSettings({
                      ...settings,
                      backgroundImage: e.target.result,
                    });
                  };
                  reader.readAsDataURL(file);
                }
              }}
            />
          </div>
          <div className="form-group">
            <label>شعار المنصة</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (e) => {
                    setSettings({ ...settings, logo: e.target.result });
                  };
                  reader.readAsDataURL(file);
                }
              }}
            />
          </div>
        </div>
      </div>

      <div className="settings-preview">
        <h3>معاينة التغييرات</h3>
        <div
          className="preview-box"
          style={{
            backgroundColor: settings.backgroundColor,
            color: settings.textColor,
            padding: "20px",
            borderRadius: "8px",
          }}
        >
          <h4 style={{ color: settings.primaryColor }}>عنوان نموذجي</h4>
          <p>هذا نموذج للنص سيبدو بهذا الشكل بعد تطبيق الإعدادات.</p>
          <button
            style={{
              backgroundColor: settings.primaryColor,
              color: "white",
              padding: "10px 20px",
              border: "none",
              borderRadius: "4px",
            }}
          >
            زر نموذجي
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
