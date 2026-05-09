import "dotenv/config";
import { config } from "./config.js";
import { getPendingJoinRequests, getCsrfToken, acceptRequest, declineJoinRequest } from "./robloxClient.js";
import { scanUser } from "./scanner.js";
import Bottleneck from "bottleneck";
const limiter = new Bottleneck({
    minTime: 250, // Minimum time between requests (in ms)
    maxConcurrent: 1
});
async function processRequests(retries = 3) {
    const csrfToken = await getCsrfToken();
    const requests = await getPendingJoinRequests(config.groupId);
    if (!requests || requests.length === 0) {
        return;
    }
    try {
        await Promise.all(requests.map(async (request) => {
            const { userId, username } = request;
            const { approved, reasons } = await scanUser(userId, username);
            if (approved) {
                limiter.wrap(async () => {
                    await acceptRequest(config.groupId, userId, csrfToken);
                    console.log(`[${new Date().toISOString()}]: Accepted join request from ${username}`);
                })();
            }
            else {
                limiter.wrap(async () => {
                    await declineJoinRequest(config.groupId, userId, csrfToken);
                    console.log(`[${new Date().toISOString()}]: Declined join request from ${username}. Reasons: ${reasons.join(", ")}`);
                })();
            }
        }));
    }
    catch (error) {
        if (error.response?.status === 429 && retries > 0) {
            await new Promise(resolve => setTimeout(resolve, 1000));
            return processRequests(retries - 1);
        }
        console.error(`[${new Date().toISOString()}]: Error processing join requests:`, error);
        throw error;
    }
}
// polling loop
(async () => {
    console.log(`[${new Date().toISOString()}]: group monitor started`);
    await processRequests();
    setInterval(processRequests, config.pollIntervalMs);
})();
//# sourceMappingURL=index.js.map