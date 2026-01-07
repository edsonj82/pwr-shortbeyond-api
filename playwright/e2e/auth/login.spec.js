import { expect, test } from '@playwright/test';
import { getUser } from '../../support/factories/user';
import { loginService } from '../../support/services/login';

test.describe('POST /auth/login', () => {

    let login
    test.beforeEach(async ({ request }) => {
        login = loginService(request);
    });

    test('it should login successfully with valid credentials', async ({ request }) => {

        //preparação
        // const user = getUser()
        // await request.post('http://localhost:3333/api/auth/login', { data: user });
        const user = {
            name: 'dson José dos Santos',
            email: 'edson.jose@email.com',
            password: 'pwd123'
        };

        //ação
        const response = await login.auth(user);

        // //ação
        // const response = await login.auth({ email: user.email, password: user.password });

        // //resultado esperado
        expect(response.status()).toBe(200);

        // const responseBody = await response.json();
        // expect(responseBody).toHaveProperty('token')
    })

    test('it should not login with invalid credentials', async ({ request }) => {

        const response = await login.auth({ email: '<EMAIL>', password: 'invalidpassword' });
        expect(response.status()).toBe(401);

        const responseBody = await response.json();
        expect(responseBody).toHaveProperty('message', 'Credenciais inválidas.')
    })
})      