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

    test('should return 401 when using expired token', async ({ authorization, links }) => {
        const user = getUserWithLinks()
        await authorization.createUser(user);
        const token = await authorization.getToken(user);

        // Simulate an expired token (this is just an example, actual implementation may vary)
        const expiredToken = token.split('.').map(() => 'expired').join('.');
        const response = await links.getLinks(expiredToken);
        expect(response.status()).toBe(401);
        const body = await response.json();
        //TODO: BUG - Adjust return message
        expect(body).toHaveProperty('message', 'Token expirado');
    })

    test('should return empty list when user has no links', async ({ authorization, links }) => {
        const user1 = getUserWithLinks()
        const user2 = getUserWithLinks()

        await authorization.createUser(user1);
        await authorization.createUser(user2);
        const token1 = await authorization.getToken(user1);
        const token2 = await authorization.getToken(user2);
        
        const response = await links.getLinks(token2);
        
        expect(response.status()).toBe(200);
        const body = await response.json();
        expect(body.count).toBe(0);
        expect(Array.isArray(body.data)).toBeTruthy();
        expect(body.data.length).toBe(0);
    })
})