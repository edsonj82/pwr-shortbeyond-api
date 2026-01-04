import { expect, test } from '@playwright/test';

test.describe('POST /auth', () => {
    test('should register a new user successfully', async ({ request }) => {
        const user = {
            name: "Edson José dos Santos",
            email: "edson.jose@email.com",
            password: "pwd123"
        }

        const response = await request.post('http://localhost:3333/api/auth/register', {
            data: user
        })

        expect(response.status()).toBe(201);

        const responseBody = await response.json();

        expect(responseBody).toHaveProperty('message','Usuário cadastrado com sucesso!')
        expect(responseBody.user).toHaveProperty('id')
        expect(responseBody.user).toHaveProperty('name',user.name)
        expect(responseBody.user).toHaveProperty('email',user.email)
        expect(responseBody.user).not.toHaveProperty('password') 
    })
});

