// src/types/server.ts
import { FastifyInstance } from "fastify";

export interface ServerOptions {
  port?: number;
  host?: string;
  logger?: boolean;
}

export interface ServerConfig {
  PORT: number;
  HOST: string;
  NODE_ENV: string;
}

export interface Server extends FastifyInstance {
  config: ServerConfig;
}

// Helper function to create server config
export function createServerConfig(
  options?: Partial<ServerConfig>
): ServerConfig {
  return {
    PORT: options?.PORT ?? Number(process.env.PORT) ?? 3000,
    HOST: options?.HOST ?? process.env.HOST ?? "localhost",
    NODE_ENV: options?.NODE_ENV ?? process.env.NODE_ENV ?? "development",
  };
}
