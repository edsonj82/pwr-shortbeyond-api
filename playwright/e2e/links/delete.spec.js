import { test, expect } from "../../support/fixtures";

import { getUserWithLinks } from "../../support/factories/link";
import { text } from "node:stream/consumers";
import { generateUUID } from "../../support/utils";


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

    test('should not delete when does not exist a id', async ({ authorization, links }) => {
        const user = getUserWithLinks()

        await authorization.createUser(user);
        const token = await authorization.getToken(user)
        const linkId = generateUUID();

        const resonse = await links.removeLink(linkId, token)
        // TODO: BUG - The API is returning 400 instead of 404
        expect(resonse.status()).toBe(404);

        const body = await resonse.json();
        expect(body).toHaveProperty('message', 'Link não encontrado')
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

    test('the id field is required', async ({ authorization, links }) => {
        const user = getUserWithLinks()
        await authorization.createUser(user);
        const token = await authorization.getToken(user)
        const resonse = await links.removeLink('', token)
        // TODO: BUG - The API is returning 404 instead of 400
        expect(resonse.status()).toBe(400);
        const body = await resonse.json();
        expect(body).toHaveProperty('message', 'O campo \'id\' é obrigatório')
    })

    test('should not delete a link with invalid id format', async ({ authorization, links }) => {
        const user = getUserWithLinks()
        await authorization.createUser(user);
        const token = await authorization.getToken(user)
        const resonse = await links.removeLink('invalid-id-format', token)
        expect(resonse.status()).toBe(400);
        const body = await resonse.json();
        console.log(body);
        // TODO: BUG - Message is not correct
        expect(body).toHaveProperty('message', 'O campo \'id\' é obrigatório')
    })

    test('should not delete a link when token is expired', async ({ authorization, links }) => {
        const user = getUserWithLinks()
        await authorization.createUser(user);

        const token = await authorization.getToken(user)
        const linkId = await links.getLinkId(user.links[0], token)

        const tokenExpirated = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMDFLRjRIS0FZNDE3WTZYNzdaSkhLOEhaOUEiLCJleHAiOjE3Njg2OTE4NjYsImlhdCI6MTc2ODYwNTQ2Nn0.Oax4Qetr6oD4jcH4vkSyqoWpSwmvy_LEFL4cOYNO5bs'

        const resonse = await links.removeLink(linkId, tokenExpirated)
        expect(resonse.status()).toBe(401);
        const body = await resonse.json();
        expect(body).toHaveProperty('message', 'token has invalid claims: token is expired')
    })

    test('should not delete a link when token is for a non-existent user', async ({ authorization, links }) => {
        const user = getUserWithLinks()
        await authorization.createUser(user);
        const token = await authorization.getToken(user)
        const linkId = await links.getLinkId(user.links[0], token)
        const tokenNonExistentUser = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiTm9FdmVyRXhpc3RlbnRVc2VySWQiLCJleHAiOjE3Njg2OTE4NjYsImlhdCI6MTc2ODYwNTQ2Nn0.DQw4w9WgXcQ-nu5l0k5hX5Y0bXr6I8o5Z4v5vV5Y5Y5Y'
        const resonse = await links.removeLink(linkId, tokenNonExistentUser)
        expect(resonse.status()).toBe(401);
        const body = await resonse.json();
        console.log(body);
        // TODO: BUG - Message is not correct
        expect(body).toHaveProperty('message', 'Usuário não encontrado')
    })



    // test('should handle server errors gracefully', async ({ authorization, links }) => {
    //     const user = getUserWithLinks()
    //     await authorization.createUser(user);
    //     const token = await authorization.getToken(user)
    //     const linkId = await links.getLinkId(user.links[0], token)

    //     // Simulate server error by providing an invalid URL in the linkService
    //     links.baseURL = 'http://localhost:3333/invalid-endpoint';

    //     console.log('linksError: ' + links);
    //     const response = await links.removeLink(linkId, token)
    //     console.log('status: ' + response.json());
    //     expect(response.status()).toBe(500);
    //     const body = await response.json();
    //     expect(body).toHaveProperty('message', 'Erro interno do servidor')
    // })

})  