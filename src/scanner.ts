import { getUserInfo, getUserRAP, getCurrentAvatarItems, getCatalogItemPrices } from "./robloxClient.js";
import { config } from "./config.js"

export type scanResult = {
    approved: boolean;
    reasons: string[];
};

export async function scanUser(userId: number, username: string): Promise<scanResult> {

    if (!userId || isNaN(userId)) {
        console.warn(`Invalid userId passed to scanUser: ${userId}`);
        return { approved: false, reasons: ["Invalid user ID"] };
    }

    const reasons: string[] = [];

    // account age
    const info = await getUserInfo(userId);

    if (!info) {
        console.warn(`No user info found for userId: ${userId}`);
        return { approved: false, reasons: ["User not found/Could not fetch info"] };
    }

    const createdAt = new Date(info.created);
    const ageDays = (Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24);

    if (ageDays < config.minAccountAgeDays) {
        reasons.push(`Account age (${ageDays}) is below minimum requirement of ${config.minAccountAgeDays} days, account is too new!`);
    }

    // blacklisted words
    const namesToCheck = [username.toLowerCase(), (info.displayName ?? "").toLowerCase()];
    const biosToCheck = [(info.description ?? "").toLowerCase().trim()];

    for (const name of namesToCheck) {
        for (const word of config.blacklistedWords) {
            if (name.includes(word)) {
                reasons.push(`Name "${name}" contains blacklisted word "${word}"`);
            }
        }
    }

    for (const bio of biosToCheck) {
        for (const word of config.blacklistedWords) {
            if (bio.includes(word)) {
                reasons.push(`Bio "${bio}" contains blacklisted word "${word}"`);
            }
        }
    }

    // check current avatar price
    const avatar = await getCurrentAvatarItems(userId);
    if (!avatar) {
        reasons.push(`Could not fetch current avatar items`);
    }
    const avatarItemsPrice = await getCatalogItemPrices(avatar);
    console.log(`Avatar items price for user ${userId}: ${avatarItemsPrice}`);

    if (avatarItemsPrice <= config.minAvatarValue) {
        reasons.push(`Avatar items price (${avatarItemsPrice}) is below minimum requirement of (${config.minAvatarValue})`);
    }

    // check RAP
    const rap = await getUserRAP(userId);

    if (rap === 100) {
        reasons.push(`User's inventory is empty or PRIVATED`);
    }

    if (rap <= config.minRapValue) {
        reasons.push(`RAP (${rap}) is below minimum (${config.minRapValue})`);
    }

    return {
        approved: reasons.length === 0,
        reasons
    };
}