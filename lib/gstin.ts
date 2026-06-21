/**
 * Deterministic GSTIN validator.
 *
 * A GSTIN is 15 characters:
 *   [0-1]   2-digit state code
 *   [2-11]  10-character PAN (5 letters, 4 digits, 1 letter)
 *   [12]    entity number (1-9 then A-Z)
 *   [13]    'Z' by default
 *   [14]    checksum character (mod-36)
 *
 * This runs on top of the AI receipt extraction to give a clear, honest
 * verdict independent of the model's own guess.
 */

const GSTIN_REGEX = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][0-9A-Z]Z[0-9A-Z]$/;

const CODEPOINT_CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

// GST state / UT codes (incl. 97 "Other Territory" and 99 "Centre Jurisdiction").
export const GST_STATE_CODES: Record<string, string> = {
    '01': 'Jammu & Kashmir',
    '02': 'Himachal Pradesh',
    '03': 'Punjab',
    '04': 'Chandigarh',
    '05': 'Uttarakhand',
    '06': 'Haryana',
    '07': 'Delhi',
    '08': 'Rajasthan',
    '09': 'Uttar Pradesh',
    '10': 'Bihar',
    '11': 'Sikkim',
    '12': 'Arunachal Pradesh',
    '13': 'Nagaland',
    '14': 'Manipur',
    '15': 'Mizoram',
    '16': 'Tripura',
    '17': 'Meghalaya',
    '18': 'Assam',
    '19': 'West Bengal',
    '20': 'Jharkhand',
    '21': 'Odisha',
    '22': 'Chhattisgarh',
    '23': 'Madhya Pradesh',
    '24': 'Gujarat',
    '25': 'Daman & Diu',
    '26': 'Dadra & Nagar Haveli and Daman & Diu',
    '27': 'Maharashtra',
    '28': 'Andhra Pradesh (Old)',
    '29': 'Karnataka',
    '30': 'Goa',
    '31': 'Lakshadweep',
    '32': 'Kerala',
    '33': 'Tamil Nadu',
    '34': 'Puducherry',
    '35': 'Andaman & Nicobar Islands',
    '36': 'Telangana',
    '37': 'Andhra Pradesh',
    '38': 'Ladakh',
    '97': 'Other Territory',
    '99': 'Centre Jurisdiction',
};

/**
 * Compute the expected mod-36 checksum character for the first 14
 * characters of a GSTIN.
 */
export function computeGstinChecksum(first14: string): string {
    let factor = 2;
    let sum = 0;
    const mod = CODEPOINT_CHARS.length; // 36

    for (let i = first14.length - 1; i >= 0; i--) {
        const codePoint = CODEPOINT_CHARS.indexOf(first14[i]);
        let addend = factor * codePoint;
        factor = factor === 2 ? 1 : 2;
        addend = Math.floor(addend / mod) + (addend % mod);
        sum += addend;
    }

    const checkCodePoint = (mod - (sum % mod)) % mod;
    return CODEPOINT_CHARS[checkCodePoint];
}

export interface GstinVerdict {
    gstin: string;
    valid: boolean;
    /** Short, human-readable explanation of the verdict. */
    reason: string;
    stateCode?: string;
    stateName?: string;
}

/**
 * Validate a GSTIN: format, state code, and mod-36 checksum.
 * Returns a clear pass/fail verdict suitable for display.
 */
export function validateGstin(input: string | null | undefined): GstinVerdict {
    const gstin = (input ?? '').toString().trim().toUpperCase();

    if (!gstin) {
        return { gstin, valid: false, reason: 'No GSTIN found on the invoice.' };
    }

    if (gstin.length !== 15) {
        return { gstin, valid: false, reason: `Expected 15 characters, got ${gstin.length}.` };
    }

    if (!GSTIN_REGEX.test(gstin)) {
        return { gstin, valid: false, reason: 'Format does not match the GSTIN pattern.' };
    }

    const stateCode = gstin.slice(0, 2);
    const stateName = GST_STATE_CODES[stateCode];
    if (!stateName) {
        return { gstin, valid: false, reason: `Invalid state code "${stateCode}".`, stateCode };
    }

    const expected = computeGstinChecksum(gstin.slice(0, 14));
    if (expected !== gstin[14]) {
        return {
            gstin,
            valid: false,
            reason: 'Checksum digit does not match — likely a typo or fabricated GSTIN.',
            stateCode,
            stateName,
        };
    }

    return {
        gstin,
        valid: true,
        reason: `Valid GSTIN registered in ${stateName}.`,
        stateCode,
        stateName,
    };
}
