import { test, expect } from '../../support/fixtures';
import { getUserWithLinks } from '../../support/factories/link';

test.describe('GET /links/', () => {

    test('should return a list of links', async ({ authorization, links }) => {
        const user = getUserWithLinks()

        await authorization.createUser(user);
        const token = await authorization.getToken(user);

        // console.log('User Token:', token);
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
    })

    test('should return a empty list of links', async ({ authorization, links }) => {
        const user = getUserWithLinks(0)

        await authorization.createUser(user);
        const token = await authorization.getToken(user);

        const response = await links.getLinks(token)
        expect(response.status()).toBe(200);

        const body = await response.json();
        expect(body.message).toBe('Links Encurtados');
        expect(body.count).toBe(0);
        expect(Array.isArray(body.data)).toBeTruthy();
        expect(body.data.length).toBe(0);
    })

    test('should not get links without authentication', async ({ links }) => {
        const response = await links.getLinks('');
        expect(response.status()).toBe(401);
        const body = await response.json();
        expect(body).toHaveProperty('message', 'Use o formato: Bearer <token>');
    })

    test('should not get links with invalid authentication', async ({ links }) => {
        const response = await links.getLinks('invalid-token');
        expect(response.status()).toBe(401);
        const body = await response.json();
        //TODO: BUG - Adjust return message
        expect(body).toHaveProperty('message', 'Token inválido');
    })

    test('should return empty list when user has no links', async ({ authorization, links }) => {
        const user = getUserWithLinks(0)

        await authorization.createUser(user);
        const token = await authorization.getToken(user);

        const response = await links.getLinks(token)
        expect(response.status()).toBe(200);

        const body = await response.json();
        // console.log(body);
        expect(body.message).toBe('Links Encurtados');
        expect(body.count).toBe(0);
        expect(Array.isArray(body.data)).toBeTruthy();
        expect(body.data.length).toBe(0);
    })

    test('should return links specific to each user', async ({ authorization, links }) => {
        const user1 = getUserWithLinks(3);
        const user2 = getUserWithLinks(2);
        await authorization.createUser(user1);
        await authorization.createUser(user2);
        const token1 = await authorization.getToken(user1);
        const token2 = await authorization.getToken(user2);
        for (const link of user1.links) {
            await links.createLink(link, token1);
        }
        for (const link of user2.links) {
            await links.createLink(link, token2);
        }
        const response1 = await links.getLinks(token1);
        expect(response1.status()).toBe(200);
        const body1 = await response1.json();
        expect(body1.count).toBe(user1.links.length);
        const response2 = await links.getLinks(token2);
        expect(response2.status()).toBe(200);
        const body2 = await response2.json();
        expect(body2.count).toBe(user2.links.length);
    })
})