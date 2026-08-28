import axios from "axios";

const api = axios.create({
    baseURL: "http://ec2-3-110-219-142.ap-south-1.compute.amazonaws.com/",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");

    console.log("TOKEN:", token);

    if (token) {
        config.headers.Authorization =
            `Bearer ${token}`;
    }

    return config;
});


export default api;