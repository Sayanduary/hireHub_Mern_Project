import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import axios from "axios";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const api = axios.create({
  baseURL: "http://localhost:3001/api/v1",
  withCredentials: true, // CRITICAL FOR COOKIE AUTH
});

export default api;
