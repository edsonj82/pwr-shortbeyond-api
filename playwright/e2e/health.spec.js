// @ts-check
import { test, expect } from '@playwright/test';
import { request } from 'node:http';

test('it should verify api online', async ({ request }) => {

  const response = await request.get('http://localhost:3333/health')
  expect(response.status()).toBe(200);

  const body = await response.json();
  expect(body.service).toBe('shortbeyond-api');
  expect(body.status).toBe('healthy');
});

