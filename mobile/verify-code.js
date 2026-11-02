// verify-code.js
// Verify that all mobile JavaScript files are valid JSX and have no syntax errors

const fs = require('fs');
const path = require('path');
const parser = require('@babel/parser');

const filesToVerify = [
  'App.js',
  'src/services/api.js',
  'src/store/authStore.js',
  'src/screens/RegisterScreen.js',
  'src/screens/LoginScreen.js',
  'src/screens/HomeScreen.js',
  'src/screens/UsersScreen.js',
  'src/navigation/AppNavigator.js',
];

console.log('--- VERIFYING MOBILE SOURCE FILES ---\n');
let allPassed = true;

for (const file of filesToVerify) {
  const filePath = path.join(__dirname, file);
  try {
    const code = fs.readFileSync(filePath, 'utf8');
    parser.parse(code, {
      sourceType: 'module',
      plugins: ['jsx'],
    });
    console.log(`✅ ${file}: Syntax valid`);
  } catch (err) {
    console.error(`❌ ${file}: Error -`, err.message);
    allPassed = false;
  }
}

if (allPassed) {
  console.log('\n🎉 ALL MOBILE FILES PASSED SYNTAX & JSX VALIDATION!');
} else {
  console.error('\n⚠️ Errors found in some files.');
  process.exit(1);
}
