
export interface ComplianceStatus {
    gstin: string;
    status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
    lastFilingDate: string;
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface ServiceResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}
