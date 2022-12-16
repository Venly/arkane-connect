export class Profile {
    public userId!: string;
    public hasMasterPin = false;
    public username!: string;
    public email!: string;
    public firstName!: string;
    public lastName!: string;
    public nickname!: string;
    public verification!: ProfileVerification;
}

export interface ProfileVerification {
    result: VerificationResult;
    reason?: string;
    timestamp: Date | string;
    reference: string;
}

export enum VerificationResult {
    VERIFIED = 'verified',
    FRAUD = 'fraud'
}
