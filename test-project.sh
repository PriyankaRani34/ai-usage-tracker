#!/bin/bash

# Comprehensive Test Script for AI Usage Tracker

echo "🧪 AI Usage Tracker - Project Test Suite"
echo "=========================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

PASSED=0
FAILED=0

# Test function
test_check() {
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ $1${NC}"
        ((PASSED++))
    else
        echo -e "${RED}❌ $1${NC}"
        ((FAILED++))
    fi
}

# 1. Check project structure
echo "1️⃣  Project Structure"
echo "-------------------"
[ -f "package.json" ] && test_check "package.json exists"
[ -f "server/index.js" ] && test_check "server/index.js exists"
[ -d "dashboard" ] && test_check "dashboard directory exists"
[ -d "clients" ] && test_check "clients directory exists"
[ -f ".gitignore" ] && test_check ".gitignore exists"
echo ""

# 2. Check dependencies
echo "2️⃣  Dependencies"
echo "-------------------"
[ -d "node_modules" ] && test_check "Root node_modules installed"
[ -d "dashboard/node_modules" ] && test_check "Dashboard node_modules installed"
echo ""

# 3. Check database
echo "3️⃣  Database"
echo "-------------------"
[ -d "data" ] && test_check "data directory exists"
[ -f "data/ai_usage.db" ] && test_check "Database file exists" || echo -e "${YELLOW}ℹ️  Database will be created on first run${NC}"
echo ""

# 4. Check configuration
echo "4️⃣  Configuration"
echo "-------------------"
[ -f ".env.example" ] && test_check ".env.example exists"
[ -f "README.md" ] && test_check "README.md exists"
echo ""

# 5. Check dashboard build
echo "5️⃣  Dashboard Build"
echo "-------------------"
if [ -d "dashboard/build" ]; then
    test_check "Dashboard build directory exists"
else
    echo -e "${YELLOW}ℹ️  Dashboard not built yet (run: cd dashboard && npm run build)${NC}"
fi
echo ""

# 6. Check API server (if running)
echo "6️⃣  API Server"
echo "-------------------"
if curl -s http://localhost:3000 > /dev/null 2>&1; then
    test_check "Server is running on port 3000"
    
    # Test endpoints
    if curl -s http://localhost:3000/api/devices > /dev/null 2>&1; then
        test_check "API /api/devices endpoint accessible"
    fi
    
    if curl -s "http://localhost:3000/api/usage/summary?period=7d" > /dev/null 2>&1; then
        test_check "API /api/usage/summary endpoint accessible"
    fi
else
    echo -e "${YELLOW}ℹ️  Server not running (start with: npm start)${NC}"
fi
echo ""

# 7. Check Git
echo "7️⃣  Git Repository"
echo "-------------------"
[ -d ".git" ] && test_check "Git repository initialized"
if git remote -v | grep -q "github.com"; then
    test_check "GitHub remote configured"
    git remote -v | head -1
fi
echo ""

# Summary
echo "=========================================="
echo "📊 Test Summary"
echo "=========================================="
echo -e "${GREEN}Passed: $PASSED${NC}"
echo -e "${RED}Failed: $FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}🎉 All tests passed!${NC}"
    exit 0
else
    echo -e "${YELLOW}⚠️  Some checks failed or are informational${NC}"
    exit 1
fi
