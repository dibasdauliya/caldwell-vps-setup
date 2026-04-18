import { COOLIFY_ACCESS_TOKEN, ENDPOINT } from "./constant.ts";

export const listProject = async () => {
  const response = await fetch(ENDPOINT.PROJECT, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${COOLIFY_ACCESS_TOKEN}`,
    },
  });
  if (!response.ok) {
    const data = await response.json();
    throw new Error(
      `Couldn't retrieve projects info. \n ${JSON.stringify(data)}`,
    );
  }
  return await response.json();
};

export const getProject = async (uuid: string) => {
  const response = await fetch(`${ENDPOINT.PROJECT}/${uuid}`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${COOLIFY_ACCESS_TOKEN}`,
    },
  });
  if (!response.ok) {
    const data = await response.json();
    throw new Error(
      `Couldn't retrieve project info. \n ${JSON.stringify(data)}`,
    );
  }

  return response.json();
};

export const createProject = async (name: string) => {
  const response = await fetch(ENDPOINT.PROJECT, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${COOLIFY_ACCESS_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
    }),
  });
  if (!response.ok) {
    const data = await response.json();
    throw new Error(
      `Couldn't create project info. \n ${JSON.stringify(data)}`,
    );
  }
  return await response.json();
};

export const getProjectResources = async (uuid: string) => {
  const response = await fetch(`${ENDPOINT.PROJECT}/${uuid}/production`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${COOLIFY_ACCESS_TOKEN}`,
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    const data = await response.json();
    throw new Error(
      `Couldn't get project resources. \n ${JSON.stringify(data)}`,
    );
  }
  return await response.json();
};

export const deleteProject = async (uuid: string) => {
  const response = await fetch(`${ENDPOINT.PROJECT}/${uuid}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${COOLIFY_ACCESS_TOKEN}`,
    },
  });
  if (!response.ok) {
    const data = await response.json();
    throw new Error(
      `Couldn't delete project. \n ${JSON.stringify(data)}`,
    );
  }

  return response.json();
};
