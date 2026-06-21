import { neon, type NeonQueryFunction } from '@neondatabase/serverless';

/**
 * Single source of database access for GST Shield.
 *
 * All DB access is server-side through API routes. There is no anon/RLS
 * concept anymore — the connection string is the only secret. The client is
 * created lazily so that importing this module never throws when
 * NEON_DATABASE_URL is absent (the app must still build and run with no env,
 * falling back to baked sample data).
 */

let client: NeonQueryFunction<false, false> | null = null;

function getClient(): NeonQueryFunction<false, false> {
    const url = process.env.NEON_DATABASE_URL;
    if (!url) {
        throw new Error('NEON_DATABASE_URL is not configured');
    }
    if (!client) {
        client = neon(url);
    }
    return client;
}

/** True when a Neon connection string is present in the environment. */
export function isDatabaseConfigured(): boolean {
    return Boolean(process.env.NEON_DATABASE_URL);
}

/**
 * Tagged-template SQL client backed by Neon's serverless HTTP driver.
 *
 * Usage: sql`SELECT * FROM compliance_records WHERE id = ${id}`
 *
 * Values interpolated into the template are sent as bound parameters, never
 * concatenated into the query string, so this is safe against injection.
 */
export const sql = (
    strings: TemplateStringsArray,
    ...values: unknown[]
): Promise<Record<string, unknown>[]> => {
    return getClient()(strings, ...values) as Promise<Record<string, unknown>[]>;
};
