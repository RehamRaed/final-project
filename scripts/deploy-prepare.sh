#!/bin/bash
# Comprehensive Deployment Preparation Script

echo "🚀 Starting Comprehensive Deployment Preparation..."
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Track errors
ERRORS=0

# 1. Clean up cache
echo -e "${BLUE}🧹 Cleaning up cache and temporary files...${NC}"
rm -rf .next 2>/dev/null
rm -rf node_modules/.cache 2>/dev/null
rm -rf dist 2>/dev/null
echo -e "${GREEN}✓ Cache cleaned${NC}"
echo ""

# 2. Install dependencies
echo -e "${BLUE}📦 Installing dependencies...${NC}"
npm install
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Dependencies installed${NC}"
else
    echo -e "${RED}✗ Failed to install dependencies${NC}"
    ERRORS=$((ERRORS + 1))
fi
echo ""

# 3. Run linting
echo -e "${BLUE}🔍 Running ESLint...${NC}"
npm run lint
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Lint passed${NC}"
else
    echo -e "${RED}✗ Lint failed${NC}"
    ERRORS=$((ERRORS + 1))
fi
echo ""

# 4. Type checking
echo -e "${BLUE}📋 Running TypeScript check...${NC}"
npx tsc --noEmit
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ TypeScript check passed${NC}"
else
    echo -e "${RED}✗ TypeScript check failed${NC}"
    ERRORS=$((ERRORS + 1))
fi
echo ""

# 5. Build
echo -e "${BLUE}🏗️  Building for production...${NC}"
npm run build
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Build successful${NC}"
else
    echo -e "${RED}✗ Build failed${NC}"
    ERRORS=$((ERRORS + 1))
fi
echo ""

# 6. Verify environment variables
echo -e "${BLUE}🔐 Verifying environment variables...${NC}"
required_vars=("NEXT_PUBLIC_SUPABASE_URL" "NEXT_PUBLIC_SUPABASE_ANON_KEY" "NEXT_PUBLIC_APP_URL")

for var in "${required_vars[@]}"; do
    if [ -z "${!var}" ]; then
        echo -e "${YELLOW}⚠️  $var is not set in environment${NC}"
        ERRORS=$((ERRORS + 1))
    else
        echo -e "${GREEN}✓ $var is set${NC}"
    fi
done
echo ""

# 7. Summary
echo -e "${BLUE}=" | awk '{for(i=0;i<50;i++)printf "="}${NC}"
echo ""
if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}✅ All checks passed! Ready for deployment.${NC}"
    echo ""
    echo -e "${YELLOW}Next steps:${NC}"
    echo "1. Push code to Git: git push"
    echo "2. Deploy to Vercel/Production: npm start"
    echo "3. Run final tests on deployment"
    exit 0
else
    echo -e "${RED}❌ $ERRORS check(s) failed. Please fix before deploying.${NC}"
    exit 1
fi
