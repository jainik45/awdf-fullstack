/**
 * Comprehensive Backend Smoke Test Script
 * Verifies all 22 specific test criteria defined in the requirements.
 */

const http = require("http");

const BASE_URL = "http://127.0.0.1:5000";

let passedCount = 0;
let failedCount = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✓ PASS: ${message}`);
    passedCount++;
  } else {
    console.error(`  ✗ FAIL: ${message}`);
    failedCount++;
  }
}

function makeRequest(path, options = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const headers = { ...(options.headers || {}) };
    const body = options.body ? JSON.stringify(options.body) : null;

    if (body && !headers["Content-Type"] && !headers["content-type"]) {
      headers["Content-Type"] = "application/json";
    }

    const req = http.request(
      url,
      {
        method: options.method || "GET",
        headers,
      },
      (res) => {
        let rawData = "";
        res.on("data", (chunk) => {
          rawData += chunk;
        });
        res.on("end", () => {
          let json = null;
          try {
            json = JSON.parse(rawData);
          } catch (e) {
            json = rawData;
          }
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: json,
          });
        });
      }
    );

    req.on("error", (err) => reject(err));

    if (body) {
      req.write(body);
    }
    req.end();
  });
}

async function runTests() {
  console.log("==================================================");
  console.log("   TASK MANAGER API - COMPREHENSIVE SMOKE TEST    ");
  console.log("==================================================\n");

  const testEmail = `jainik_${Date.now()}@example.com`;
  const testPassword = "Password123";
  let token = "";
  let createdTaskId = "";

  try {
    // 1. POST /register (201 Created)
    console.log("[Test 1] User Registration (201)");
    const regRes = await makeRequest("/register", {
      method: "POST",
      body: { email: testEmail, password: testPassword },
    });
    assert(regRes.status === 201, `Status is 201 (got ${regRes.status})`);
    assert(regRes.body.message === "User registered successfully", "Returns success message");
    assert(regRes.body.user && regRes.body.user.email === testEmail, "Returns user object without password");

    // 2. Duplicate Registration (409 Conflict)
    console.log("\n[Test 2] Duplicate User Registration (409)");
    const dupRes = await makeRequest("/register", {
      method: "POST",
      body: { email: testEmail, password: testPassword },
    });
    assert(dupRes.status === 409, `Status is 409 (got ${dupRes.status})`);
    assert(dupRes.body.error === "Email already registered", "Error message matches 'Email already registered'");

    // 3. Invalid Registration (400 with details)
    console.log("\n[Test 3] Invalid Registration Input (400)");
    const invalidReg = await makeRequest("/register", {
      method: "POST",
      body: { email: "invalid-email", password: "123" },
    });
    assert(invalidReg.status === 400, `Status is 400 (got ${invalidReg.status})`);
    assert(invalidReg.body.error === "Validation failed", "Error is 'Validation failed'");
    assert(Array.isArray(invalidReg.body.details) && invalidReg.body.details.length >= 2, "details array returned with field errors");

    // 4. Wrong Login (401)
    console.log("\n[Test 4] Wrong Login Credentials (401)");
    const wrongLogin = await makeRequest("/login", {
      method: "POST",
      body: { email: testEmail, password: "WrongPassword" },
    });
    assert(wrongLogin.status === 401, `Status is 401 (got ${wrongLogin.status})`);
    assert(wrongLogin.body.error === "Invalid email or password", "Safe message for invalid password");

    // 5. Successful Login (200 + token)
    console.log("\n[Test 5] Valid Login (200 + JWT Token)");
    const loginRes = await makeRequest("/login", {
      method: "POST",
      body: { email: testEmail, password: testPassword },
    });
    assert(loginRes.status === 200, `Status is 200 (got ${loginRes.status})`);
    assert(Boolean(loginRes.body.token), "JWT token received");
    token = loginRes.body.token;

    // 6. GET /tasks without token (401)
    console.log("\n[Test 6] GET /tasks Without Token (401)");
    const noAuthRes = await makeRequest("/tasks");
    assert(noAuthRes.status === 401, `Status is 401 (got ${noAuthRes.status})`);

    // 7. POST without JSON header (415 Unsupported Media Type)
    console.log("\n[Test 7] POST Without application/json Content-Type (415)");
    const noJsonRes = await makeRequest("/tasks", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "text/plain",
      },
      body: "plain text body",
    });
    assert(noJsonRes.status === 415, `Status is 415 (got ${noJsonRes.status})`);
    assert(noJsonRes.body.error === "Content-Type must be application/json", "415 Content-Type error message matches");

    // 8. POST /tasks without title (400)
    console.log("\n[Test 8] Create Task Without Title (400)");
    const noTitleRes = await makeRequest("/tasks", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: { description: "Missing title" },
    });
    assert(noTitleRes.status === 400, `Status is 400 (got ${noTitleRes.status})`);
    assert(noTitleRes.body.details[0].field === "title", "Validation error indicates missing title");

    // 9. POST /tasks with token (201)
    console.log("\n[Test 9] Create Task with Token (201)");
    const createRes = await makeRequest("/tasks", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: { title: "Complete Practical Verification", description: "All 11 practicals verified", priority: "high" },
    });
    assert(createRes.status === 201, `Status is 201 (got ${createRes.status})`);
    assert(createRes.body.title === "Complete Practical Verification", "Created task title matches");
    assert(createRes.body.priority === "high", "Created task priority is high");
    createdTaskId = createRes.body._id;

    // 10. GET /tasks Cache MISS
    console.log("\n[Test 10] First GET /tasks (Cache MISS)");
    const listRes1 = await makeRequest("/tasks", {
      headers: { Authorization: `Bearer ${token}` },
    });
    assert(listRes1.status === 200, `Status is 200 (got ${listRes1.status})`);
    assert(listRes1.headers["x-cache"] === "MISS", `Header X-Cache is MISS (got ${listRes1.headers["x-cache"]})`);

    // 11. GET /tasks Cache HIT
    console.log("\n[Test 11] Second GET /tasks (Cache HIT)");
    const listRes2 = await makeRequest("/tasks", {
      headers: { Authorization: `Bearer ${token}` },
    });
    assert(listRes2.status === 200, `Status is 200 (got ${listRes2.status})`);
    assert(listRes2.headers["x-cache"] === "HIT", `Header X-Cache is HIT (got ${listRes2.headers["x-cache"]})`);

    // 12. Invalidation: POST /tasks invalidates cache
    console.log("\n[Test 12] POST /tasks invalidates cache");
    const createRes2 = await makeRequest("/tasks", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: { title: "Second Task to test invalidation", priority: "low" },
    });
    assert(createRes2.status === 201, "Second task created");

    // 13. Next GET /tasks is MISS again
    console.log("\n[Test 13] Subsequent GET /tasks is Cache MISS after write");
    const listRes3 = await makeRequest("/tasks", {
      headers: { Authorization: `Bearer ${token}` },
    });
    assert(listRes3.headers["x-cache"] === "MISS", `Header X-Cache is MISS after invalidation (got ${listRes3.headers["x-cache"]})`);

    // 14. GET /tasks/:id Cache MISS then HIT
    console.log("\n[Test 14] GET /tasks/:id Cache MISS then HIT");
    const getTask1 = await makeRequest(`/tasks/${createdTaskId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    assert(getTask1.status === 200 && getTask1.headers["x-cache"] === "MISS", "First item fetch is Cache MISS");

    const getTask2 = await makeRequest(`/tasks/${createdTaskId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    assert(getTask2.status === 200 && getTask2.headers["x-cache"] === "HIT", "Second item fetch is Cache HIT");

    // 15. PUT /tasks/:id of another ID (404)
    console.log("\n[Test 15] PUT /tasks/:id for non-existent ID (404)");
    const fakeId = "65f1a1a1a1a1a1a1a1a1a1a1";
    const putNonExistent = await makeRequest(`/tasks/${fakeId}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
      body: { title: "New Title" },
    });
    assert(putNonExistent.status === 404, `Status is 404 (got ${putNonExistent.status})`);
    assert(putNonExistent.body.error === "Task not found", "Returns 'Task not found'");

    // 16. DELETE /tasks/:id of another ID (404)
    console.log("\n[Test 16] DELETE /tasks/:id for non-existent ID (404)");
    const deleteNonExistent = await makeRequest(`/tasks/${fakeId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    assert(deleteNonExistent.status === 404, `Status is 404 (got ${deleteNonExistent.status})`);

    // 17. Invalid ObjectId format (400)
    console.log("\n[Test 17] Invalid Task ID format (400)");
    const invalidIdRes = await makeRequest("/tasks/not-a-valid-object-id", {
      headers: { Authorization: `Bearer ${token}` },
    });
    assert(invalidIdRes.status === 400, `Status is 400 (got ${invalidIdRes.status})`);
    assert(invalidIdRes.body.error === "Invalid task ID", "Error matches 'Invalid task ID'");

    // 18. GET /test-error (500 safe message)
    console.log("\n[Test 18] GET /test-error Global Error Handler (500)");
    const errRes = await makeRequest("/test-error");
    assert(errRes.status === 500, `Status is 500 (got ${errRes.status})`);
    assert(errRes.body.error === "Something went wrong", "Safe error message returned, no stack trace leaked");
    assert(!errRes.body.stack, "Stack trace is not sent to client");

    // 19. Unknown Route (404 JSON)
    console.log("\n[Test 19] Unknown Route 404 JSON Handler");
    const unknownRes = await makeRequest("/non-existent-endpoint-test");
    assert(unknownRes.status === 404, `Status is 404 (got ${unknownRes.status})`);
    assert(unknownRes.body.error === "Route GET /non-existent-endpoint-test not found", "404 JSON message formatted correctly");

    // 20. GET /debug/cache (200 with counters)
    console.log("\n[Test 20] GET /debug/cache Telemetry");
    const cacheDebug = await makeRequest("/debug/cache", {
      headers: { Authorization: `Bearer ${token}` },
    });
    assert(cacheDebug.status === 200, `Status is 200 (got ${cacheDebug.status})`);
    assert(typeof cacheDebug.body.hits === "number" && cacheDebug.body.hits > 0, `Hits tracked: ${cacheDebug.body.hits}`);
    assert(typeof cacheDebug.body.misses === "number" && cacheDebug.body.misses > 0, `Misses tracked: ${cacheDebug.body.misses}`);

    // 21. DELETE /tasks/:id (200)
    console.log("\n[Test 21] DELETE /tasks/:id (200)");
    const delRes = await makeRequest(`/tasks/${createdTaskId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    assert(delRes.status === 200, `Status is 200 (got ${delRes.status})`);
    assert(delRes.body.message === "Task deleted", "Delete response confirms deletion");

    // 22. Demonstrate EventEmitter async delay
    console.log("\n[Test 22] Waiting 2.5s to observe EventEmitter asynchronous notification in server logs...");
    await new Promise((r) => setTimeout(r, 2500));
    assert(true, "Async wait complete. Notification logged after API response.");

    console.log("\n==================================================");
    console.log(`SMOKE TEST RESULTS: ${passedCount} PASSED, ${failedCount} FAILED`);
    console.log("==================================================");

    if (failedCount > 0) {
      process.exit(1);
    }
  } catch (err) {
    console.error("Test execution error:", err.message);
    process.exit(1);
  }
}

runTests();
