import * as fs from "fs";
var blacklistedWordsFile = "./src/settings/blacklisted_words.txt";
const blacklistedWords = fs.readFileSync(blacklistedWordsFile, "utf-8").split("\n").map((word) => word.trim()).filter((word) => word.length > 0);
export const config = {
    groupId: 35118274,
    pollIntervalMs: 30000, // 1000ms = 1s
    minAccountAgeDays: 30,
    minRapValue: 0,
    minAvatarValue: 100,
    blacklistedWords: blacklistedWords,
    cookie: process.env.ROBLOX_COOKIE ?? ""
};
//# sourceMappingURL=config.js.map