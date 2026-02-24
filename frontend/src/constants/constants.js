// src/constants.js
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
export const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID;
export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
export const WS_BASE_URL = import.meta.env.VITE_WS_BASE_URL;
export const ACCESS_TOKEN = "access_token";
export const REFRESH_TOKEN = "refresh_token";
export const PAGE_SIZE = "12"
export const PAGE_SIZE_TABLES = "10"


// constants/jobSortOptions.js
export const JOB_SORT_OPTIONS = [
  {
    label: "Newest Post",
    value: "-published_at",
  },
  {
    label: "Oldest Post",
    value: "published_at",
  },
  
  { label: "Salary", value: "-salary_sort" },
];


