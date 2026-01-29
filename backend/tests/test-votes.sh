#!/bin/bash

# AI Crypto Advisor - Voting API Tests
# Run this script to test all voting endpoints

BASE_URL="http://localhost:5000"
CONTENT_TYPE="Content-Type: application/json"

echo "================================"
echo "🗳️  Testing Voting API"
echo "================================"
echo ""

# First, login to get a token
echo "🔐 Logging in to get token..."
TOKEN=$(curl -s -X POST "$BASE_URL/api/auth/login" \
  -H "$CONTENT_TYPE" \
  -d '{
    "email": "test@example.com",
    "password": "Test1234"
  }' | python3 -c "import sys, json; print(json.load(sys.stdin)['data']['token'])")

if [ -z "$TOKEN" ] || [ "$TOKEN" = "None" ]; then
  echo "❌ Failed to get token. Make sure the server is running and test user exists."
  exit 1
fi
echo "✅ Got token: ${TOKEN:0:20}..."
echo ""
echo ""

# Test 1: Cast upvote on prices section
echo "1️⃣  Testing Cast Vote (Upvote on Prices)"
echo "POST /api/votes"
curl -s -X POST "$BASE_URL/api/votes" \
  -H "Authorization: Bearer $TOKEN" \
  -H "$CONTENT_TYPE" \
  -d '{
    "section": "prices",
    "vote": true
  }' | python3 -m json.tool
echo ""
echo ""

# Test 2: Cast downvote on memes section
echo "2️⃣  Testing Cast Vote (Downvote on Memes)"
echo "POST /api/votes"
curl -s -X POST "$BASE_URL/api/votes" \
  -H "Authorization: Bearer $TOKEN" \
  -H "$CONTENT_TYPE" \
  -d '{
    "section": "memes",
    "vote": false
  }' | python3 -m json.tool
echo ""
echo ""

# Test 3: Cast vote on news section
echo "3️⃣  Testing Cast Vote (Upvote on News)"
echo "POST /api/votes"
curl -s -X POST "$BASE_URL/api/votes" \
  -H "Authorization: Bearer $TOKEN" \
  -H "$CONTENT_TYPE" \
  -d '{
    "section": "news",
    "vote": true
  }' | python3 -m json.tool
echo ""
echo ""

# Test 4: Cast vote on ai section
echo "4️⃣  Testing Cast Vote (Upvote on AI)"
echo "POST /api/votes"
curl -s -X POST "$BASE_URL/api/votes" \
  -H "Authorization: Bearer $TOKEN" \
  -H "$CONTENT_TYPE" \
  -d '{
    "section": "ai",
    "vote": true
  }' | python3 -m json.tool
echo ""
echo ""

# Test 5: Update existing vote (change prices to downvote)
echo "5️⃣  Testing Update Vote (Change Prices to Downvote)"
echo "POST /api/votes"
curl -s -X POST "$BASE_URL/api/votes" \
  -H "Authorization: Bearer $TOKEN" \
  -H "$CONTENT_TYPE" \
  -d '{
    "section": "prices",
    "vote": false
  }' | python3 -m json.tool
echo ""
echo ""

# Test 6: Invalid section
echo "6️⃣  Testing Cast Vote (Invalid Section)"
echo "POST /api/votes"
curl -s -X POST "$BASE_URL/api/votes" \
  -H "Authorization: Bearer $TOKEN" \
  -H "$CONTENT_TYPE" \
  -d '{
    "section": "invalid_section",
    "vote": true
  }' | python3 -m json.tool
echo ""
echo ""

# Test 7: Get my votes
echo "7️⃣  Testing Get My Votes"
echo "GET /api/votes/my-votes"
curl -s -X GET "$BASE_URL/api/votes/my-votes" \
  -H "Authorization: Bearer $TOKEN" | python3 -m json.tool
echo ""
echo ""

# Test 8: Get vote statistics
echo "8️⃣  Testing Get Vote Statistics"
echo "GET /api/votes/stats"
curl -s -X GET "$BASE_URL/api/votes/stats" \
  -H "Authorization: Bearer $TOKEN" | python3 -m json.tool
echo ""
echo ""

# Test 9: Unauthenticated request
echo "9️⃣  Testing Unauthenticated Request"
echo "POST /api/votes (no token)"
curl -s -X POST "$BASE_URL/api/votes" \
  -H "$CONTENT_TYPE" \
  -d '{
    "section": "prices",
    "vote": true
  }' | python3 -m json.tool
echo ""
echo ""

echo "================================"
echo "✅ Voting Tests Complete!"
echo "================================"
