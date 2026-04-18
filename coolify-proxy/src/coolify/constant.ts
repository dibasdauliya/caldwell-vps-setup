import { getEnvThrows } from "@utils/throws-env.ts";

const COOLIFY_BASE_URL = getEnvThrows("COOLIFY_BASE_URL");
export const COOLIFY_ACCESS_TOKEN = getEnvThrows("COOLIFY_ACCESS_TOKEN");

export const ENDPOINT = {
  COOLIFY_BASE_URL,
  SERVER: COOLIFY_BASE_URL + "/api/v1/servers",
  PROJECT: COOLIFY_BASE_URL + "/api/v1/projects",
  APPLICATION: COOLIFY_BASE_URL + "/api/v1/applications",
  APPLICATION_PUBLIC: COOLIFY_BASE_URL + "/api/v1/applications/public",
  DEPLOYMENT: COOLIFY_BASE_URL + "/api/v1/deployments",
  DATABASE: COOLIFY_BASE_URL + "/api/v1/databases",
};
