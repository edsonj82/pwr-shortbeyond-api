import { test, expect } from '@playwright/test';
import { getUser } from '../../support/factories/user';
import { linkService } from '../../support/services/link';
import { authService } from '../../support/services/auth';
import { getLink } from '../../support/factories/link';

test.describe('POST /links', () => {

    test('should create a new link successfully', async ({ request }) => {

        const user = getUser()
        const link = getLink()

        const authorization = authService(request);
        const links = linkService(request);


        const responseCreate = await authorization.createUser(user);
        expect(responseCreate.status()).toBe(201);

        const loginResponse = await authorization.login(user);
        expect(loginResponse.status()).toBe(200);

        // const token = await authService.getToken(user);
        // const loginBody = await loginResponse.json(user);
        // const token = loginBody.data.token;

        const token = await authorization.getToken(user);

        const response = await links.createLink(link, token);
        expect(response.status()).toBe(201);

        const { data, message } = await response.json();

        expect(data).toHaveProperty('id')
        expect(data).toHaveProperty('original_url', link.original_url)
        expect(data).toHaveProperty('title', link.title)
        expect(data.short_code).toMatch(/^[a-zA-Z0-9]{5}$/);
        expect(message).toBe('Link criado com sucesso')
    })

    test('should not create a invalid link authentication', async ({ request }) => {

        const link = getLink()
        const links = linkService(request);

        const response = await links.createLink(link, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMDFLRUNDS1dQSk4zV0dXMjQ1Q0IxQlI3S0EiLCJleHAiOjE3Njc4ODEzNDAsImlhdCI6MTc2Nzc5NDk0MH0.UDm_6LWvYU0NSdU7KLO_rOLYZkBGoTCL3Lnprj-ANF3');
        expect(response.status()).toBe(401);

        const responseBody = await response.json();
        expect(responseBody).toHaveProperty('message', 'token signature is invalid: signature is invalid')
    })

    test('should not create without a link authentication', async ({ request }) => {

        const link = getLink()
        const links = linkService(request);

        const response = await links.createLink(link, '');
        expect(response.status()).toBe(401);

        const responseBody = await response.json();
        expect(responseBody).toHaveProperty('message', 'Use o formato: Bearer <token>')
    })
})