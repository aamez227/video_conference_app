import axios, { AxiosInstance } from "axios";

type CustomAxiosInstance = AxiosInstance;

const makeRequest: CustomAxiosInstance = axios.create({
  baseURL: "http://localhost:8800/api/",
  withCredentials: true,
});

export default makeRequest;
