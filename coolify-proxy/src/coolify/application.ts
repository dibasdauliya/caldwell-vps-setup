import { getLocalhostServer } from "./server.ts";
import { COOLIFY_ACCESS_TOKEN, ENDPOINT } from "./constant.ts";
import { Application, EnvironmentVariable } from "./types.ts";

const HARDWARE_LIMITS = {
  limits_memory: "2g",
  limits_memory_reservation: "1g",
  limits_cpus: "1",
  limits_memory_swap: "2g",
  limits_cpuset: "",
  limits_cpu_shares: 256,
};

export const createApplication = async (params: Application) => {
  const server_uuid = await getLocalhostServer();

  const body = {
    server_uuid,
    ...params,
    ...HARDWARE_LIMITS,
  };

  const response = await fetch(ENDPOINT.APPLICATION_PUBLIC, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${COOLIFY_ACCESS_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(
      `Couldn't create application. \n ${JSON.stringify(data)}`,
    );
  }
  return response.json();
};

export const updateApplication = async (
  uuid: string,
  params: Partial<Application>,
) => {
  const { environment_name: _, ...rest } = params;
  const response = await fetch(`${ENDPOINT.APPLICATION}/${uuid}`, {
    method: "PATCH",
    headers: {
      "Authorization": `Bearer ${COOLIFY_ACCESS_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(rest),
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(
      `Couldn't update application. \n ${JSON.stringify(data)}`,
    );
  }
  return await response.json();
};

export const listApplication = async () => {
  const response = await fetch(`${ENDPOINT.APPLICATION}`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${COOLIFY_ACCESS_TOKEN}`,
    },
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(
      `Couldn't list application. \n ${JSON.stringify(data)}`,
    );
  }

  return await response.json();
};

export const getApplication = async (uuid: string) => {
  const response = await fetch(`${ENDPOINT.APPLICATION}/${uuid}`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${COOLIFY_ACCESS_TOKEN}`,
    },
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(
      `Couldn't get application. \n ${JSON.stringify(data)}`,
    );
  }

  return response.json();
};

export const startApplication = async (uuid: string) => {
  const response = await fetch(`${ENDPOINT.APPLICATION}/${uuid}/start`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${COOLIFY_ACCESS_TOKEN}`,
    },
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(
      `Couldn't start application. \n ${JSON.stringify(data)}`,
    );
  }

  return response.json();
};

export const stopApplication = async (uuid: string) => {
  const response = await fetch(`${ENDPOINT.APPLICATION}/${uuid}/stop`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${COOLIFY_ACCESS_TOKEN}`,
    },
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(
      `Couldn't stop application. \n ${JSON.stringify(data)}`,
    );
  }

  return response.json();
};

export const restartApplication = async (uuid: string) => {
  const response = await fetch(`${ENDPOINT.APPLICATION}/${uuid}/restart`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${COOLIFY_ACCESS_TOKEN}`,
    },
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(
      `Couldn't restart application. \n ${JSON.stringify(data)}`,
    );
  }

  return response.json();
};

export const deleteApplication = async (uuid: string) => {
  const response = await fetch(`${ENDPOINT.APPLICATION}/${uuid}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${COOLIFY_ACCESS_TOKEN}`,
    },
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(
      `Couldn't delete application. \n ${JSON.stringify(data)}`,
    );
  }

  return response.json();
};

export const listEnv = async (uuid: string) => {
  const response = await fetch(`${ENDPOINT.APPLICATION}/${uuid}/envs`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${COOLIFY_ACCESS_TOKEN}`,
    },
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(
      `Couldn't get environment variables. \n ${JSON.stringify(data)}`,
    );
  }

  return response.json();
};

export const createEnv = async (uuid: string, params: EnvironmentVariable) => {
  const response = await fetch(`${ENDPOINT.APPLICATION}/${uuid}/envs`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${COOLIFY_ACCESS_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ...params }),
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(
      `Couldn't create environment variable. \n ${JSON.stringify(data)}`,
    );
  }

  return response.json();
};

export const updateEnv = async (uuid: string, params: EnvironmentVariable) => {
  const response = await fetch(`${ENDPOINT.APPLICATION}/${uuid}/envs`, {
    method: "PATCH",
    headers: {
      "Authorization": `Bearer ${COOLIFY_ACCESS_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ...params }),
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(
      `Couldn't update environment variable. \n ${JSON.stringify(data)}`,
    );
  }

  return response.json();
};

export const deleteEnv = async (app_uuid: string, env_uuid: string) => {
  const response = await fetch(
    `${ENDPOINT.APPLICATION}/${app_uuid}/envs/${env_uuid}`,
    {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${COOLIFY_ACCESS_TOKEN}`,
      },
    },
  );

  if (!response.ok) {
    const data = await response.json();
    throw new Error(
      `Couldn't delete environment variable. \n ${JSON.stringify(data)}`,
    );
  }

  return response.json();
};
