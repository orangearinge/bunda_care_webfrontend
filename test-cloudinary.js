/**
 * Test script to verify Cloudinary configuration
 * Run this in browser console or as a module
 */

import { CLOUDINARY_CONFIG, getCloudinaryFolder, isValidUploadType, validateCloudinaryConfig } from '../src/constants/cloudinary.js';

// Test 1: Configuration validation
console.log('=== Cloudinary Configuration Test ===');
const configValidation = validateCloudinaryConfig();
console.log('Config validation:', configValidation);

// Test 2: Folder retrieval
console.log('\n=== Folder Tests ===');
console.log('Avatar folder:', getCloudinaryFolder('avatar'));
console.log('Menu folder:', getCloudinaryFolder('menu'));

// Test 3: Upload type validation
console.log('\n=== Upload Type Validation Tests ===');
console.log('Is "avatar" valid?', isValidUploadType('avatar'));
console.log('Is "menu" valid?', isValidUploadType('menu'));
console.log('Is "invalid" valid?', isValidUploadType('invalid'));

// Test 4: Error handling
console.log('\n=== Error Handling Tests ===');
try {
  getCloudinaryFolder('invalid');
} catch (error) {
  console.log('Expected error caught:', error.message);
}

// Test 5: Environment variables check
console.log('\n=== Environment Variables ===');
console.log('Cloud Name:', CLOUDINARY_CONFIG.CLOUD_NAME);
console.log('Upload Preset:', CLOUDINARY_CONFIG.UPLOAD_PRESET);
console.log('All Folders:', CLOUDINARY_CONFIG.FOLDERS);

console.log('\n=== Test Complete ===');