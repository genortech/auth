import { DATABASE_URL } from '$env/static/private';
import { Pool, neon, neonConfig } from '@neondatabase/serverless';
import { drizzle as drizzleHttp } from 'drizzle-orm/neon-http';
import { drizzle as drizzleWs } from 'drizzle-orm/neon-serverless';
import WebSocket from 'ws'

// This is required for the WebSocket connection to work in Node.js
// See: https://github.com/neondatabase/serverless#example-nodejs-with-poolconnect
neonConfig.fetchConnectionCache = true;
neonConfig.webSocketConstructor = WebSocket;

/*
 * Exporting both the Pool and the Neon instance allows us to pick and choose whether we want to use the WebSocket or HTTP connection.
 * This is not necessary per se, but it's a nice feature to have.
 *
 * Note: this is not related to Lucia, as it uses the WebSocket connection by default.
 * But in cases where you want to use the HTTP connection throughout your app, you can do so.
 */

export const pool = new Pool({ connectionString: DATABASE_URL })
export const http = neon(DATABASE_URL);

export const dbPool = drizzleWs(pool, { logger: true });
export const dbHttp = drizzleHttp(http, { logger: true });
