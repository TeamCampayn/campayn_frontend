#!/usr/bin/env node

/**
 * Script to replace all localhost:4000 API calls with getApiUrl() helper
 * Run from the project root: node scripts/update-api-calls.js
 */

const fs = require('fs');
const path = require('path');

// Files to update
const filesToUpdate = [
  'src/pages/dashboard/CreatorProfile.tsx',
  'src/components/CampaignManagement.tsx',
  'src/components/AdminCreatorSelection.tsx',
  'src/components/BrandCampaignManagement.tsx',
  'src/pages/BrandCampaignDetail.tsx',
  'src/pages/AdminCreators.tsx',
  'src/pages/AdminCampaignDetail.tsx',
  'src/components/ConversationHistory.tsx',
  'src/components/PaymentManagement.tsx',
  'src/pages/AdminPaymentDashboard.tsx',
  'src/components/ContentReview.tsx',
  'src/components/AdminLinkManager.tsx',
];

console.log('🔄 Updating API calls to use getApiUrl helper...\n');

let totalReplacements = 0;

filesToUpdate.forEach(filePath => {
  const fullPath = path.join(process.cwd(), filePath);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`⚠️  File not found: ${filePath}`);
    return;
  }
  
  let content = fs.readFileSync(fullPath, 'utf8');
  let replacements = 0;
  
  // Check if file already imports getApiUrl or SOCKET_URL
  const hasApiImport = content.includes("from '@/lib/api'") || content.includes('from "../lib/api"');
  
  // Add import if not present
  if (!hasApiImport) {
    // Find the last import statement
    const importRegex = /^import .* from ['"].*['"];?$/gm;
    const imports = content.match(importRegex);
    
    if (imports && imports.length > 0) {
      const lastImport = imports[imports.length - 1];
      const importIndex = content.lastIndexOf(lastImport);
      const insertPosition = importIndex + lastImport.length;
      
      content = content.slice(0, insertPosition) + 
                "\nimport { getApiUrl, SOCKET_URL } from '@/lib/api';" +
                content.slice(insertPosition);
      replacements++;
    }
  }
  
  // Replace fetch calls with getApiUrl
  const fetchPattern = /fetch\(`http:\/\/localhost:4000(\/api\/[^`]+)`\)/g;
  content = content.replace(fetchPattern, (match, apiPath) => {
    replacements++;
    // Remove the leading /api/ since getApiUrl adds it
    const cleanPath = apiPath.replace(/^\/api\//, '');
    return `fetch(getApiUrl('api/${cleanPath}'))`;
  });
  
  // Replace fetch calls without backticks
  const fetchPattern2 = /fetch\('http:\/\/localhost:4000(\/api\/[^']+)'\)/g;
  content = content.replace(fetchPattern2, (match, apiPath) => {
    replacements++;
    const cleanPath = apiPath.replace(/^\/api\//, '');
    return `fetch(getApiUrl('api/${cleanPath}'))`;
  });
  
  // Replace Socket.IO connections
  const socketPattern = /io\('http:\/\/localhost:4000'\)/g;
  content = content.replace(socketPattern, () => {
    replacements++;
    return 'io(SOCKET_URL)';
  });
  
  if (replacements > 0) {
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`✅ ${filePath}: ${replacements} replacement(s)`);
    totalReplacements += replacements;
  } else {
    console.log(`⏭️  ${filePath}: No changes needed`);
  }
});

console.log(`\n✨ Done! Total replacements: ${totalReplacements}`);
console.log('\n📝 Next steps:');
console.log('1. Review the changes with git diff');
console.log('2. Test the application locally');
console.log('3. Set VITE_BACKEND_URL in Netlify environment variables');
console.log('4. Deploy to production');
