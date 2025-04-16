import axios from "axios";

const API_URL = "http://localhost:5000";
export const registerUser = async ({ name, email, password }) => {
  const response = await axios.post(`${API_URL}/api/v1/auth/register`, {
    name,
    email,
    password,
  });
  return response.data;
};
export const loginUser = async ({ email, password }) => {
  const response = await axios.post(`${API_URL}/api/v1/auth/login`, { email, password });
  return response.data;
};

export const verifyEmail = async (token) => {
  const { data } = await axios.get(`${API_URL}/api/v1/auth/verify-email/${token}`);
  return data;
};

export const verifyLogin2FA = async ({ email, otp }) => {
  const response = await axios.post(`${API_URL}/api/v1/auth/verify-login-2fa`, {
    email,
    otp,
  });
  return response.data;
};

export const getProfile = async () => {
  const { data } = await axios.get(`${API_URL}/api/v1/user/get-profile`, {
    withCredentials: true,
  });
  return data;
};

export const logoutUser = async () => {
  const { data } = await axios.post(
    `${API_URL}/api/v1/auth/logout`,
    {},
    { withCredentials: true }
  );
  return data;
};

export const updateProfile = async ({ name, email }) => {
  const res = await axios.patch(`${API_URL}/api/v1/user/update-profile`, { name, email });
  return res.data;
};

export const updatePassword = async ({ currentPassword, newPassword }) => {
  const res = await axios.patch(`${API_URL}/api/v1/user/update-password`, {
    currentPassword,
    newPassword,
  });
  return res.data;
};

export const logoutAll = async () => {
  const res = await axios.post(`${API_URL}/api/v1/auth/logout-all`);
  return res.data;
};

export const deleteAccount = async () => {
  const res = await axios.delete(`${API_URL}/api/v1/user/delete-account`);
  return res.data;
};

export const verify2FA = async (otp) => {
  const response = await axios.post(`${API_URL}/api/v1/auth/verify-2fa`, { otp });
  return response.data;
};

export const disable2FA = async (password) => {
  const response = await axios.post(`${API_URL}/api/v1/auth/disable-2fa`, { password });
  return response.data;
};

// Refresh Token
export const refreshTokenApi = async () => {
  const res = await axios.get(`${API_URL}/api/v1/auth/refresh-token`, {
    withCredentials: true,
  });
  return res.data;
};

// Forgot Password
export const forgotPasswordApi = async (email) => {
  const res = await axios.post(
    `${API_URL}/api/v1/auth/forgot-password`,
    { email },
    { withCredentials: true }
  );
  return res.data;
};

// Reset Password
export const resetPasswordApi = async ({ token, newPassword }) => {
  const res = await axios.post(
    "${API_URL}/api/v1/auth/reset-password",
    { token, newPassword },
    { withCredentials: true }
  );
  return res.data;
};

export const enable2FAApi = async () => {
  const res = await axios.post(
    "${API_URL}/api/v1/auth/enable-2fa",
    {},
    { withCredentials: true }
  );
  return res.data;
};

// OAuth Callback - Google or GitHub
export const oauthCallbackApi = async (provider, code) => {
  const res = await axios.post(
    `${API_URL}/api/v1/auth/oauth/${provider}/callback`,
    { code },
    { withCredentials: true }
  );
  return res.data;
};

export const deleteAccountRequest = async () => {
  const res = await axios.delete(`${API_URL}/api/v1/user/delete-account`, {
    withCredentials: true, // important for cookie-based auth
  });
  return res.data;
};

export const verifyPassword = async ({ password }) => {
  const res = await axios.post("${API_URL}/api/v1/user/verify-password", { password });
  return res.data;
};
