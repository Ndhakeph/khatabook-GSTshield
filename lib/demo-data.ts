import type { ComplianceRecord } from './services/compliance-service';
import records from './demo-records.json';

/**
 * Baked sample data — the single source of truth shared by the database
 * seed (scripts/seed.mjs reads the same JSON) and the runtime fallback.
 *
 * Every read path (dashboard, stats, compliance table, CFO chat) falls back
 * to these records on any database error or empty result, so the demo is
 * never empty or broken — even on a cold start or with the DB unreachable.
 */
export const DEMO_RECORDS: ComplianceRecord[] = records as ComplianceRecord[];
