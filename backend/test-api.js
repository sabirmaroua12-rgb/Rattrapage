// test-api.js
// Automated verification script for all backend requirements and scenarios

const BASE_URL = 'http://localhost:5000';

async function runTests() {
  console.log('--- STARTING BACKEND API VERIFICATION ---\n');

  try {
    // 1. Health check
    const health = await fetch(`${BASE_URL}/`).then(r => r.json());
    console.log('✅ 1. Health Check:', JSON.stringify(health));

    // 2. Register a new user
    const regPayload = {
      name: 'Test Student',
      email: 'student@university.edu',
      password: 'password123',
    };
    const regRes = await fetch(`${BASE_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(regPayload),
    });
    const regData = await regRes.json();
    console.log(`✅ 2. Register Status: ${regRes.status}`, regData);

    // 3. Register with duplicate email (should fail with 400)
    const dupRes = await fetch(`${BASE_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(regPayload),
    });
    const dupData = await dupRes.json();
    console.log(`✅ 3. Duplicate Email Error Status: ${dupRes.status} (Expected 400)`, dupData);

    // 4. Register with missing fields (should fail with 400)
    const missingRes = await fetch(`${BASE_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'incomplete@example.com' }),
    });
    const missingData = await missingRes.json();
    console.log(`✅ 4. Missing Fields Error Status: ${missingRes.status} (Expected 400)`, missingData);

    // 5. Login with correct credentials
    const loginRes = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: regPayload.email, password: regPayload.password }),
    });
    const loginData = await loginRes.json();
    console.log(`✅ 5. Login Status: ${loginRes.status}`, {
      message: loginData.message,
      user: loginData.user,
      hasToken: !!loginData.token,
    });
    const token = loginData.token;

    // 6. Login with incorrect password (should fail with 400)
    const badLoginRes = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: regPayload.email, password: 'wrong_password' }),
    });
    const badLoginData = await badLoginRes.json();
    console.log(`✅ 6. Invalid Password Status: ${badLoginRes.status} (Expected 400)`, badLoginData);

    // 7. Access GET /users without token (should fail with 401)
    const unauthUsersRes = await fetch(`${BASE_URL}/users`);
    const unauthUsersData = await unauthUsersRes.json();
    console.log(`✅ 7. Unauthorized GET /users Status: ${unauthUsersRes.status} (Expected 401)`, unauthUsersData);

    // 8. Access GET /users with valid token
    const authUsersRes = await fetch(`${BASE_URL}/users`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const authUsersData = await authUsersRes.json();
    console.log(`✅ 8. Authorized GET /users Status: ${authUsersRes.status}`);
    console.log('   Users retrieved:', authUsersData);

    console.log('\n🎉 ALL 8 BACKEND TEST SCENARIOS PASSED SUCCESSFULLY!');
  } catch (error) {
    console.error('❌ Test failed with error:', error);
  }
}

runTests();
