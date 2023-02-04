import apiUrl from "./urls";

const userApiUrl = `${apiUrl}/api/v1/user`;

const userApi = {
  login: `${userApiUrl}/login`,
  register: `${userApiUrl}/register`,
  logout: `${userApiUrl}/logout`,
  googleLogin: `${userApiUrl}/oauth/google/login`,
  teams: `${userApiUrl}/teams`,
  current: `${userApiUrl}/`,
  sendVerificationEmail: `${userApiUrl}/send-verification-email`,
  verifyEmail: `${userApiUrl}/verify-email`,
  changePassword: `${userApiUrl}/change-password`,
  sendResetPasswordLink: `${userApiUrl}/send-reset-password-link`,
  resetPassword: `${userApiUrl}/reset-password`,
}

export default userApi;