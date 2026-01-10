// import { expect, test } from '@playwright/test';
import { expect, test } from '../../support/fixtures';
import { getUser } from '../../support/factories/user';
// import { authService } from '../../support/services/auth';

test.describe('POST /auth/login', () => {

    const user = getUser()

    // let auth
    // test.beforeEach(async ({ request }) => {
    //     auth = authService(request);
    // });

    test('it should login successfully with valid credentials', async ({ authorization }) => {
        //preparação
        // const user = getUser()

        const responseCreate = await authorization.createUser(user);
        expect(responseCreate.status()).toBe(201);
        //ação
        const response = await authorization.login(user);
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

    test('it should not login with invalid credentials', async ({ authorization }) => {
        //preparação
        // const user = getUser()

        const responseCreate = await authorization.createUser(user);
        expect(responseCreate.status()).toBe(201);
        //ação
        const response = await authorization.login({ ...user, password: '123456' });
        expect(response.status()).toBe(401);

        const body = await response.json();

        // const response = await login.auth({ email: '<EMAIL>', password: 'invalidpassword' });
        // expect(response.status()).toBe(401);

        // const responseBody = await response.json();
        expect(body).toHaveProperty('message', 'Credenciais inválidas')
    })

    test('the email field is not register', async ({authorization}) => {
        const user = {
            email: "nonexistent@example.com",
            password: "pwd123"
        }

        const response = await authorization.login(user);
        expect(response.status()).toBe(401);

        const body = await response.json();

        expect(body).toHaveProperty('message', 'Credenciais inválidas')
    })

    test('the email field is required', async ({authorization}) => {
        // const user = getUser()

        const responseCreate = await authorization.createUser(user);
        expect(responseCreate.status()).toBe(201);

        const response = await authorization.login({ password: user.password });
        expect(response.status()).toBe(400);

        const body = await response.json();

        expect(body).toHaveProperty('message', 'O campo \'Email\' é obrigatório')
    })

    test('the password field is required', async ({authorization}) => {
        // const user = getUser()

        const responseCreate = await authorization.createUser(user);
        expect(responseCreate.status()).toBe(201);

        const response = await authorization.login({ email: user.email });
        expect(response.status()).toBe(400);

        const body = await response.json();

        expect(body).toHaveProperty('message', 'O campo \'Password\' é obrigatório')
    })

    test('it should not login with invalid email format', async ({authorization}) => {
        const user = {
            email: "invalidemailformat",
            password: "pwd123"
        }

        const response = await authorization.login(user);
        expect(response.status()).toBe(400);

        const body = await response.json();

        expect(body).toHaveProperty('message', 'O campo \'Email\' deve ser um email válido')
    })

    test('it should not login with short password', async ({authorization}) => {
        // const user = getUser()

        const responseCreate = await authorization.createUser(user);
        expect(responseCreate.status()).toBe(201);

        const response = await authorization.login({ email: user.email, password: '123' });
        // TODO: BUG - The API is returning 401 instead of 400
        expect(response.status()).toBe(400);

        const body = await response.json();

        expect(body).toHaveProperty('message', 'O campo \'Password\' deve ter no mínimo 6 caracteres')
    })

    test('it should not login with long password', async ({authorization}) => {
        // FIX: Refactor to use getUser factory with password length option
        const user = getUser()

        const responseCreate = await authorization.createUser(user);
        expect(responseCreate.status()).toBe(201);

        const longPassword = 'a'.repeat(65); // 65 characters

        const response = await authorization.login({ email: user.email, password: longPassword });
        // TODO: BUG - The API is returning 401 instead of 400
        expect(response.status()).toBe(400);

        const body = await response.json();

        expect(body).toHaveProperty('message', 'O campo \'Password\' deve ter no máximo 64 caracteres')
    })

    test('it should not login unregistered user', async ({authorization}) => {
        // const user = getUser()

        const response = await authorization.login(user);
        expect(response.status()).toBe(401);

        const body = await response.json();

        expect(body).toHaveProperty('message', 'Credenciais inválidas')
    })
})