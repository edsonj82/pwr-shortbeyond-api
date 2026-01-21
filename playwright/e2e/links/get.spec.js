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
})