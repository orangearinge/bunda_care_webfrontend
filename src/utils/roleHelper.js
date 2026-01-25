/**
 * Role definitions and helper functions
 * Based on backend role structure from Flask API
 */

export const ROLES = {
    ADMIN: 'ADMIN',
    IBU_HAMIL: 'IBU_HAMIL',
    IBU_MENYUSUI: 'IBU_MENYUSUI',
    ANAK_BATITA: 'ANAK_BATITA'
}

export const ROLE_LABELS = {
    [ROLES.ADMIN]: 'Admin',
    [ROLES.IBU_HAMIL]: 'Ibu Hamil',
    [ROLES.IBU_MENYUSUI]: 'Ibu Menyusui',
    [ROLES.ANAK_BATITA]: 'Anak Batita'
}

export const ROLE_OPTIONS = [
    { value: ROLES.ADMIN, label: ROLE_LABELS[ROLES.ADMIN] },
    { value: ROLES.IBU_HAMIL, label: ROLE_LABELS[ROLES.IBU_HAMIL] },
    { value: ROLES.IBU_MENYUSUI, label: ROLE_LABELS[ROLES.IBU_MENYUSUI] },
    { value: ROLES.ANAK_BATITA, label: ROLE_LABELS[ROLES.ANAK_BATITA] }
]

/**
 * Get user-friendly label for a role
 * @param {string} role - Role value (e.g., 'IBU_HAMIL')
 * @returns {string} User-friendly label (e.g., 'Ibu Hamil')
 */
export function getRoleLabel(role) {
    return ROLE_LABELS[role] || role
}

/**
 * Get role description based on backend requirements
 * @param {string} role - Role value
 * @returns {string} Role description
 */
export function getRoleDescription(role) {
    const descriptions = {
        [ROLES.ADMIN]: 'Administrator with full system access',
        [ROLES.IBU_HAMIL]: 'Pregnant mother with nutrition tracking for pregnancy',
        [ROLES.IBU_MENYUSUI]: 'Breastfeeding mother with lactation monitoring',
        [ROLES.ANAK_BATITA]: 'Parent tracking child nutrition for toddlers'
    }
    return descriptions[role] || 'User role'
}

/**
 * Get required fields for a specific role (based on backend validation)
 * @param {string} role - Role value
 * @returns {string[]} Array of required field names
 */
export function getRoleRequiredFields(role) {
    const requirements = {
        [ROLES.IBU_HAMIL]: [
            'weight_kg',
            'height_cm',
            'age_year',
            'gestational_age_week',
            'belly_circumference_cm',
            'lila_cm'
        ],
        [ROLES.IBU_MENYUSUI]: [
            'weight_kg',
            'height_cm',
            'age_year',
            'lactation_ml'
        ],
        [ROLES.ANAK_BATITA]: [
            'weight_kg',
            'height_cm',
            'age_year'
        ],
        [ROLES.ADMIN]: []
    }
    return requirements[role] || []
}

/**
 * Check if a role is valid
 * @param {string} role - Role to validate
 * @returns {boolean} True if role is valid
 */
export function isValidRole(role) {
    return Object.values(ROLES).includes(role)
}
