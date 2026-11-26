import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import { createServer } from 'node:http';
import { createWebHost } from '../src/host/webHost.ts';

let server;
let originalBaseUrl;

before(async () => {
  originalBaseUrl = process.env.NEXT_PUBLIC_MODU_API_BASE_URL;
  server = createServer(async (request, response) => {
    const chunks = [];
    for await (const chunk of request) chunks.push(chunk);
    if (request.url === '/api/resource/204' || request.url === '/api/resource/205') {
      response.writeHead(Number(request.url.slice(-3)));
      response.end();
      return;
    }
    if (request.url === '/api/error') {
      response.writeHead(403, { 'content-type': 'application/json' });
      response.end(JSON.stringify({ error: 'denied' }));
      return;
    }
    response.writeHead(200, { 'content-type': 'application/json' });
    response.end(JSON.stringify({ method: request.method, body: Buffer.concat(chunks).toString(), model: 'demo-model' }));
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  process.env.NEXT_PUBLIC_MODU_API_BASE_URL = `http://127.0.0.1:${server.address().port}/api`;
});

after(async () => {
  if (originalBaseUrl === undefined) delete process.env.NEXT_PUBLIC_MODU_API_BASE_URL;
  else process.env.NEXT_PUBLIC_MODU_API_BASE_URL = originalBaseUrl;
  server.closeAllConnections();
  await new Promise(resolve => server.close(resolve));
});

for (const status of [204, 205]) {
  test(`DELETE succeeds when the API returns ${status} without JSON`, async () => {
    const host = createWebHost();
    const result = await host.apiClient.request({ method: 'DELETE', path: `/resource/${status}` });
    assert.equal(result, undefined);
  });
}

test('successful JSON responses retain their payload', async () => {
  const result = await createWebHost().apiClient.request({ method: 'GET', path: '/models' });
  assert.deepEqual(result, { method: 'GET', body: '', model: 'demo-model' });
});

test('JSON request bodies still reach the server', async () => {
  const result = await createWebHost().apiClient.request({ method: 'POST', path: '/models', body: { name: 'demo' } });
  assert.deepEqual(result, { method: 'POST', body: '{"name":"demo"}', model: 'demo-model' });
});

test('HTTP failures remain failures', async () => {
  await assert.rejects(createWebHost().apiClient.request({ method: 'DELETE', path: '/error' }), /HTTP 403/);
});
