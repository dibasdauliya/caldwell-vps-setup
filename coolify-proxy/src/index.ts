import { _truncateDbRoute } from "@routes/_truncate-db.ts";

import { createUserRoute } from "@routes/user/create-user.ts";
import { deleteUserRoute } from "@routes/user/delete-user.ts";
import { listUserRoute } from "@routes/user/list-user.ts";
import { signinUserRoute } from "@routes/user/signin-user.ts";

import { createEnvRoute } from "@routes/application/env/create-env.ts";
import { deleteEnvRoute } from "@routes/application/env/delete-env.ts";
import { listEnvRoute } from "@routes/application/env/list-env.ts";
import { updateEnvRoute } from "@routes/application/env/update-env.ts";

import { createDatabaseRoute } from "@routes/database/create-database.ts";
import { deleteDatabaseRoute } from "@routes/database/delete-database.ts";
import { restartDatabaseRoute } from "@routes/database/restart-database.ts";
import { startDatabaseRoute } from "@routes/database/start-database.ts";
import { stopDatabaseRoute } from "@routes/database/stop-database.ts";

import { getDeploymentRoute } from "@routes/deployment/get-deployment.ts";

import { createProjectRoute } from "@routes/project/create-project.ts";
import { deleteProjectRoute } from "@routes/project/delete-project.ts";
import { getProjectResourcesRoute } from "@routes/project/get-project-resources.ts";
import { listProjectRoute } from "@routes/project/list-project.ts";

import { createApplicationRoute } from "@routes/application/create-application.ts";
import { deleteApplicationRoute } from "@routes/application/delete-application.ts";
import { restartApplicationRoute } from "@routes/application/restart-application.ts";
import { startApplicationRoute } from "@routes/application/start-application.ts";
import { stopApplicationRoute } from "@routes/application/stop-application.ts";
import { updateApplicationRoute } from "@routes/application/update-application.ts";

import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { getEnvThrows } from "@utils/throws-env.ts";

const app = new Hono();

app.use(logger());
app.use(
  "/*",
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3002",
      getEnvThrows("FRONTEND_URL"),
    ],
    credentials: true,
  })
);

app.get("/", (c) => {
  return c.text("Hello Hello!");
});

app.route("/", createApplicationRoute);
app.route("/", updateApplicationRoute);
app.route("/", deleteApplicationRoute);

app.route("/", restartApplicationRoute);
app.route("/", startApplicationRoute);
app.route("/", stopApplicationRoute);

app.route("/", listEnvRoute);
app.route("/", createEnvRoute);
app.route("/", updateEnvRoute);
app.route("/", deleteEnvRoute);

app.route("/", createProjectRoute);
app.route("/", getProjectResourcesRoute);
app.route("/", listProjectRoute);
app.route("/", deleteProjectRoute);

app.route("/", createDatabaseRoute);
app.route("/", deleteDatabaseRoute);

app.route("/", restartDatabaseRoute);
app.route("/", startDatabaseRoute);
app.route("/", stopDatabaseRoute);

app.route("/", createUserRoute);
app.route("/", listUserRoute);
app.route("/", deleteUserRoute);
app.route("/", signinUserRoute);

app.route("/", _truncateDbRoute);
app.route("/", getDeploymentRoute);

Deno.serve({ port: 8080 }, app.fetch);
