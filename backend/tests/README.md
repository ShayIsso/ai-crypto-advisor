# Backend Tests

These are integration tests for the API endpoints.

## Available Tests

### `test-auth.sh`
Tests authentication endpoints:
- User registration
- User login
- Invalid credentials handling

**Usage:**
```bash
./tests/test-auth.sh
```

### `test-auth-middleware.sh`
Tests authentication middleware:
- Protected route access without token
- Invalid token handling
- Valid token authentication

**Usage:**
```bash
./tests/test-auth-middleware.sh
```

### `test-ai-real.sh`
Tests AI insight generation:
- Real AI response (OpenAI GPT-3.5-turbo)
- Personalization based on user preferences
- Multiple calls to verify variation

**Usage:**
```bash
./tests/test-ai-real.sh
```

## Running All Tests

```bash
cd backend
for test in tests/*.sh; do
  echo "Running $test..."
  ./"$test"
  echo ""
done
```

## Requirements

- Server must be running (`npm run dev`)
- PostgreSQL database must be running
- API keys must be configured in `.env`
