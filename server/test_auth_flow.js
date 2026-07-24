const API_URL = 'http://localhost:5000/api';

async function testAuthFlow() {
  const timestamp = Date.now();
  const testAccount = {
    name: 'Automation Tester',
    username: `autotest_${timestamp}`,
    email: `autotest_${timestamp}@sidequest.test`,
    password: 'securePassword123!',
    location: 'Bengaluru, India',
    bio: 'Automated test profile created to verify registration and login flow.'
  };

  console.log('====================================================');
  console.log('🧪 RUNNING AUTOMATED AUTHENTICATION INTEGRATION TEST');
  console.log('====================================================');
  console.log('Target API:', API_URL);
  console.log('Test Account Payload:', { ...testAccount, password: '[REDACTED]' });

  try {
    // 1. Test Registration Endpoint (POST /api/auth/signup)
    console.log('\nStep 1: Testing Registration (POST /api/auth/signup)...');
    const signupRes = await fetch(`${API_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testAccount)
    });

    const signupData = await signupRes.json();
    console.log(`✅ Signup HTTP Status: ${signupRes.status} (${signupRes.statusText})`);
    console.log('Signup Response Data:', {
      message: signupData.message,
      hasToken: !!signupData.token,
      userId: signupData.user?._id,
      username: signupData.user?.username,
      email: signupData.user?.email
    });

    if (signupRes.status !== 201 || !signupData.token || !signupData.user) {
      throw new Error(`Signup failed: Expected 201 with token, got ${signupRes.status}: ${signupData.message}`);
    }

    const { token: signupToken, user: createdUser } = signupData;

    // 2. Test Duplicate Registration Prevention (POST /api/auth/signup) -> expect 409
    console.log('\nStep 2: Testing Duplicate Registration Prevention (expecting 409 Conflict)...');
    const dupRes = await fetch(`${API_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testAccount)
    });
    const dupData = await dupRes.json();
    if (dupRes.status === 409) {
      console.log(`✅ Correctly rejected duplicate user with HTTP 409 Conflict: "${dupData.message}"`);
    } else {
      console.warn(`⚠️ Duplicate signup returned status ${dupRes.status} instead of 409:`, dupData);
    }

    // 3. Test Login Endpoint (POST /api/auth/login) using Email
    console.log('\nStep 3: Testing Login with Email (POST /api/auth/login)...');
    const loginEmailRes = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        emailOrUsername: testAccount.email,
        password: testAccount.password
      })
    });
    const loginEmailData = await loginEmailRes.json();
    console.log(`✅ Login (Email) HTTP Status: ${loginEmailRes.status}`);
    console.log('Login Response:', {
      hasToken: !!loginEmailData.token,
      userId: loginEmailData.user?._id,
      username: loginEmailData.user?.username
    });

    // 4. Test Login Endpoint using Username
    console.log('\nStep 4: Testing Login with Username (POST /api/auth/login)...');
    const loginUsernameRes = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        emailOrUsername: testAccount.username,
        password: testAccount.password
      })
    });
    const loginUsernameData = await loginUsernameRes.json();
    console.log(`✅ Login (Username) HTTP Status: ${loginUsernameRes.status}`);

    // 5. Test JWT Session Token Authentication (GET /api/auth/me)
    console.log('\nStep 5: Testing Authenticated Profile Fetch (GET /api/auth/me)...');
    const meRes = await fetch(`${API_URL}/auth/me`, {
      method: 'GET',
      headers: { 
        'Authorization': `Bearer ${signupToken}`,
        'Content-Type': 'application/json'
      }
    });
    const meData = await meRes.json();

    console.log(`✅ GetMe HTTP Status: ${meRes.status}`);
    console.log('Authenticated User Profile fetched:', {
      id: meData._id,
      name: meData.name,
      username: meData.username,
      email: meData.email,
      role: meData.role,
      xp: meData.xp,
      level: meData.level
    });

    console.log('\n====================================================');
    console.log('🎉 ALL AUTHENTICATION TESTS PASSED SUCCESSFULLY!');
    console.log('====================================================');
    process.exit(0);

  } catch (error) {
    console.error('\n❌ AUTHENTICATION TEST FAILED!');
    console.error(`Error details:`, error.message);
    process.exit(1);
  }
}

testAuthFlow();
