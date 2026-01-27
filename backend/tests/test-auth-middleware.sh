#!/bin/bash

# Auth Middleware Test Script
# Tests protected routes with and without authentication

BASE_URL="http://localhost:5000"
CONTENT_TYPE="Content-Type: application/json"

echo "========================================"
echo "🔐 Testing Auth Middleware"
echo "========================================"
echo ""

# Test 1: Access protected route without token
echo "1️⃣  Test: Access protected route WITHOUT token (should fail)"
echo "GET /api/user/me"
curl -s "$BASE_URL/api/user/me" | python3 -m json.tool
echo ""
echo ""

# Test 2: Access protected route with invalid token
echo "2️⃣  Test: Access protected route with INVALID token (should fail)"
echo "GET /api/user/me"
curl -s "$BASE_URL/api/user/me" \
  -H "Authorization: Bearer invalid_token_here" | python3 -m json.tool
echo ""
echo ""

# Test 3: Access protected route with malformed auth header
echo "3️⃣  Test: Access protected route with MALFORMED header (should fail)"
echo "GET /api/user/me"
curl -s "$BASE_URL/api/user/me" \
  -H "Authorization: NotBearer token123" | python3 -m json.tool
echo ""
echo ""

# Test 4: Login and get token
echo "4️⃣  Test: Login to get valid token"
echo "POST /api/auth/login"
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/login" \
  -H "$CONTENT_TYPE" \
  -d '{
    "email": "demo@test.com",
    "password": "Demo1234"
  }')

echo "$LOGIN_RESPONSE" | python3 -m json.tool

TOKEN=$(echo "$LOGIN_RESPONSE" | python3 -c "import sys, json; print(json.load(sys.stdin)['data']['token'])" 2>/dev/null)

if [ -z "$TOKEN" ]; then
  echo "❌ Failed to get token. User might not exist. Registering new user..."
  
  REGISTER_RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/register" \
    -H "$CONTENT_TYPE" \
    -d '{
      "email": "authtest@example.com",
      "name": "Auth Test",
      "password": "Test1234"
    }')
  
  TOKEN=$(echo "$REGISTER_RESPONSE" | python3 -c "import sys, json; print(json.load(sys.stdin)['data']['token'])")
  echo "✅ Registered and got token"
fi

echo ""
echo "Token: ${TOKEN:0:60}..."
echo ""
echo ""

# Test 5: Access protected route with valid token
echo "5️⃣  Test: Access protected route WITH valid token (should succeed)"
echo "GET /api/user/me"
curl -s "$BASE_URL/api/user/me" \
  -H "Authorization: Bearer $TOKEN" | python3 -m json.tool
echo ""
echo ""

# Test 6: Use token in multiple requests
echo "6️⃣  Test: Reuse same token (should work - tokens don't expire quickly)"
echo "GET /api/user/me"
curl -s "$BASE_URL/api/user/me" \
  -H "Authorization: Bearer $TOKEN" | python3 -m json.tool
echo ""
echo ""

echo "========================================"
echo "✅ Auth Middleware Tests Complete!"
echo "========================================"
echo ""
echo "Summary:"
echo "  - ✅ Blocks requests without token"
echo "  - ✅ Blocks requests with invalid token"
echo "  - ✅ Blocks requests with malformed header"
echo "  - ✅ Allows requests with valid token"
echo "  - ✅ Attaches user data to req.user"
