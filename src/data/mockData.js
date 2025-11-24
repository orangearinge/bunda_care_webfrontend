// Mock data for admin dashboard - to be replaced with real API calls

export const mockUsers = [
    { id: 1, name: "John Doe", email: "john@example.com", role: "ADMIN", createdAt: "2024-01-15" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", role: "USER", createdAt: "2024-02-20" },
    { id: 3, name: "Bob Johnson", email: "bob@example.com", role: "USER", createdAt: "2024-03-10" },
    { id: 4, name: "Alice Williams", email: "alice@example.com", role: "USER", createdAt: "2024-03-15" },
    { id: 5, name: "Charlie Brown", email: "charlie@example.com", role: "ADMIN", createdAt: "2024-04-01" },
    { id: 6, name: "Diana Prince", email: "diana@example.com", role: "USER", createdAt: "2024-04-10" },
    { id: 7, name: "Eve Davis", email: "eve@example.com", role: "USER", createdAt: "2024-05-01" },
    { id: 8, name: "Frank Miller", email: "frank@example.com", role: "USER", createdAt: "2024-05-15" },
    { id: 9, name: "Grace Lee", email: "grace@example.com", role: "USER", createdAt: "2024-06-01" },
    { id: 10, name: "Henry Wilson", email: "henry@example.com", role: "USER", createdAt: "2024-06-20" },
]

export const mockIngredients = [
    { id: 1, name: "Brown Rice", alt_names: "Beras Merah", calories: 370, protein_g: 7.9, carbs_g: 77.2, fat_g: 2.9 },
    { id: 2, name: "Chicken Breast", alt_names: "Dada Ayam", calories: 165, protein_g: 31.0, carbs_g: 0.0, fat_g: 3.6 },
    { id: 3, name: "Broccoli", alt_names: "Brokoli", calories: 34, protein_g: 2.8, carbs_g: 7.0, fat_g: 0.4 },
    { id: 4, name: "Sweet Potato", alt_names: "Ubi Jalar", calories: 86, protein_g: 1.6, carbs_g: 20.1, fat_g: 0.1 },
    { id: 5, name: "Salmon", alt_names: "Ikan Salmon", calories: 208, protein_g: 20.0, carbs_g: 0.0, fat_g: 13.0 },
    { id: 6, name: "Spinach", alt_names: "Bayam", calories: 23, protein_g: 2.9, carbs_g: 3.6, fat_g: 0.4 },
    { id: 7, name: "Egg", alt_names: "Telur", calories: 155, protein_g: 13.0, carbs_g: 1.1, fat_g: 11.0 },
    { id: 8, name: "Oatmeal", alt_names: "Oat", calories: 389, protein_g: 16.9, carbs_g: 66.3, fat_g: 6.9 },
    { id: 9, name: "Banana", alt_names: "Pisang", calories: 89, protein_g: 1.1, carbs_g: 22.8, fat_g: 0.3 },
    { id: 10, name: "Avocado", alt_names: "Alpukat", calories: 160, protein_g: 2.0, carbs_g: 8.5, fat_g: 14.7 },
    { id: 11, name: "Tofu", alt_names: "Tahu", calories: 76, protein_g: 8.0, carbs_g: 1.9, fat_g: 4.8 },
    { id: 12, name: "Quinoa", alt_names: "Kinoa", calories: 368, protein_g: 14.1, carbs_g: 64.2, fat_g: 6.1 },
    { id: 13, name: "Almonds", alt_names: "Kacang Almond", calories: 579, protein_g: 21.2, carbs_g: 21.6, fat_g: 49.9 },
    { id: 14, name: "Greek Yogurt", alt_names: "Yogurt Yunani", calories: 59, protein_g: 10.0, carbs_g: 3.6, fat_g: 0.4 },
    { id: 15, name: "Blueberries", alt_names: "Blueberry", calories: 57, protein_g: 0.7, carbs_g: 14.5, fat_g: 0.3 },
    { id: 16, name: "Carrots", alt_names: "Wortel", calories: 41, protein_g: 0.9, carbs_g: 9.6, fat_g: 0.2 },
    { id: 17, name: "Tomato", alt_names: "Tomat", calories: 18, protein_g: 0.9, carbs_g: 3.9, fat_g: 0.2 },
    { id: 18, name: "Olive Oil", alt_names: "Minyak Zaitun", calories: 884, protein_g: 0.0, carbs_g: 0.0, fat_g: 100.0 },
    { id: 19, name: "Lentils", alt_names: "Kacang Lentil", calories: 116, protein_g: 9.0, carbs_g: 20.1, fat_g: 0.4 },
    { id: 20, name: "Green Beans", alt_names: "Buncis", calories: 31, protein_g: 1.8, carbs_g: 7.0, fat_g: 0.2 },
]

export const mockMenus = [
    {
        id: 1,
        name: "Healthy Breakfast Bowl",
        meal_type: "BREAKFAST",
        tags: "healthy,protein,fiber",
        is_active: true,
        ingredients: [
            { ingredient_id: 8, ingredient_name: "Oatmeal", quantity_g: 50 },
            { ingredient_id: 9, ingredient_name: "Banana", quantity_g: 100 },
            { ingredient_id: 15, ingredient_name: "Blueberries", quantity_g: 50 },
            { ingredient_id: 13, ingredient_name: "Almonds", quantity_g: 20 },
        ]
    },
    {
        id: 2,
        name: "Grilled Chicken Salad",
        meal_type: "LUNCH",
        tags: "protein,low-carb,salad",
        is_active: true,
        ingredients: [
            { ingredient_id: 2, ingredient_name: "Chicken Breast", quantity_g: 150 },
            { ingredient_id: 6, ingredient_name: "Spinach", quantity_g: 100 },
            { ingredient_id: 17, ingredient_name: "Tomato", quantity_g: 50 },
            { ingredient_id: 16, ingredient_name: "Carrots", quantity_g: 30 },
            { ingredient_id: 18, ingredient_name: "Olive Oil", quantity_g: 10 },
        ]
    },
    {
        id: 3,
        name: "Salmon with Quinoa",
        meal_type: "DINNER",
        tags: "omega-3,protein,healthy-fats",
        is_active: true,
        ingredients: [
            { ingredient_id: 5, ingredient_name: "Salmon", quantity_g: 200 },
            { ingredient_id: 12, ingredient_name: "Quinoa", quantity_g: 100 },
            { ingredient_id: 3, ingredient_name: "Broccoli", quantity_g: 150 },
            { ingredient_id: 18, ingredient_name: "Olive Oil", quantity_g: 10 },
        ]
    },
    {
        id: 4,
        name: "Protein Smoothie",
        meal_type: "BREAKFAST",
        tags: "protein,quick,smoothie",
        is_active: true,
        ingredients: [
            { ingredient_id: 14, ingredient_name: "Greek Yogurt", quantity_g: 200 },
            { ingredient_id: 9, ingredient_name: "Banana", quantity_g: 100 },
            { ingredient_id: 15, ingredient_name: "Blueberries", quantity_g: 75 },
        ]
    },
    {
        id: 5,
        name: "Vegetarian Buddha Bowl",
        meal_type: "LUNCH",
        tags: "vegetarian,fiber,balanced",
        is_active: true,
        ingredients: [
            { ingredient_id: 1, ingredient_name: "Brown Rice", quantity_g: 100 },
            { ingredient_id: 11, ingredient_name: "Tofu", quantity_g: 150 },
            { ingredient_id: 4, ingredient_name: "Sweet Potato", quantity_g: 100 },
            { ingredient_id: 6, ingredient_name: "Spinach", quantity_g: 50 },
            { ingredient_id: 10, ingredient_name: "Avocado", quantity_g: 50 },
        ]
    },
    {
        id: 6,
        name: "Egg White Omelet",
        meal_type: "BREAKFAST",
        tags: "protein,low-fat,eggs",
        is_active: false,
        ingredients: [
            { ingredient_id: 7, ingredient_name: "Egg", quantity_g: 150 },
            { ingredient_id: 6, ingredient_name: "Spinach", quantity_g: 50 },
            { ingredient_id: 17, ingredient_name: "Tomato", quantity_g: 30 },
        ]
    },
    {
        id: 7,
        name: "Lentil Soup",
        meal_type: "DINNER",
        tags: "vegetarian,soup,fiber",
        is_active: true,
        ingredients: [
            { ingredient_id: 19, ingredient_name: "Lentils", quantity_g: 150 },
            { ingredient_id: 16, ingredient_name: "Carrots", quantity_g: 75 },
            { ingredient_id: 17, ingredient_name: "Tomato", quantity_g: 100 },
            { ingredient_id: 6, ingredient_name: "Spinach", quantity_g: 50 },
        ]
    },
]

// Dashboard statistics
export const mockDashboardStats = {
    total_users: 1234,
    total_users_change: 12.5,
    total_active_menus: 7,
    active_menus_change: 16.7,
    total_ingredients: 20,
    ingredients_change: 25.0,
    active_users_today: 456,
    active_users_change: 8.3,
}

// User growth data for chart
export const mockUserGrowthData = [
    { date: "2024-01-01", count: 850 },
    { date: "2024-01-15", count: 920 },
    { date: "2024-02-01", count: 980 },
    { date: "2024-02-15", count: 1050 },
    { date: "2024-03-01", count: 1100 },
    { date: "2024-03-15", count: 1150 },
    { date: "2024-04-01", count: 1180 },
    { date: "2024-04-15", count: 1190 },
    { date: "2024-05-01", count: 1210 },
    { date: "2024-05-15", count: 1220 },
    { date: "2024-06-01", count: 1230 },
    { date: "2024-06-15", count: 1234 },
]
