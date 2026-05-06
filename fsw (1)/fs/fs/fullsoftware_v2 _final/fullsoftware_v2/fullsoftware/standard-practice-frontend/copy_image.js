const fs = require('fs');
const path = require('path');

const srcPath = 'C:\\Users\\Sanjayarya\\.gemini\\antigravity\\brain\\57cd70b2-18ad-4c32-9b09-7ddbbe4874b4\\media__1777631974063.jpg';
const destPath = path.join(__dirname, 'src', 'assets', 'doctor-hero.jpg');

try {
  fs.copyFileSync(srcPath, destPath);
  console.log('Image copied successfully!');
} catch (e) {
  console.error('Failed to copy image:', e);
}
