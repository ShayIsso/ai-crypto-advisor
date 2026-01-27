#!/bin/bash

# Test Memes Endpoint
# Tests the /api/dashboard/memes endpoint

API_URL="http://localhost:5000"

echo "🧪 Testing Memes Endpoint"
echo "=========================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

# Test 1: Without authentication (should fail)
echo -e "${BLUE}Test 1: Access without authentication (expect 401)${NC}"
response=$(curl -s -w "\n%{http_code}" -X GET "$API_URL/api/dashboard/memes")
http_code=$(echo "$response" | tail -n 1)
body=$(echo "$response" | sed '$d')

if [ "$http_code" == "401" ]; then
  echo -e "${GREEN}✓ PASS: Got 401 Unauthorized${NC}"
else
  echo -e "${RED}✗ FAIL: Expected 401, got $http_code${NC}"
fi
echo ""

# Test 2: Login to get token
echo -e "${BLUE}Test 2: Login to get token${NC}"
login_response=$(curl -s -X POST "$API_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123456!"
  }')

TOKEN=$(echo "$login_response" | jq -r '.data.token' 2>/dev/null)

if [ "$TOKEN" == "null" ] || [ -z "$TOKEN" ]; then
  echo -e "${RED}✗ FAIL: Could not login. Register a user first.${NC}"
  echo ""
  echo "Run this first:"
  echo "curl -X POST \"$API_URL/api/auth/register\" \\"
  echo "  -H \"Content-Type: application/json\" \\"
  echo "  -d '{\"email\": \"test@example.com\", \"password\": \"Test123456!\", \"name\": \"Test User\"}'"
  exit 1
fi

echo -e "${GREEN}✓ PASS: Token received${NC}"
echo ""

# Test 3: Get memes with authentication
echo -e "${BLUE}Test 3: Get memes (authenticated)${NC}"
memes_response=$(curl -s -X GET "$API_URL/api/dashboard/memes" \
  -H "Authorization: Bearer $TOKEN")

echo "Response:"
echo "$memes_response" | jq '.' 2>/dev/null || echo "$memes_response"
echo ""

# Validate response structure
if echo "$memes_response" | jq -e '.success == true' > /dev/null 2>&1; then
  echo -e "${GREEN}✓ PASS: Success field is true${NC}"
else
  echo -e "${RED}✗ FAIL: Success field missing or false${NC}"
fi

if echo "$memes_response" | jq -e '.data.memes | length > 0' > /dev/null 2>&1; then
  echo -e "${GREEN}✓ PASS: Memes array has data${NC}"
  
  count=$(echo "$memes_response" | jq -r '.data.count')
  echo "Meme count: $count"
  
  # Show first meme
  echo ""
  echo "Sample meme:"
  echo "$memes_response" | jq '.data.memes[0]'
  
  # Validate meme structure
  first_meme=$(echo "$memes_response" | jq '.data.memes[0]')
  
  if echo "$first_meme" | jq -e '.id' > /dev/null 2>&1; then
    echo -e "${GREEN}✓ PASS: Meme has id field${NC}"
  else
    echo -e "${RED}✗ FAIL: Meme missing id field${NC}"
  fi
  
  if echo "$first_meme" | jq -e '.url' > /dev/null 2>&1; then
    echo -e "${GREEN}✓ PASS: Meme has url field${NC}"
  else
    echo -e "${RED}✗ FAIL: Meme missing url field${NC}"
  fi
  
else
  echo -e "${RED}✗ FAIL: No memes in response${NC}"
fi

echo ""
echo "=========================="
echo "🎉 Testing Complete!"
echo ""
echo "Summary:"
echo "- Endpoint: GET /api/dashboard/memes"
echo "- Auth: Required (JWT token)"
echo "- Returns: Array of meme objects with id and url"
