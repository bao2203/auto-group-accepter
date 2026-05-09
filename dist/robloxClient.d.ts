export declare function getCatalogItemPrices(itemIds: number[]): Promise<number>;
export declare function getCsrfToken(): Promise<string>;
export declare function getPendingJoinRequests(groupId: number): Promise<{
    userId: any;
    username: any;
    displayName: any;
}[]>;
export declare function getUserInfo(userId: number): Promise<any>;
export declare function getUserRAP(userId: number): Promise<number>;
export declare function getCurrentAvatarItems(userId: number): Promise<any>;
export declare function declineJoinRequest(groupId: number, userId: number, csrfToken: string): Promise<void>;
export declare function acceptRequest(groupId: number, userId: number, csrfToken: string): Promise<void>;
//# sourceMappingURL=robloxClient.d.ts.map