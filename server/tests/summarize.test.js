//creating test for endpoint /api/summarize using jest and supertest

//INTEGRATION TESTS FOR /api/summarize ENDPOINT -> one test suite with 4 tests 

const request = require('supertest');
const app = require('../index'); // your express app
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
// ✅ Set NODE_ENV before importing
process.env.NODE_ENV = 'test';
// ✅ Mock the Google Generative AI module
jest.mock('@google/generative-ai', () => {
  return {
    GoogleGenerativeAI: jest.fn().mockImplementation(() => ({
      getGenerativeModel: jest.fn().mockReturnValue({
        generateContent: jest.fn().mockResolvedValue({
          response: {
            text: jest.fn().mockReturnValue("Mocked Gemini summary result")
          }
        })
      })
    }))
  };
});

describe("POST /api/summarize", () => {


    // Groups related tests together. This describes what endpoint we're testing
    // individual test using it() function
  it("should return 401 without token", async () => {
    //below is actual test
    const res = await request(app).post("/api/summarize").send({ transcript: "hi" });// no auth token sent here to test it
    expect(res.statusCode).toBe(401); // expected response status code and auth failure
    expect(res.body.error).toBe("No token");
  });

   // Test 2: Invalid token provided
  it("should return 403 with invalid token", async () => {
    const res = await request(app)
      .post("/api/summarize")
      .set('Authorization', 'Bearer invalid-token-here')
      .send({ transcript: "hi" });
    
    expect(res.statusCode).toBe(403);
    expect(res.body.error).toBe("Invalid token");
  });

    // Test 3: Valid token provided
 it("should return 200 with valid token", async () => {
    const validToken = jwt.sign(
      { email: "test@example.com", id: "123" },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    const res = await request(app)
      .post("/api/summarize")
      .set('Authorization', `Bearer ${validToken}`)
      .send({ transcript: "This is a test transcript" });
    
    expect(res.statusCode).toBe(200);
    expect(res.body.result).toBe("Mocked Gemini summary result"); // ✅ Correct expectation
  });

    // Test 4: Missing transcript
  it("should return 400 with missing transcript", async () => {
    const validToken = jwt.sign(
      { email: "test@example.com", id: "123" },
      process.env.JWT_SECRET
    );

    const res = await request(app)
      .post("/api/summarize")
      .set('Authorization', `Bearer ${validToken}`)
      .send({}); // ❌ No transcript

    expect(res.statusCode).toBe(400);
  });

});
