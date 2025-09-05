import api from "./api";

export const getSettings = () => {
  return api.get("/settings").then((response) => response.data.settings);
};

export const updateSettings = (settings) => {
  return api.put("/settings", { settings }).then((response) => response.data);
};

export const getPlatformSettings = () => {
  return api
    .get("/settings/platform")
    .then((response) => response.data.settings);
};

export const updatePlatformSettings = (settings) => {
  return api
    .put("/settings/platform", { settings })
    .then((response) => response.data);
};
