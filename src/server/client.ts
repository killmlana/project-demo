import { env } from "@/env";
import axios from "axios";

export const apiClient = axios.create({
  baseURL: env.BASE_API_URL,
  headers:{
    "x-api-secret": env.API_SECRET
  }
});
