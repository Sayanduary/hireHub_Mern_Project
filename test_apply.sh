#!/bin/bash
# Test the apply endpoint
JOB_ID="6940f443198985a4b5485a97"
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTQwNjIyY2IzNWE2Nzc0MjYwZGRhYzYiLCJpYXQiOjE3MzQzNTI3NzUsImV4cCI6MTczNDQzOTE3NX0.VQaQJgTBr_cKfQCHrpBUxUfKx9CjGfQHpQhpxzLdRAU"

echo "Testing apply endpoint..."
curl -X GET "http://localhost:3001/api/v1/application/apply/$JOB_ID" \
  -H "Cookie: token=$TOKEN" \
  -H "Content-Type: application/json" \
  --verbose 2>&1 | head -50
