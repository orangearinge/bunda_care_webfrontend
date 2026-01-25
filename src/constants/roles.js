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
 * Array of roles for usage in selects, filters, etc.
 */
export const ROLES_LIST = Object.values(USER_ROLES);

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
