import { COOLIFY_ACCESS_TOKEN, ENDPOINT } from "./constant.ts";

export const getDeployment = async (uuid: string) => {
  const response = await fetch(`${ENDPOINT.DEPLOYMENT}/applications/${uuid}`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${COOLIFY_ACCESS_TOKEN}`,
    },
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(
      `Couldn't get deployment. \n ${JSON.stringify(data)}`,
    );
  }
  return response.json();
};
