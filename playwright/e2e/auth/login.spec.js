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
        const user = getUser()

        const responseCreate = await auth.createUser(user);
        expect(responseCreate.status()).toBe(201);
        //ação
        const response = await auth.login(user);
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

    test('it should not login with invalid credentials', async ({ request }) => {
        //preparação
        const user = getUser()

        const responseCreate = await auth.createUser(user);
        expect(responseCreate.status()).toBe(201);
        //ação
        const response = await auth.login({ ...user, password: '123456' });
        expect(response.status()).toBe(401);

        const body = await response.json();

        // const response = await login.auth({ email: '<EMAIL>', password: 'invalidpassword' });
        // expect(response.status()).toBe(401);

        // const responseBody = await response.json();
        expect(body).toHaveProperty('message', 'Credenciais inválidas')
    })
    
    test('the email field is not register', async () => {
        const user = {
            email: "nonexistent@example.com",
            password: "pwd123"
        }

        const response = await auth.login(user);
        expect(response.status()).toBe(401);

        const body = await response.json();

        expect(body).toHaveProperty('message', 'Credenciais inválidas')
    })

    test('the email field is required', async () => {
        const user = getUser()

        const responseCreate = await auth.createUser(user);
        expect(responseCreate.status()).toBe(201);

        const response = await auth.login({ password: user.password });
        expect(response.status()).toBe(400);

        const body = await response.json();

        expect(body).toHaveProperty('message', 'O campo \'Email\' é obrigatório')
    })

    test('the password field is required', async () => {
        const user = getUser()

        const responseCreate = await auth.createUser(user);
        expect(responseCreate.status()).toBe(201);

        const response = await auth.login({ email: user.email });
        expect(response.status()).toBe(400);

        const body = await response.json();

        expect(body).toHaveProperty('message', 'O campo \'Password\' é obrigatório')
    })

    test('it should not login with invalid email format', async () => {
        const user = {
            email: "invalidemailformat",
            password: "pwd123"
        }

        const response = await auth.login(user);
        expect(response.status()).toBe(400);

        const body = await response.json();

        expect(body).toHaveProperty('message', 'O campo \'Email\' deve ser um email válido')
    })
})