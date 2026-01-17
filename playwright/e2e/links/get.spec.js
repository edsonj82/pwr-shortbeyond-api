import { test, expect } from '../../support/fixtures';
import { getUserWithLinks } from '../../support/factories/link';

test.describe('GET /links/', () => {

    test('should return a list of links', async ({ authorization, links }) => {

        const user = getUserWithLinks()

        await authorization.createUser(user);
        const token = await authorization.getToken(user);

        console.log('User Token:', token);

        for (const link of user.links) {
            // console.log('Creating link:', link);
            await links.createLink(link, token);
        }

    });
})

