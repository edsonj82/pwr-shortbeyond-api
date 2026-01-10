import { test as baseTest, expect } from "@playwright/test";

import { authService } from "../services/auth";
import { linkService } from "../services/links";

const test = baseTest.extend({
    authorization: async ({ request }, use) => {
        const auth = authService(request);
        await use(auth);
    },
    links: async ({ request }, use) => {
        const links = linkService(request);
        await use(links);
    }
});

export { test, expect };        
