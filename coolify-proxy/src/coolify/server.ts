import { COOLIFY_ACCESS_TOKEN, ENDPOINT } from "./constant.ts";

export const getLocalhostServer = async () => {
  const response = await fetch(ENDPOINT.SERVER, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${COOLIFY_ACCESS_TOKEN}`,
    },
  });
  if (!response.ok) {
    const data = await response.json();
    throw new Error(
      `Couldn't retrieve server info. \n ${JSON.stringify(data)}`,
    );
  }
  const servers: { name: string; uuid: string }[] = await response.json();

  if (servers.length == 0) {
    throw new Error(
      "No server exists.",
    );
  }
  const server = servers.find((server) => {
    return server.name == "localhost";
  });

  if (!server) {
    throw new Error(
      `Couldn't retrieve server info.`,
    );
  }

  return server.uuid;
};
