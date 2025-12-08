const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "http://localhost:3001").replace(/\/$/, '');
export const BASE_URL = `${API_BASE_URL}/api/v1`;

export const USER_API_END_POINT = `${BASE_URL}/user`;
export const JOB_API_END_POINT = `${BASE_URL}/job`;
export const APPLICATION_API_END_POINT = `${BASE_URL}/application`;
export const COMPANY_API_END_POINT = `${BASE_URL}/company`;
