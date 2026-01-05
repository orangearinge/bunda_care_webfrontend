/**
 * Cloudinary Configuration Constants
 * Centralized configuration for all Cloudinary operations
 * Ensures consistent folder usage across the application
 */

/**
 * @typedef {'avatar' | 'menu'} UploadType
 * Type definition for supported upload types
 * @typedef {Object} CloudinaryConfig
 * @property {string} CLOUD_NAME - Cloudinary cloud name
 * @property {string} UPLOAD_PRESET - Upload preset for unsigned uploads
 * @property {Object} FOLDERS - Folder configuration
 * @property {string} FOLDERS.AVATAR - Folder for user avatars
 * @property {string} FOLDERS.MENU - Folder for menu images
 */

/**
 * Cloudinary folder paths for different upload types
 * These paths determine where files are stored in Cloudinary
 */
export const CLOUDINARY_FOLDERS = {
  /** Folder for user profile avatars */
  AVATAR: import.meta.env.VITE_CLOUDINARY_AVATAR_FOLDER || 'bunda_care/avatars',
  
  /** Folder for food menu images */
  MENU: import.meta.env.VITE_CLOUDINARY_MENU_FOLDER || 'bunda_care/menus'
};

/**
 * Cloudinary configuration object
 * Contains all necessary settings for Cloudinary operations
 */
export const CLOUDINARY_CONFIG = {
  /** Cloudinary cloud name from environment */
  CLOUD_NAME: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'demo',
  
  /** Upload preset for unsigned uploads */
  UPLOAD_PRESET: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'ml_default',
  
  /** Folder configuration */
  FOLDERS: CLOUDINARY_FOLDERS
};

/**
 * Get the appropriate folder path for a given upload type
 * @param {UploadType} uploadType - The type of upload
 * @returns {string} The folder path for the upload type
 * @throws {Error} If upload type is not supported
 * @example
 * const avatarFolder = getCloudinaryFolder('avatar') // 'bunda_care/avatars'
 * const menuFolder = getCloudinaryFolder('menu') // 'bunda_care/menus'
 */
export const getCloudinaryFolder = (uploadType) => {
  switch (uploadType) {
    case 'avatar':
      return CLOUDINARY_FOLDERS.AVATAR;
    case 'menu':
      return CLOUDINARY_FOLDERS.MENU;
    default:
      throw new Error(`Unsupported upload type: ${uploadType}. Supported types: avatar, menu`);
  }
};

/**
 * Validation helper to ensure upload type is valid
 * @param {string} uploadType - The upload type to validate
 * @returns {boolean} True if valid, false otherwise
 * @example
 * isValidUploadType('avatar') // true
 * isValidUploadType('menu') // true
 * isValidUploadType('invalid') // false
 */
export const isValidUploadType = (uploadType) => {
  return ['avatar', 'menu'].includes(uploadType);
};

/**
 * Runtime validation of Cloudinary environment variables
 * @returns {Object} Validation result with status and missing variables
 */
export const validateCloudinaryConfig = () => {
  const required = ['VITE_CLOUDINARY_CLOUD_NAME', 'VITE_CLOUDINARY_UPLOAD_PRESET'];
  const optional = ['VITE_CLOUDINARY_AVATAR_FOLDER', 'VITE_CLOUDINARY_MENU_FOLDER'];
  
  const missing = required.filter(key => !import.meta.env[key]);
  const missingOptional = optional.filter(key => !import.meta.env[key]);
  
  return {
    isValid: missing.length === 0,
    missing,
    missingOptional,
    hasWarnings: missingOptional.length > 0
  };
};

/**
 * Default export for convenience
 */
export default {
  ...CLOUDINARY_CONFIG,
  getCloudinaryFolder,
  isValidUploadType
};