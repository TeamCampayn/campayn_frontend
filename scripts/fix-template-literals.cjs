#!/usr/bin/env node

/**
 * Fix template literal syntax - replace single quotes with backticks in getApiUrl calls
 */

const fs = require('fs');
const path = require('path');

const filesToFix = [
  'src/pages/dashboard/CreatorProfile.tsx',
  'src/components/AdminCreatorSelection.tsx',
  'src/components/BrandCampaignManagement.tsx',
  'src/components/CampaignManagement.tsx',
  'src/components/PaymentManagement.tsx',
  'src/components/ContentReview.tsx',
  'src/components/AdminLinkManager.tsx',
];

console.log('🔧 Fixing template literal syntax in getApiUrl calls...\n');

let totalFixes = 0;

filesToFix.forEach(filePath => {
  const fullPath = path.join(process.cwd(), filePath);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`⚠️  File not found: ${filePath}`);
    return;
  }
  
  let content = fs.readFileSync(fullPath, 'utf8');
  let fixes = 0;
  
  // Replace getApiUrl('...${...}') with getApiUrl(`...${...}`)
  // This regex finds getApiUrl with single quotes containing ${
  const pattern = /getApiUrl\('([^']*\$\{[^']+\})'\)/g;
  
  content = content.replace(pattern, (match, innerContent) => {
    fixes++;
    return `getApiUrl(\`${innerContent}\`)`;
  });
  
  if (fixes > 0) {
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`✅ ${filePath}: ${fixes} fix(es)`);
    totalFixes += fixes;
  } else {
    console.log(`⏭️  ${filePath}: No changes needed`);
  }
});

console.log(`\n✨ Done! Total fixes: ${totalFixes}`);

if (totalFixes > 0) {
  console.log('\n📝 Next steps:');
  console.log('1. Test locally with npm run dev');
  console.log('2. Commit: git add . && git commit -m "fix: use template literals in getApiUrl calls"');
  console.log('3. Push: git push');
}
