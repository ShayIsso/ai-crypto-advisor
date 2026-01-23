#!/bin/bash

# AI Crypto Advisor - Authentication API Tests
# Run this script to test all authentication endpoints

BASE_URL="http://localhost:5000"
CONTENT_TYPE="Content-Type: application/json"

echo "================================"
echo "🧪 Testing Authentication API"
echo "================================"
echo ""

# Test 1: Register new user
echo "1️⃣  Testing Registration (Valid)"
echo "POST /api/auth/register"
curl -X POST "$BASE_URL/api/auth/register" \
  -H "$CONTENT_TYPE" \
  -d '{
    "email": "john.doe@example.com",
    "name": "John Doe",
    "password": "Secure123"
  }' | python3 -m json.tool
echo ""
echo ""

# Test 2: Register with invalid data
echo "2️⃣  Testing Registration (Invalid Data)"
echo "POST /api/auth/register"
curl -X POST "$BASE_URL/api/auth/register" \
  -H "$CONTENT_TYPE" \
  -d '{
    "email": "not-an-email",
    "name": "J",
    "password": "weak"
  }' | python3 -m json.tool
echo ""
echo ""

# Test 3: Register duplicate email
echo "3️⃣  Testing Registration (Duplicate Email)"
echo "POST /api/auth/register"
curl -X POST "$BASE_URL/api/auth/register" \
  -H "$CONTENT_TYPE" \
  -d '{
    "email": "test@example.com",
    "name": "Duplicate User",
    "password": "Test1234"
  }' | python3 -m json.tool
echo ""
echo ""

# Test 4: Login with correct credentials
echo "4️⃣  Testing Login (Valid Credentials)"
echo "POST /api/auth/login"
TOKEN=$(curl -s -X POST "$BASE_URL/api/auth/login" \
  -H "$CONTENT_TYPE" \
  -d '{
    "email": "test@example.com",
    "password": "Test1234"
  }' | python3 -c "import sys, json; print(json.load(sys.stdin)['data']['token'])")
echo "Token: $TOKEN"
curl -X POST "$BASE_URL/api/auth/login" \
  -H "$CONTENT_TYPE" \
  -d '{
    "email": "test@example.com",
    "password": "Test1234"
  }' | python3 -m json.tool
echo ""
echo ""

# Test 5: Login with wrong password
echo "5️⃣  Testing Login (Wrong Password)"
echo "POST /api/auth/login"
curl -X POST "$BASE_URL/api/auth/login" \
  -H "$CONTENT_TYPE" \
  -d '{
    "email": "test@example.com",
    "password": "WrongPassword"
  }' | python3 -m json.tool
echo ""
echo ""

# Test 6: Login with non-existent user
echo "6️⃣  Testing Login (Non-existent User)"
echo "POST /api/auth/login"
curl -X POST "$BASE_URL/api/auth/login" \
  -H "$CONTENT_TYPE" \
  -d '{
    "email": "nonexistent@example.com",
    "password": "Test1234"
  }' | python3 -m json.tool
echo ""
echo ""

echo "================================"
echo "✅ Tests Complete!"
echo "================================"
