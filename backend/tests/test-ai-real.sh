#!/bin/bash

API_URL="http://localhost:5000"

echo "🧪 Testing AI Insight with Real AI"
echo "===================================="
echo ""

# Register new user
TIMESTAMP=$(date +%s)
EMAIL="ai-real-${TIMESTAMP}@test.com"
PASSWORD="Test123456!"

echo "1. Registering user..."
register_response=$(curl -s -X POST "$API_URL/api/auth/register" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$EMAIL\",
    \"password\": \"$PASSWORD\",
    \"name\": \"AI Test\"
  }")

TOKEN=$(echo "$register_response" | jq -r '.data.token')
echo "✓ Token received"
echo ""

# Set preferences to Day Trader
echo "2. Setting preferences (Day Trader, BTC + ETH)..."
curl -s -X PUT "$API_URL/api/user/preferences" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "coins": ["bitcoin", "ethereum"],
    "investorType": "Day Trader",
    "contentPreferences": ["prices", "news", "ai-insights"]
  }' > /dev/null
echo "✓ Preferences set"
echo ""

# Get AI insight
echo "3. Getting AI-generated insight..."
echo "===================================="
insight_response=$(curl -s -X GET "$API_URL/api/dashboard/ai" \
  -H "Authorization: Bearer $TOKEN")

# Check if it's AI-generated or fallback
content=$(echo "$insight_response" | jq -r '.data.insight.content')

if echo "$content" | grep -q "For active traders"; then
  echo "❌ Using FALLBACK (static text)"
  echo ""
  echo "Fallback text detected: 'For active traders...'"
else
  echo "✅ Using REAL AI! (OpenAI GPT-3.5-turbo)"
  echo ""
  echo "Full Response:"
  echo "$insight_response" | jq '.'
  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "🤖 AI INSIGHT:"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "$content"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
fi

echo ""
echo "Test another call to see variation..."
sleep 1

insight_response2=$(curl -s -X GET "$API_URL/api/dashboard/ai" \
  -H "Authorization: Bearer $TOKEN")

content2=$(echo "$insight_response2" | jq -r '.data.insight.content')

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🤖 AI INSIGHT #2 (should be different):"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "$content2"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

if [ "$content" != "$content2" ]; then
  echo "✅ Insights are different! AI is generating unique responses!"
else
  echo "⚠️  Insights are identical (might be caching or fallback)"
fi
