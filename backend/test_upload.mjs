import fetch from 'node-fetch';

async function testUpload() {
  console.log('Sending JSON to backend...');
  
  try {
    const response = await fetch('http://localhost:3001/api/process-orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        orders: [
          { customer: 'Test Corp', items: '2x Servers', date: '2026-03-17' }
        ]
      })
    });
    
    if (!response.ok) {
      console.error('HTTP Error:', response.status, response.statusText);
      const text = await response.text();
      console.error('Response text:', text);
      return;
    }

    const data = await response.json();
    console.log('Success! Backend responded with:');
    console.log(JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error during fetch:', error);
  }
}

testUpload();
