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
        // TODO: BUG - The API is returning 401 instead of 400
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
})
