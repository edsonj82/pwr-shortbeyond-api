import { test, expect } from "../../support/fixtures";

import { getUserWithLinks } from "../../support/factories/link";


test.describe('DELETE /links/:id', () => {

    test('should delete a link successfully', async ({ authorization, links }) => {
        const user = getUserWithLinks()

        await authorization.createUser(user);
        const token = await authorization.getToken(user)
        const linkId = await links.getLinkId(user.links[0], token)

        const resonse = await links.removeLink(linkId, token)
        expect(resonse.status()).toBe(200);

        const body = await resonse.json();
        expect(body).toHaveProperty('message', 'Link excluído com sucesso')
    })

    test('should not delete a link that does not exist', async ({ authorization, links }) => {
        const user = getUserWithLinks()
        await authorization.createUser(user);
        const token = await authorization.getToken(user)

        const resonse = await links.removeLink('nonexistent-link-id', token)
        // TODO: BUG - The API is returning 400 instead of 401
        expect(resonse.status()).toBe(404);
        const body = await resonse.json();
        expect(body).toHaveProperty('message', 'Link não encontrado')
    })

    test('should not delete a link without authentication', async ({ links }) => {
        const resonse = await links.removeLink('some-link-id', '')
        expect(resonse.status()).toBe(401);
        const body = await resonse.json();
        expect(body).toHaveProperty('message', 'Use o formato: Bearer <token>')
    })

    test('should not delete a link with invalid authentication', async ({ links }) => {
        const resonse = await links.removeLink('some-link-id', 'invalid-token')
        expect(resonse.status()).toBe(401);
        const body = await resonse.json();
        // TODO: BUG - Adjust return message
        expect(body).toHaveProperty('message', 'token is malformed: token contains an invalid number of segments')
    })

    test('should not delete a link that belongs to another user', async ({ authorization, links }) => {
        const user1 = getUserWithLinks()
        const user2 = getUserWithLinks()
        await authorization.createUser(user1);
        await authorization.createUser(user2);
        const token2 = await authorization.getToken(user2)
        const linkId1 = await links.getLinkId(user1.links[0], token2)
        const resonse = await links.removeLink(linkId1, token2)
        // TODO: BUG - The API is allowing delete links of the another user
        // TODO: BUG - The API is returning 200 instead of 403
        expect(resonse.status()).toBe(403);
        const body = await resonse.json();
        expect(body).toHaveProperty('message', 'Você não tem permissão para excluir este link')
    })
    
})
