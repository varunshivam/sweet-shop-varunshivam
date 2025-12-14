import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// AUTH
export const loginUser = (data: any) => API.post("/auth/login", data);
export const registerUser = (data: any) => API.post("/auth/register", data);

// SWEETS (ADMIN + USER)
export const getSweets = () => API.get("/sweets");
export const addSweet = (data: any) => API.post("/sweets", data);
export const deleteSweet = (id: number) => API.delete(`/sweets/${id}`);

// ✅ MAIN UPDATE ENDPOINT (BACKEND-ALIGNED)
export const updateSweet = (id: number, data: Partial<any>) =>
  API.put(`/sweets/${id}`, data);

// ================= CART APIs =================

export const getCart = () => API.get("/cart");

export const addToCart = (sweet_id: number, quantity = 1) =>
  API.post("/cart", { sweet_id, quantity });

export const updateCartItem = (id: number, quantity: number) =>
  API.put(`/cart/${id}`, { quantity });

export const removeCartItem = (id: number) =>
  API.delete(`/cart/${id}`);

