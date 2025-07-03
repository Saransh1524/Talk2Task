import axios from "axios";

// confgure base url 
const instance = axios.create({
  baseURL: "https://talk2task-backend.onrender.com/api",
});

// allows to add auth togen from local storage to request headers in the form of Bearer token, saves manual work of doing so
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default instance;
