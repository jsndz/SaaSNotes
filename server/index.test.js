const axios2 = require("axios");

const axios = {
  post: async (...args) => {
    try {
      const res = await axios2.post(...args);
      return res;
    } catch (error) {
      return error.response;
    }
  },
};

const SERVER_URL = "http://localhost:3001"; 
describe("Authentication - Login", () => {
  let testUser = null;
  const password = "qwerty123";

  beforeAll(async () => {
    const email = `user${Math.random()}@test.com`;
    const tenantName = "Test Tenant " + Math.floor(Math.random() * 10000);
  
    // 1. Create tenant using API
    const tenantRes = await axios.post(`${SERVER_URL}/api/v1/tenants`, {
      name: tenantName,
      slug: tenantName.toLowerCase().replace(/\s+/g, "-"),
      subscription: "free"
    });
  
    expect(tenantRes.status).toBe(201);
    const tenant = tenantRes.data.data;
  
    // 2. Create user using API
    const userRes = await axios.post(`${SERVER_URL}/api/v1/users`, {
      email,
      password,
      role: "USER",
      tenantId: tenant.id
    });
  
    expect(userRes.status).toBe(201);
    const user = userRes.data.data;
  
    // Save for tests
    testUser = {
      id: user.id,
      email: user.email,
      password, // plain text for login
      tenantId: tenant.id
    };
  });
  

  test("fails if email or password is missing", async () => {
    const res = await axios.post(`${SERVER_URL}/api/v1/auth/login`, {});
    expect(res.status).toBe(400);
    expect(res.data.success).toBe(false);
    expect(res.data.message).toBe('Email and password are required');
  });

  test("fails if email is missing", async () => {
    const res = await axios.post(`${SERVER_URL}/api/v1/auth/login`, {
      password: "somepassword"
    });
    expect(res.status).toBe(400);
    expect(res.data.success).toBe(false);
    expect(res.data.message).toBe('Email and password are required');
  });

  test("fails if password is missing", async () => {
    const res = await axios.post(`${SERVER_URL}/api/v1/auth/login`, {
      email: "test@example.com"
    });
    expect(res.status).toBe(400);
    expect(res.data.success).toBe(false);
    expect(res.data.message).toBe('Email and password are required');
  });

  test("fails with invalid email (user not found)", async () => {
    const res = await axios.post(`${SERVER_URL}/api/v1/auth/login`, {
      email: "nonexistent@example.com",
      password: "somepassword"
    });
    expect(res.status).toBe(401);
    expect(res.data.success).toBe(false);
    expect(res.data.message).toBe('Invalid credentials');
  });

  test("fails with invalid password", async () => {
    const res = await axios.post(`${SERVER_URL}/api/v1/auth/login`, {
      email: testUser.email,
      password: "wrongpassword"
    });
    expect(res.status).toBe(401);
    expect(res.data.success).toBe(false);
    expect(res.data.message).toBe('Invalid credentials');
  });

  test("succeeds with valid credentials", async () => {
    const res = await axios.post(`${SERVER_URL}/api/v1/auth/login`, {
      email: testUser.email,
      password: testUser.password
    });
    console.log('Test: Valid credentials - Status:', res.status, 'Response:', res.data);
    expect(res.status).toBe(200);
    expect(res.data.success).toBe(true);
    expect(res.data.data).toHaveProperty('token');
    expect(res.data.data).toHaveProperty('user');
    expect(res.data.data.user).toHaveProperty('id', testUser.id);
    expect(res.data.data.user).toHaveProperty('email', testUser.email);
    expect(res.data.data.user).toHaveProperty('role');
    expect(res.data.data.user).toHaveProperty('tenant');
    expect(res.data.data.user.tenant).toHaveProperty('id', testUser.tenantId);
  });

  test("returns proper user data structure on successful login", async () => {
    const res = await axios.post(`${SERVER_URL}/api/v1/auth/login`, {
      email: testUser.email,
      password: testUser.password
    });
    
    console.log('Test: User data structure - Status:', res.status, 'Response:', res.data);
    expect(res.status).toBe(200);
    expect(res.data.success).toBe(true);
    
    const { token, user } = res.data.data;
    
    // Check token exists and is a string
    expect(typeof token).toBe('string');
    expect(token.length).toBeGreaterThan(0);
    
    // Check user object structure
    expect(user).toHaveProperty('id');
    expect(user).toHaveProperty('email', testUser.email);
    expect(user).toHaveProperty('role');
    expect(user).toHaveProperty('tenant');
    
    // Check tenant object structure
    expect(user.tenant).toHaveProperty('id', testUser.tenantId);
    expect(user.tenant).toHaveProperty('name');
    expect(user.tenant).toHaveProperty('slug');
    expect(user.tenant).toHaveProperty('subscription');
  });

  test("handles empty email string", async () => {
    const res = await axios.post(`${SERVER_URL}/api/v1/auth/login`, {
      email: "",
      password: "somepassword"
    });
    expect(res.status).toBe(400);
    expect(res.data.success).toBe(false);
    expect(res.data.message).toBe('Email and password are required');
  });

  test("handles empty password string", async () => {
    const res = await axios.post(`${SERVER_URL}/api/v1/auth/login`, {
      email: "test@example.com",
      password: ""
    });
    expect(res.status).toBe(400);
    expect(res.data.success).toBe(false);
    expect(res.data.message).toBe('Email and password are required');
  });

  test("handles null values", async () => {
    const res = await axios.post(`${SERVER_URL}/api/v1/auth/login`, {
      email: null,
      password: null
    });
    expect(res.status).toBe(400);
    expect(res.data.success).toBe(false);
    expect(res.data.message).toBe('Email and password are required');
  });

  test("handles undefined values", async () => {
    const res = await axios.post(`${SERVER_URL}/api/v1/auth/login`, {
      email: undefined,
      password: undefined
    });
    expect(res.status).toBe(400);
    expect(res.data.success).toBe(false);
    expect(res.data.message).toBe('Email and password are required');
  });

  test("validates JWT token structure", async () => {
    const res = await axios.post(`${SERVER_URL}/api/v1/auth/login`, {
      email: testUser.email,
      password: testUser.password
    });
    
    console.log('Test: JWT token structure - Status:', res.status, 'Response:', res.data);
    expect(res.status).toBe(200);
    expect(res.data.success).toBe(true);
    
    const token = res.data.data.token;
    expect(typeof token).toBe('string');
    
    // Basic JWT structure validation (header.payload.signature)
    const tokenParts = token.split('.');
    expect(tokenParts).toHaveLength(3);
    
    // Decode the payload to verify it contains expected claims
    const payload = JSON.parse(Buffer.from(tokenParts[1], 'base64').toString());
    expect(payload).toHaveProperty('userId');
    expect(payload).toHaveProperty('email', testUser.email);
    expect(payload).toHaveProperty('role');
    expect(payload).toHaveProperty('tenantId', testUser.tenantId);
    expect(payload).toHaveProperty('iat'); // issued at
    expect(payload).toHaveProperty('exp'); // expiration
  });

  test("handles malformed request body", async () => {
    // Test with invalid JSON
    const res = await axios.post(`${SERVER_URL}/api/v1/auth/login`, "invalid json", {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    console.log('Test: Malformed request body - Status:', res.status, 'Response:', res.data);
    expect(res.status).toBe(400);
  });

  test("handles extra fields in request body", async () => {
    const res = await axios.post(`${SERVER_URL}/api/v1/auth/login`, {
      email: testUser.email,
      password: testUser.password,
      extraField: "should be ignored"
    });
    
    console.log('Test: Extra fields - Status:', res.status, 'Response:', res.data);
    // Should still work with extra fields
    expect(res.status).toBe(200);
    expect(res.data.success).toBe(true);
  });

  test("handles case sensitivity in email", async () => {
    const res = await axios.post(`${SERVER_URL}/api/v1/auth/login`, {
      email: testUser.email.toUpperCase(),
      password: testUser.password
    });
    
    console.log('Test: Case sensitivity - Status:', res.status, 'Response:', res.data);
    expect(res.status).toBe(401);
    expect(res.data.success).toBe(false);
    expect(res.data.message).toBe('Invalid credentials');
  });

  test("handles whitespace in email and password", async () => {
    const res = await axios.post(`${SERVER_URL}/api/v1/auth/login`, {
      email: ` ${testUser.email} `,
      password: ` ${testUser.password} `
    });
    
    console.log('Test: Whitespace handling - Status:', res.status, 'Response:', res.data);
    expect(res.status).toBe(401);
    expect(res.data.success).toBe(false);
    expect(res.data.message).toBe('Invalid credentials');
  });

});
