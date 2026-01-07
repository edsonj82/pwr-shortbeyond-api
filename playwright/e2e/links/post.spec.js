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
})
