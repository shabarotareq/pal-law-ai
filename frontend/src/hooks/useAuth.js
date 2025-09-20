import { useContext, useMemo, useCallback } from "react";
import { AuthContext } from "../contexts/AuthContext";

/**
 * Hook مخصص للوصول إلى سياق المصادقة
 */
const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  const enhancedContext = useMemo(() => {
    const { user, loading, token, ...rest } = context;

    const isAuthenticated = !!(user && (user.token || token));
    const isLoading = !!loading;

    return {
      ...rest,
      user,
      isAuthenticated,
      isLoading,

      // أدوار المستخدم
      isAdmin: user?.role === "admin",
      isLawyer: user?.role === "lawyer",
      isJudge: user?.role === "judge",
      isModerator: user?.role === "moderator",
      isUser: user?.role === "user",

      // وظيفة مساعدة للتحقق من الصلاحيات
      hasRole: (role) => {
        if (!user?.role) return false;
        return Array.isArray(role)
          ? role.includes(user.role)
          : user.role === role;
      },

      hasAnyRole: (roles) => {
        if (!user?.role) return false;
        return roles.includes(user.role);
      },

      hasPermission: (permission) => {
        if (!user?.role) return false;
        if (user.role === "admin") return true;

        const rolePermissions = {
          judge: [
            "view_cases",
            "manage_cases",
            "view_documents",
            "manage_hearings",
          ],
          lawyer: [
            "view_cases",
            "manage_own_cases",
            "view_documents",
            "submit_documents",
          ],
          moderator: ["manage_users", "view_reports", "moderate_content"],
          user: ["view_own_cases", "view_public_documents"],
        };

        return rolePermissions[user.role]?.includes(permission) || false;
      },

      canAccess: (resource, action = "view") => {
        if (!user?.role) return false;

        const permissions = {
          admin: {
            cases: ["view", "create", "edit", "delete", "manage"],
            users: ["view", "create", "edit", "delete", "manage"],
            documents: ["view", "create", "edit", "delete", "manage"],
            settings: ["view", "edit"],
          },
          judge: {
            cases: ["view", "edit", "manage"],
            documents: ["view", "review"],
            hearings: ["view", "manage"],
          },
          lawyer: {
            cases: ["view", "create", "edit"],
            documents: ["view", "create", "submit"],
            clients: ["view", "manage"],
          },
          moderator: {
            users: ["view", "edit"],
            content: ["view", "moderate"],
            reports: ["view", "generate"],
          },
          user: {
            cases: ["view_own"],
            documents: ["view_own"],
            profile: ["view", "edit"],
          },
        };

        const resourcePermissions = permissions[user.role]?.[resource];
        if (!resourcePermissions) return false;

        return (
          resourcePermissions.includes(action) ||
          resourcePermissions.includes("manage") ||
          (action === "view" && resourcePermissions.includes("view_own"))
        );
      },

      userInfo: user
        ? {
            id: user.id ?? null,
            name: user.name ?? "",
            email: user.email ?? "",
            role: user.role ?? "guest",
            avatar: user.avatar ?? null,
            createdAt: user.createdAt ?? null,
            lastLogin: user.lastLogin ?? null,
            isActive: user.isActive !== false,
            ...(user.role === "lawyer" && {
              barNumber: user.barNumber ?? null,
              specialization: user.specialization ?? "",
              experience: user.experience ?? 0,
            }),
            ...(user.role === "judge" && {
              court: user.court ?? "",
              jurisdiction: user.jurisdiction ?? "",
            }),
          }
        : null,
    };
  }, [context]);

  return enhancedContext;
};

export default useAuth;

// تصديرات مساعدة
export const useAuthUser = () => useAuth().user;
export const useIsAuthenticated = () => useAuth().isAuthenticated;
export const useAuthLoading = () => useAuth().isLoading;
export const useUserRole = () => useAuth().user?.role;
export const useHasRole = (role) => useAuth().hasRole(role);
export const useHasPermission = (permission) =>
  useAuth().hasPermission(permission);
export const useCanAccess = (resource, action) =>
  useAuth().canAccess(resource, action);
