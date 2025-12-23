import api from "../../api/api";

/**
 * Login user
 */
export const loginUser = async (credentials) => {
  const { data } = await api.post("/auth/login", credentials);
  return data;
};

/**
 * Signup user
 */
export const signupUser = async (payload) => {
  const { data } = await api.post("/auth/signup", payload);
  return data;
};
