/**
 * User roles constants
 */
export const USER_ROLES = {
    ADMIN: "ADMIN",
    IBU_HAMIL: "IBU_HAMIL",
    IBU_MENYUSUI: "IBU_MENYUSUI",
    ANAK_BATITA: "ANAK_BATITA",
};

/**
 * User-friendly labels for roles
 */
export const ROLE_LABELS = {
    [USER_ROLES.ADMIN]: 'Admin',
    [USER_ROLES.IBU_HAMIL]: 'Ibu Hamil',
    [USER_ROLES.IBU_MENYUSUI]: 'Ibu Menyusui',
    [USER_ROLES.ANAK_BATITA]: 'Anak Batita'
}

/**
 * Array of roles for usage in selects, filters, etc.
 */
export const ROLES_LIST = Object.values(USER_ROLES);

/**
 * Role options for select components
 */
export const ROLE_OPTIONS = ROLES_LIST.map(role => ({
    value: role,
    label: ROLE_LABELS[role] || role
}));

/**
 * Get user-friendly label for a role
 */
export function getRoleLabel(role) {
    return ROLE_LABELS[role] || role
}

/**
 * Get role description based on backend requirements
 */
export function getRoleDescription(role) {
    const descriptions = {
        [USER_ROLES.ADMIN]: 'Administrator with full system access',
        [USER_ROLES.IBU_HAMIL]: 'Pregnant mother with nutrition tracking for pregnancy',
        [USER_ROLES.IBU_MENYUSUI]: 'Breastfeeding mother with lactation monitoring',
        [USER_ROLES.ANAK_BATITA]: 'Parent tracking child nutrition for toddlers'
    }
    return descriptions[role] || 'User role'
}

/**
 * Get required fields for a specific role
 */
export function getRoleRequiredFields(role) {
    const requirements = {
        [USER_ROLES.IBU_HAMIL]: [
            'weight_kg',
            'height_cm',
            'age_year',
            'gestational_age_week',
            'belly_circumference_cm',
            'lila_cm'
        ],
        [USER_ROLES.IBU_MENYUSUI]: [
            'weight_kg',
            'height_cm',
            'age_year',
            'lactation_ml'
        ],
        [USER_ROLES.ANAK_BATITA]: [
            'weight_kg',
            'height_cm',
            'age_year'
        ],
        [USER_ROLES.ADMIN]: []
    }
    return requirements[role] || []
}

/**
 * Check if a role is valid
 */
export function isValidRole(role) {
    return ROLES_LIST.includes(role)
}

/**
 * Meal types for menus
 */
export const MEAL_TYPES = {
    BREAKFAST: "BREAKFAST",
    LUNCH: "LUNCH",
    DINNER: "DINNER",
};

export const MEAL_TYPES_LIST = Object.values(MEAL_TYPES);

/**
 * Target roles for menus (specific age ranges for children)
 */
export const MENU_TARGET_ROLES = {
    IBU: "IBU",
    ANAK_6_8: "ANAK_6_8",
    ANAK_9_11: "ANAK_9_11",
    ANAK_12_23: "ANAK_12_23",
};

export const MENU_TARGET_ROLES_LIST = Object.values(MENU_TARGET_ROLES);
