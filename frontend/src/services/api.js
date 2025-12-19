import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,   // for deployment doing this 
});

export default API;

//in repo we did some changes here 
