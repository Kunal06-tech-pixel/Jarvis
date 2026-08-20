import fetch from 'node-fetch';

async function testAuth() {
  const loginRes = await fetch('http://localhost:3001/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'demo@jarvis.app', password: 'demo1234' })
  });
  const loginData = await loginRes.json();
  console.log('Login Response:', loginData);
  
  if (!loginData.token) {
    console.error('No token received');
    return;
  }
  
  const token = loginData.token;
  console.log('Token received:', token.substring(0, 20) + '...');
  
  const analyticsRes = await fetch('http://localhost:3001/api/analytics', {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  
  console.log('Analytics Response Status:', analyticsRes.status);
  const analyticsData = await analyticsRes.json();
  console.log('Analytics Data:', analyticsData);
}

testAuth();
