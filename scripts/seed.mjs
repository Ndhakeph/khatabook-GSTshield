// Idempotent Neon seed for GST Shield.
//
//   npm run seed
//
// Reads NEON_DATABASE_URL (from the environment or .env.local), applies the
// schema, and upserts the baked sample records from lib/demo-records.json —
// the single source of truth shared with the runtime fallback. Fixed UUIDs +
// ON CONFLICT make re-running safe.

import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { neon } from '@neondatabase/serverless';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..');

// Load .env.local if the connection string isn't already in the environment.
if (!process.env.NEON_DATABASE_URL && existsSync(join(root, '.env.local'))) {
    try {
        process.loadEnvFile(join(root, '.env.local'));
    } catch {
        // Older Node without loadEnvFile — rely on the ambient environment.
    }
}

const connectionString = process.env.NEON_DATABASE_URL;
if (!connectionString) {
    console.error('✗ NEON_DATABASE_URL is not set. Add it to .env.local or export it, then re-run `npm run seed`.');
    process.exit(1);
}

const sql = neon(connectionString);

const schema = readFileSync(join(root, 'scripts', 'schema.sql'), 'utf8');
const records = JSON.parse(readFileSync(join(root, 'lib', 'demo-records.json'), 'utf8'));

async function main() {
    console.log('→ Applying schema...');
    await sql.query(schema);

    console.log(`→ Upserting ${records.length} sample records...`);
    for (const r of records) {
        await sql`
            INSERT INTO compliance_records
                (id, vendor_name, gstin, status, amount, invoice_date,
                 taxable_value, cgst_amount, sgst_amount, igst_amount, cess_amount,
                 invoice_number, place_of_supply)
            VALUES
                (${r.id}, ${r.vendor_name}, ${r.gstin}, ${r.status}, ${r.amount}, ${r.invoice_date},
                 ${r.taxable_value}, ${r.cgst_amount}, ${r.sgst_amount}, ${r.igst_amount}, ${r.cess_amount},
                 ${r.invoice_number}, ${r.place_of_supply})
            ON CONFLICT (id) DO UPDATE SET
                vendor_name = EXCLUDED.vendor_name,
                gstin = EXCLUDED.gstin,
                status = EXCLUDED.status,
                amount = EXCLUDED.amount,
                invoice_date = EXCLUDED.invoice_date,
                taxable_value = EXCLUDED.taxable_value,
                cgst_amount = EXCLUDED.cgst_amount,
                sgst_amount = EXCLUDED.sgst_amount,
                igst_amount = EXCLUDED.igst_amount,
                cess_amount = EXCLUDED.cess_amount,
                invoice_number = EXCLUDED.invoice_number,
                place_of_supply = EXCLUDED.place_of_supply
        `;
    }

    const rows = await sql`SELECT count(*)::int AS count FROM compliance_records`;
    console.log(`✓ Seed complete. compliance_records now holds ${rows[0].count} rows.`);
}

main().catch((err) => {
    console.error('✗ Seed failed:', err);
    process.exit(1);
});
