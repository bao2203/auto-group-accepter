import axios from "axios";
import Bottleneck from "bottleneck";
import { config } from "./config.js";
const BASE = "https://groups.roblox.com";
const USERS = "https://users.roblox.com";
const INVENTORY = "https://inventory.roblox.com";
const AVATAR = "https://avatar.roblox.com";
const CATALOG = "https://catalog.roblox.com";
const limiter = new Bottleneck({
    minTime: 1000, // AVOID RATE LIMITING!
    maxConcurrent: 1
});
const client = axios.create({
    headers: { Cookie: `.ROBLOSECURITY=${config.cookie}` },
    withCredentials: true,
});
export async function getCatalogItemPrices(itemIds) {
    if (!itemIds || itemIds.length === 0)
        return 0;
    const url = `${CATALOG}/v1/catalog/items/details`;
    const items = itemIds.map(id => ({ itemType: "asset", id }));
    try {
        const csrfToken = await getCsrfToken();
        const _request = limiter.wrap(async () => {
            return await client.post(url, { items }, {
                headers: {
                    "X-CSRF-Token": csrfToken,
                    "Content-Type": "application/json",
                    "Cookie": `.ROBLOSECURITY=${process.env.ROBLOX_COOKIE}`
                }
            });
        });
        const response = await _request();
        // returns { data: [ { id, price, ... } ] }
        const itemList = response.data?.data ?? [];
        if (itemList.length === 0) {
            console.warn("No items found for the provided IDs.");
            return 0;
        }
        return itemList.reduce((sum, item) => {
            const itemPrice = item.price ?? item.lowestPrice ?? item.lowestResalePrice ?? 0;
            return sum + itemPrice;
        }, 0);
    }
    catch (err) {
        console.error("Error fetching catalog item prices:", err.response?.data || err.message);
        return 0;
    }
}
export async function getCsrfToken() {
    try {
        await limiter.wrap(async () => { await client.post("https://auth.roblox.com/v2/logout"); })();
    }
    catch (error) {
        return error.response?.headers["x-csrf-token"] ?? "Unknown Error: CSRF not found";
    }
    return "";
}
// get pending join reqs
export async function getPendingJoinRequests(groupId) {
    try {
        const _resquest = limiter.wrap(async () => {
            return await client.get(`${BASE}/v1/groups/${groupId}/join-requests?limit=100`);
        });
        const res = await _resquest();
        const data = res.data?.data;
        if (!Array.isArray(data))
            return [];
        return data
            .filter((entry) => {
            const id = entry.requester?.userId ?? entry.userId;
            return id !== undefined && id !== null;
        })
            .map((entry) => ({
            userId: entry.requester?.userId ?? entry.userId,
            username: entry.requester?.username ?? entry.username,
            displayName: entry.requester?.displayName ?? entry.displayName,
        }));
    }
    catch (err) {
        console.error("Error fetching pending join requests:", err);
        return [];
    }
}
// get user info
export async function getUserInfo(userId) {
    try {
        const _resquest = limiter.wrap(async () => {
            return await client.get(`${USERS}/v1/users/${userId}`);
        });
        const response = await _resquest();
        return response.data;
    }
    catch (err) {
        console.error("Error fetching user info:", err);
        return null;
    }
}
//get user's RAP
export async function getUserRAP(userId) {
    let total = 0;
    let cursor = "";
    try {
        do {
            const _resquest = limiter.wrap(async () => {
                return await client.get(`${INVENTORY}/v1/users/${userId}/assets/collectibles?limit=100&cursor=${cursor}`);
            });
            const res = await _resquest();
            for (const item of res.data.data) {
                total += item.recentAveragePrice ?? 0;
            }
            cursor = res.data.nextPageCursor ?? "";
        } while (cursor);
    }
    catch (err) {
        if (err?.response?.status === 403) {
            console.log(`⚠️ Inventory private for userId ${userId}, RAP defaulting to 0`);
            return 0; // treat private inventory as 0 RAP
        }
        throw err;
    }
    console.log(`Total RAP for userId ${userId}: ${total}`);
    return total;
}
export async function getCurrentAvatarItems(userId) {
    try {
        const _resquest = limiter.wrap(async () => {
            return await client.get(`${AVATAR}/v1/users/${userId}/currently-wearing`);
        });
        const response = await _resquest();
        return response.data.assetIds;
    }
    catch (err) {
        console.error("Error fetching current avatar items:", err);
        return [];
    }
}
//decline join req
export async function declineJoinRequest(groupId, userId, csrfToken) {
    await client.delete(`${BASE}/v1/groups/${groupId}/join-requests/users/${userId}`, {
        headers: {
            "X-CSRF-Token": csrfToken
        }
    });
}
// accept join req
export async function acceptRequest(groupId, userId, csrfToken) {
    await client.post(`${BASE}/v1/groups/${groupId}/join-requests/users/${userId}`, {}, {
        headers: {
            "X-CSRF-Token": csrfToken
        }
    });
}
//# sourceMappingURL=robloxClient.js.map