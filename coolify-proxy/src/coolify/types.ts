import { z } from "zod";

export const ZApplication = z.object({
  git_repository: z.string(),
  project_uuid: z.string(),
  ports_exposes: z.string(),
  git_branch: z.string().default("main"),
  environment_name: z.string().default("production"),
  build_pack: z.enum(["nixpacks", "static", "dockerfile", "dockercompose"]),
  domains: z.url({ hostname: /(^|\.)cstem\.us$/ }).default(() => {
    return `https://${crypto.randomUUID().replace(/-/g, "")}.cstem.us`;
  }),
  destination_uuid: z.string().optional(),
  name: z.string().optional(),
  description: z.string().optional(),
  is_static: z.boolean().optional(),
  install_command: z.string().optional(),
  build_command: z.string().optional(),
  start_command: z.string().optional(),
  ports_mappings: z.string().optional(),
  base_directory: z.string().optional(),
  publish_directory: z.string().optional(),
  manual_webhook_secret_github: z.string().optional(),
  manual_webhook_secret_gitlab: z.string().optional(),
  manual_webhook_secret_bitbucket: z.string().optional(),
  manual_webhook_secret_gitea: z.string().optional(),
});
export type Application = z.infer<typeof ZApplication>;

const ZCommonDb = z.object({
  project_uuid: z.string(),
  environment_name: z.string().default("production"),
  name: z.string().optional(),
  description: z.string().optional(),
  is_public: z.boolean().optional(),
  public_port: z.number().optional(),
});

export const ZPostgreSQL = ZCommonDb.extend({
  postgres_user: z.string().optional(),
  postgres_password: z.string().optional(),
  postgres_db: z.string().optional(),
  postgres_initdb_args: z.string().optional(),
  postgres_host_auth_method: z.string().optional(),
  postgres_conf: z.string().optional(),
});
export type PostrgeSQL = z.infer<typeof ZPostgreSQL>;

export const ZRedis = ZCommonDb.extend({
  redis_password: z.string().optional(),
  redis_conf: z.string().optional(),
});
export type Redis = z.infer<typeof ZRedis>;

export const ZMongo = ZCommonDb.extend({
  mongo_conf: z.string().optional(),
  mongo_initdb_root_username: z.string().optional(),
});
export type Mongo = z.infer<typeof ZMongo>;

export const ZEnvironmentVariable = z.object({
  key: z.string(),
  value: z.string(),
  is_preview: z.boolean().optional(),
  is_literal: z.boolean().optional(),
  is_multiline: z.boolean().optional(),
  is_shown_once: z.boolean().optional(),
});
export type EnvironmentVariable = z.infer<typeof ZEnvironmentVariable>;
