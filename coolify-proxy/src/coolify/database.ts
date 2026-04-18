import { COOLIFY_ACCESS_TOKEN, ENDPOINT } from "./constant.ts";
import { getLocalhostServer } from "./server.ts";
import { Mongo, PostrgeSQL, Redis } from "./types.ts";

export const listDatabase = async () => {
  const response = await fetch(ENDPOINT.DATABASE, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${COOLIFY_ACCESS_TOKEN}`,
    },
  });
  if (!response.ok) {
    const data = await response.json();
    throw new Error(
      `Couldn't retrieve databases info. \n ${JSON.stringify(data)}`,
    );
  }
  return await response.json();
};

export const getDatabase = async (uuid: string) => {
  const response = await fetch(`${ENDPOINT.DATABASE}/${uuid}`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${COOLIFY_ACCESS_TOKEN}`,
    },
  });
  if (!response.ok) {
    const data = await response.json();
    throw new Error(
      `Couldn't retrieve database info. \n ${JSON.stringify(data)}`,
    );
  }

  return response.json();
};

const HARDWARE_LIMITS = {
  limits_memory: "2g",
  limits_memory_reservation: "1g",
  limits_cpus: "1",
  limits_memory_swap: "2g",
  limits_cpuset: "",
  limits_cpu_shares: 256,
};

export const createDatabasePostgreSQL = async (params: PostrgeSQL) => {
  const server_uuid = await getLocalhostServer();

  const body = {
    server_uuid,
    ...params,
    ...HARDWARE_LIMITS,
  };

  const response = await fetch(ENDPOINT.DATABASE + "/postgresql", {
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
      `Couldn't create postgresql database info. \n ${JSON.stringify(data)}`,
    );
  }
  return await response.json();
};

export const createDatabaseMongoDB = async (params: Mongo) => {
  const server_uuid = await getLocalhostServer();

  const body = {
    server_uuid,
    ...params,
    ...HARDWARE_LIMITS,
  };
  const response = await fetch(ENDPOINT.DATABASE + "/mongodb", {
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
      `Couldn't create mongodb database info. \n ${JSON.stringify(data)}`,
    );
  }
  return await response.json();
};

export const createDatabaseRedis = async (params: Redis) => {
  const server_uuid = await getLocalhostServer();

  const body = {
    server_uuid,
    ...params,
    ...HARDWARE_LIMITS,
  };

  const response = await fetch(ENDPOINT.DATABASE + "/redis", {
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
      `Couldn't create database redis info. \n ${JSON.stringify(data)}`,
    );
  }
  return await response.json();
};

export const deleteDatabase = async (uuid: string) => {
  const response = await fetch(`${ENDPOINT.DATABASE}/${uuid}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${COOLIFY_ACCESS_TOKEN}`,
    },
  });
  if (!response.ok) {
    const data = await response.json();
    throw new Error(
      `Couldn't delete database. \n ${JSON.stringify(data)}`,
    );
  }

  return response.json();
};

export const startDatabase = async (uuid: string) => {
  const response = await fetch(`${ENDPOINT.DATABASE}/${uuid}/start`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${COOLIFY_ACCESS_TOKEN}`,
    },
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(
      `Couldn't start database. \n ${JSON.stringify(data)}`,
    );
  }

  return await response.json();
};

export const stopDatabase = async (uuid: string) => {
  const response = await fetch(`${ENDPOINT.DATABASE}/${uuid}/stop`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${COOLIFY_ACCESS_TOKEN}`,
    },
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(
      `Couldn't stop database. \n ${JSON.stringify(data)}`,
    );
  }

  return await response.json();
};

export const restartDatabase = async (uuid: string) => {
  const response = await fetch(`${ENDPOINT.DATABASE}/${uuid}/restart`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${COOLIFY_ACCESS_TOKEN}`,
    },
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(
      `Couldn't restart database. \n ${JSON.stringify(data)}`,
    );
  }

  return await response.json();
};
