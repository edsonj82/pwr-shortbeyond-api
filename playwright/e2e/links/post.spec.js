// import { test, expect } from '@playwright/test';
import { test, expect } from '../../support/fixtures';

// import { authService } from '../../support/services/auth';
// import { linkService } from '../../support/services/links';

import { getUser } from '../../support/factories/user';
import { getLink } from '../../support/factories/link';

test.describe('POST /links', () => {

    const user = getUser()
    const link = getLink()

    // let authorization, links, token
    let token

    test.beforeEach(async ({ authorization }) => {
        // authorization = authService(request);
        // links = linkService(request);

        await authorization.createUser(user);
        await authorization.login(user);
        token = await authorization.getToken(user);
    });

    test('should create a new link successfully', async ({ links }) => {

        const response = await links.createLink(link, token);
        console.log('Response:', await response.json());
        expect(response.status()).toBe(201);

        const { data, message } = await response.json();
        expect(data).toHaveProperty('id')
        expect(data).toHaveProperty('original_url', link.original_url)
        expect(data).toHaveProperty('title', link.title)
        expect(data.short_code).toMatch(/^[a-zA-Z0-9]{5}$/);
        expect(message).toBe('Link criado com sucesso')
    })

    test('should not create a invalid link authentication', async ({ links }) => {

        const response = await links.createLink(link, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMDFLRUNDS1dQSk4zV0dXMjQ1Q0IxQlI3S0EiLCJleHAiOjE3Njc4ODEzNDAsImlhdCI6MTc2Nzc5NDk0MH0.UDm_6LWvYU0NSdU7KLO_rOLYZkBGoTCL3Lnprj-ANF3');
        expect(response.status()).toBe(401);

        const responseBody = await response.json();
        expect(responseBody).toHaveProperty('message', 'token signature is invalid: signature is invalid')
    })

    test('should not create without a link authentication', async ({ links }) => {

        const response = await links.createLink(link, '');
        expect(response.status()).toBe(401);

        const responseBody = await response.json();
        expect(responseBody).toHaveProperty('message', 'Use o formato: Bearer <token>')
    })

    test('the original_url field is required', async ({ links }) => {

        const link = {
            title: 'Link inválido'
        }

        const response = await links.createLink(link, token);
        expect(response.status()).toBe(400);

        const responseBody = await response.json();
        expect(responseBody).toHaveProperty('message', 'O campo \'OriginalURL\' é obrigatório')
    })

    test('the title field is required', async ({ links }) => {

        const link = {
            original_url: 'https://www.invalidlink.com'
        }

        const response = await links.createLink(link, token);
        expect(response.status()).toBe(400);

        const responseBody = await response.json();
        expect(responseBody).toHaveProperty('message', 'O campo \'Title\' é obrigatório')
    })

    test('should not create a link with invalid url', async ({ links }) => {

        const link = {
            original_url: 'invalid-url',
            title: 'Link inválido'
        }

        const response = await links.createLink(link, token);
        expect(response.status()).toBe(400);

        const responseBody = await response.json();
        expect(responseBody).toHaveProperty('message', 'O campo \'OriginalURL\' deve ser uma URL válida')
    })

    test('should not create a duplicate link', async ({ links }) => {

        const responseFirst = await links.createLink(link, token);
        expect(responseFirst.status()).toBe(201);

        console.log('First link created: ', await responseFirst.json());
        // console.log('link: ', link);

        const responseSecond = await links.createLink(link, token);
        console.log('Second link created: ', await responseSecond.json());
        // TODO: BUG - The API is allowing duplicate links for the same user
        expect(responseSecond.status()).toBe(400);

        const responseBody = await responseSecond.json();
        expect(responseBody).toHaveProperty('message', 'Já existe um link cadastrado com essa URL para este usuário.')
    })

    test('should create the same link for different users', async ({ authorization, links }) => {

        const user2 = getUser()
        await authorization.createUser(user2);
        const token2 = await authorization.getToken(user2);
        const responseUser1 = await links.createLink(link, token);
        expect(responseUser1.status()).toBe(201);
        console.log('User 1 link created: ', await responseUser1.json());

        const responseUser2 = await links.createLink(link, token2);
        expect(responseUser2.status()).toBe(201);
        console.log('User 2 link created: ', await responseUser2.json());
    })

    test('should generate unique short_code for each link', async ({ links }) => {

        const link1 = {
            original_url: 'https://www.unique-link1.com',
            title: 'Link Único 1'
        }
        const link2 = {
            original_url: 'https://www.unique-link2.com',
            title: 'Link Único 2'
        }
        const response1 = await links.createLink(link1, token);
        expect(response1.status()).toBe(201);
        const body1 = await response1.json();
        const response2 = await links.createLink(link2, token);
        expect(response2.status()).toBe(201);
        const body2 = await response2.json();
        expect(body1.data.short_code).not.toBe(body2.data.short_code);
    })

    // TODO: BUG - Adjust customShorCode with error in expected result
    // Error: Falha ao criar link: {"message":"O campo 'OriginalURL' é obrigatório"}
    test('should create link with custom short_code', async ({ links }) => {
        // const user = getUserWithLinks(0);

        // await authorization.createUser(user);
        // const token = await authorization.getToken(user);

        const customShortCode = 'abc12'
        const linkWithCustomCode = {
            original_url: 'https://www.custom-short-code.com',
            title: 'Link Customizado',
            short_code: customShortCode
        }
        const response = await links.createLink(linkWithCustomCode, token);
        expect(response.status()).toBe(201);
        const body = await response.json();
        expect(body.data.short_code).toBe(customShortCode);
    })
})  