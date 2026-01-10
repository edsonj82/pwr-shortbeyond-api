// import { expect, test } from '@playwright/test';
import { expect, test } from '../../support/fixtures';

import { getUser } from '../../support/factories/user';
// import { authService } from '../../support/services/auth';

test.describe('POST /auth/register', () => {

    // let auth
    // test.beforeEach(async ({ request }) => {
    //     auth = authService(request);
    // });

    test('it should register a new user successfully', async ({ authorization }) => {

        //preparação
        const user = getUser()
        //ação
        const response = await authorization.createUser(user);
        //resultado esperado
        expect(response.status()).toBe(201);

        const responseBody = await response.json();
        expect(responseBody).toHaveProperty('message', 'Usuário cadastrado com sucesso!')
        expect(responseBody.user).toHaveProperty('id')
        expect(responseBody.user).toHaveProperty('name', user.name)
        expect(responseBody.user).toHaveProperty('email', user.email)
        expect(responseBody.user).not.toHaveProperty('password')
    })

    test('it should not register a duplicated user', async ({ authorization }) => {

        const user = getUser()
        const response = await authorization.createUser(user);
        expect(response.status()).toBe(201);

        const responseDuplicate = await authorization.createUser(user);
        expect(responseDuplicate.status()).toBe(400);

        const responseBody = await responseDuplicate.json();
        expect(responseBody).toHaveProperty('message', 'Este e-mail já está em uso. Por favor, tente outro.')
    })

    test('it should not register a invalid email', async ({ authorization }) => {

        const user = {
            name: 'Edson José dos Santos',
            email: 'edson&gmail.com',
            password: "pwd123"
        }

        const response = await authorization.createUser(user);
        expect(response.status()).toBe(400);

        const responseBody = await response.json();
        expect(responseBody).toHaveProperty('message', 'O campo \'Email\' deve ser um email válido')
    })

    test('the name field is required', async ({ authorization }) => {

        const user = {
            email: 'edson@gmail.com',
            password: "pwd123"
        }

        const response = await authorization.createUser(user);
        expect(response.status()).toBe(400);

        const responseBody = await response.json();
        expect(responseBody).toHaveProperty('message', 'O campo \'Name\' é obrigatório')
    })

    test('the email field is required', async ({ authorization }) => {

        const user = {
            name: 'Edson José dos Santos',
            password: "pwd123"
        }

        const response = await authorization.createUser(user);
        expect(response.status()).toBe(400);

        const responseBody = await response.json();
        expect(responseBody).toHaveProperty('message', 'O campo \'Email\' é obrigatório')
    })

    test('the password field is required', async ({ authorization }) => {

        const user = {
            name: 'Edson José dos Santos',
            email: 'edson@gmail.com',
        }

        const response = await authorization.createUser(user);
        expect(response.status()).toBe(400);

        const responseBody = await response.json();
        expect(responseBody).toHaveProperty('message', 'O campo \'Password\' é obrigatório')
    })
});