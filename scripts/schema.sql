-- GST Shield — Neon (serverless Postgres) schema.
-- No Row Level Security: all access is server-side through API routes, and the
-- connection string is the only secret. gen_random_uuid() is built in on Neon.
CREATE TABLE IF NOT EXISTS compliance_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vendor_name TEXT NOT NULL,
    gstin TEXT NOT NULL,
    status TEXT CHECK (status IN ('Safe', 'Failed', 'Pending')),
    amount NUMERIC NOT NULL,
    invoice_date DATE NOT NULL,
    taxable_value NUMERIC DEFAULT 0,
    cgst_amount NUMERIC DEFAULT 0,
    sgst_amount NUMERIC DEFAULT 0,
    igst_amount NUMERIC DEFAULT 0,
    cess_amount NUMERIC DEFAULT 0,
    invoice_number TEXT DEFAULT 'UNKNOWN',
    place_of_supply TEXT DEFAULT 'UNKNOWN',
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);
