const http = require('http');

const endpoints = [
  '/agent',
  '/api/agent',
  '/chat/agent',
  '/api/chat/agent',
  '/message',
  '/api/message',
  '/api/chat',
  '/chat'
];

async function testEndpoints() {
  for (const path of endpoints) {
    console.log(`Testing POST http://127.0.0.1:18789${path}...`);
    try {
      const resp = await fetch(`http://127.0.0.1:18789${path}`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': 'Bearer testtoken123'
        },
        body: JSON.stringify({ message: 'ping', text: 'ping' })
      });
      const text = await resp.text();
      console.log(`[${resp.status}] Response: ${text.substring(0, 100)}`);
    } catch (err) {
      console.log(`Failed: ${err.message}`);
    }
  }
}

testEndpoints();
