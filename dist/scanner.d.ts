export type scanResult = {
    approved: boolean;
    reasons: string[];
};
export declare function scanUser(userId: number, username: string): Promise<scanResult>;
//# sourceMappingURL=scanner.d.ts.map