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

        const response = await links.getLinks(token)
        expect(response.status()).toBe(200);

        const body = await response.json();
        expect(body.message).toBe('Links Encurtados');
        expect(body.count).toBe(user.links.length);
        expect(Array.isArray(body.data)).toBeTruthy();

        for (const [index, link] of body.data.entries()) {
            expect(link).toHaveProperty('id');
            expect(link).toHaveProperty('original_url'), user.links[index].original_url;
            expect(link).toHaveProperty('short_code');
            expect(link).toHaveProperty('title'), user.links[index].title;

            expect(link.short_code).toMatch(/^[a-zA-Z0-9]{5}$/);    

        }
    });
})