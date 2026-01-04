import { expect, test } from '@playwright/test';
import { getUser } from '../../support/factories/user';

test.describe('POST /auth', () => {
    test('it should register a new user successfully', async ({ request }) => {
        const user = getUser()

        const response = await request.post('http://localhost:3333/api/auth/register', {
            data: user
        })

        expect(response.status()).toBe(201);

        const responseBody = await response.json();

        expect(responseBody).toHaveProperty('message', 'Usuário cadastrado com sucesso!')
        expect(responseBody.user).toHaveProperty('id')
        expect(responseBody.user).toHaveProperty('name', user.name)
        expect(responseBody.user).toHaveProperty('email', user.email)
        expect(responseBody.user).not.toHaveProperty('password')
    })

    test('it should not register a duplicated user', async ({ request }) => {
        const user = getUser()

        const response = await request.post('http://localhost:3333/api/auth/register', {
            data: user
        })

        expect(response.status()).toBe(201);


        const responseDuplicate = await request.post('http://localhost:3333/api/auth/register', {
            data: user
        })

        expect(responseDuplicate.status()).toBe(400);

        const responseBody = await responseDuplicate.json();

        expect(responseBody).toHaveProperty('message', 'Este e-mail já está em uso. Por favor, tente outro.')
    })

    test('it should not register a invalid email', async ({ request }) => {
        const user = {
            name: 'Edson José dos Santos',
            email: 'edson&gmail.com',
            password: "pwd123"
        }

        const response = await request.post('http://localhost:3333/api/auth/register', {
            data: user
        })

        expect(response.status()).toBe(400);

        const responseBody = await response.json();

        expect(responseBody).toHaveProperty('message', 'O campo \'Email\' deve ser um email válido')
    })

    test('the name field is required', async ({ request }) => {
        const user = {
            email: 'edson@gmail.com',
            password: "pwd123"
        }

        const response = await request.post('http://localhost:3333/api/auth/register', {
            data: user
        })

        expect(response.status()).toBe(400);

        const responseBody = await response.json();

        expect(responseBody).toHaveProperty('message', 'O campo \'Name\' é obrigatório')
    })

    test('the email field is required', async ({ request }) => {
        const user = {
            name: 'Edson José dos Santos',
            password: "pwd123"
        }

        const response = await request.post('http://localhost:3333/api/auth/register', {
            data: user
        })

        expect(response.status()).toBe(400);

        const responseBody = await response.json();

        expect(responseBody).toHaveProperty('message', 'O campo \'Email\' é obrigatório')
    })

    test('the password field is required', async ({ request }) => {
        const user = {
            name: 'Edson José dos Santos',
            email: 'edson@gmail.com',
        }

        const response = await request.post('http://localhost:3333/api/auth/register', {
            data: user
        })

        expect(response.status()).toBe(400);

        const responseBody = await response.json();

        expect(responseBody).toHaveProperty('message', 'O campo \'Password\' é obrigatório')
    })
});