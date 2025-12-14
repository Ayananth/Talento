import { jwtDecode } from "jwt-decode";
import {ACCESS_TOKEN} from '../../constants/constants'

export const saveTokens = ({ access }) => {
  if (access) localStorage.setItem(ACCESS_TOKEN, access);
};

// Clear ALL stored tokens
export const clearTokens = () => {
  localStorage.removeItem(ACCESS_TOKEN);
};

// Get Access Token
export const getAccessToken = () =>
  localStorage.getItem(ACCESS_TOKEN);

// Decode JWT token safely
export const decodeToken = (token) => {
  try {
    return jwtDecode(token);
  } catch (err) {
    return null;
  }
};
