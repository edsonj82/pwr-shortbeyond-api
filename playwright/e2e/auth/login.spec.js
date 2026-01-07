import { expect, test } from '@playwright/test';
import { getUser } from '../../support/factories/user';
import { authService } from '../../support/services/auth';

test.describe('POST /auth/login', () => {

    let auth
    test.beforeEach(async ({ request }) => {
        auth = authService(request);
    });

    test('it should login successfully with valid credentials', async ({ request }) => {

        //preparação
        // const user = getUser()
        // await request.post('http://localhost:3333/api/auth/login', { data: user });
        const user = {
            name: 'Edson José dos Santos',
            email: 'edson.jose@email.com',
            password: 'pwd123'
        };

        //ação
        const response = await auth.login(user);

        // //ação
        // const response = await login.auth({ email: user.email, password: user.password });

        // //resultado esperado
        expect(response.status()).toBe(200);

        const body = await response.json();
        expect(body).toHaveProperty('message', 'Login realizado com sucesso')
        expect(body.data).toHaveProperty('token')
        expect(body.data).toHaveProperty('user')
        expect(body.data.user).toHaveProperty('id')
        expect(body.data.user).toHaveProperty('name', user.name)
        expect(body.data.user).toHaveProperty('email', user.email)
        expect(body.data.user).not.toHaveProperty('password')   
    })

    // test('it should not login with invalid credentials', async ({ request }) => {

    //     const response = await login.auth({ email: '<EMAIL>', password: 'invalidpassword' });
    //     expect(response.status()).toBe(401);

    //     const responseBody = await response.json();
    //     expect(responseBody).toHaveProperty('message', 'Credenciais inválidas.')
    // })
})      