// This should be your main FoodItem interface
export interface FoodItem {
    id: string; // Add ID for uniqueness
    name: string; // Food name
    calories: number; // Calories
    protein: number; // Protein content
    fat: number; // Fat content
    carbs: number; // Carbohydrates content
    quantity: number; // Amount in grams
    food?: {
        foodId: string;
        label: string;
        nutrients: FoodNutrients;
    };
}
  
export interface FoodCategory {
    category: string;
    items: FoodItem[];
}

export interface Meal {
    mealName: string;
    categories: FoodCategory[];
}

export interface FoodData {
    breakfastCategories: FoodCategory[];
    lunchCategories: FoodCategory[];
    dinnerCategories: FoodCategory[];
}

export interface FoodNutrients {
    ENERC_KCAL: number; // Calories
    PROCNT: number; // Protein
    FAT: number; // Fat
    CHOCDF: number; // Carbohydrates
}
  

export const mealData: Meal[] = [
    {
        mealName: 'Breakfast',
        categories: [
            {
                category: 'Protein',
                items: [
                    { id: 'BP1', name: 'Eggs', calories: 155, protein: 13, fat: 11, carbs: 1.1, quantity: 100 },
                    { id: 'BP2', name: 'Greek Yogurt', calories: 100, protein: 10, fat: 0, carbs: 4, quantity: 100 },
                    { id: 'BP3', name: 'Cottage Cheese', calories: 98, protein: 11, fat: 4.3, carbs: 3.4, quantity: 100 },
                    { id: 'BP4', name: 'Almond Butter', calories: 614, protein: 21, fat: 54, carbs: 18, quantity: 100 },
                    { id: 'BP5', name: 'Turkey Slices', calories: 189, protein: 29, fat: 7, carbs: 0, quantity: 100 },
                    { id: 'BP6', name: 'Whey Protein', calories: 400, protein: 83.3, fat: 3.3, carbs: 10, quantity: 100 },
                    { id: 'BP7', name: 'Chia Seeds', calories: 486, protein: 17, fat: 31, carbs: 42, quantity: 100 },
                    { id: 'BP8', name: 'Tempeh', calories: 192, protein: 20, fat: 11, carbs: 9, quantity: 100 },
                    { id: 'BP9', name: 'Canned Light Tuna in Water', calories: 132, protein: 29, fat: 0.5, carbs: 0, quantity: 100 },
                    { id: 'BP10', name: 'Canned White Tuna (Albacore) in Water', calories: 165, protein: 36, fat: 1, carbs: 0, quantity: 100 },
                    { id: 'BP11', name: 'Canned Tuna in Olive Oil', calories: 191, protein: 27, fat: 9, carbs: 0, quantity: 100 },
                    { id: 'BP12', name: 'Canned Yellowfin Tuna in Water', calories: 140, protein: 29, fat: 1, carbs: 0, quantity: 100 },            
                ],
            },
            {
                category: 'Carb',
                items: [
                    { id: 'BC1', name: 'Brown Rice', calories: 111, protein: 2.6, fat: 0.9, carbs: 23, quantity: 100 },
                    { id: 'BC2', name: 'Sweet Potato', calories: 86, protein: 1.6, fat: 0.1, carbs: 20, quantity: 100 },
                    { id: 'BC3', name: 'Whole Grain Pasta', calories: 124, protein: 5.8, fat: 0.6, carbs: 27, quantity: 100 },
                    { id: 'BC4', name: 'Couscous', calories: 112, protein: 3.8, fat: 0.2, carbs: 23, quantity: 100 },
                    { id: 'BC5', name: 'Bulgur', calories: 83, protein: 3.1, fat: 0.2, carbs: 18.6, quantity: 100 },
                    { id: 'BC6', name: 'Quinoa', calories: 120, protein: 4.1, fat: 1.9, carbs: 21, quantity: 100 },
                    { id: 'BC7', name: 'Farro', calories: 170, protein: 6, fat: 1.5, carbs: 34, quantity: 100 },
                    { id: 'BC8', name: 'Oats', calories: 389, protein: 17, fat: 7, carbs: 66, quantity: 100 },
                    { id: 'BC9', name: 'Barley', calories: 354, protein: 12, fat: 2.3, carbs: 73.5, quantity: 100 },
                    { id: 'BC10', name: 'Buckwheat', calories: 343, protein: 13, fat: 3.4, carbs: 72, quantity: 100 },
                    { id: 'BC11', name: 'Millet', calories: 119, protein: 3.5, fat: 1, carbs: 23, quantity: 100 },
                    { id: 'BC12', name: 'Corn', calories: 96, protein: 3.4, fat: 1.5, carbs: 21, quantity: 100 },
                    { id: 'BC13', name: 'White Rice', calories: 130, protein: 2.4, fat: 0.3, carbs: 28.7, quantity: 100 },
                    { id: 'BC14', name: 'Polenta', calories: 70, protein: 2, fat: 0.7, carbs: 15, quantity: 100 },
                    { id: 'BC15', name: 'Whole Wheat Bread', calories: 69, protein: 3.6, fat: 1.1, carbs: 12, quantity: 100 },
                    { id: 'BC16', name: 'Rye Bread', calories: 259, protein: 8.5, fat: 3.3, carbs: 48.3, quantity: 100 },
                    { id: 'BC17', name: 'Pita Bread', calories: 275, protein: 9.1, fat: 1.2, carbs: 55, quantity: 100 },
                    { id: 'BC18', name: 'Sourdough Bread', calories: 289, protein: 9.2, fat: 1.8, carbs: 56, quantity: 100 },
                    { id: 'BC19', name: 'Bagel', calories: 250, protein: 9, fat: 1.5, carbs: 48, quantity: 100 },
                    { id: 'BC20', name: 'Ciabatta', calories: 271, protein: 9, fat: 3.6, carbs: 52, quantity: 100 },
                    { id: 'BC21', name: 'Baguette', calories: 270, protein: 9, fat: 1, carbs: 57, quantity: 100 },
                ],
            },
            {
                category: 'Fat',
                items: [
                    { id: 'BF1', name: 'Avocado', calories: 160, protein: 2, fat: 15, carbs: 9, quantity: 100 },
                    { id: 'BF2', name: 'Sunflower Seeds', calories: 584, protein: 21, fat: 51, carbs: 20, quantity: 100 },
                    { id: 'BF3', name: 'Butter', calories: 717, protein: 0.9, fat: 81, carbs: 0.1, quantity: 100 },
                    { id: 'BF4', name: 'Tahini', calories: 595, protein: 17, fat: 53, carbs: 21, quantity: 100 },
                    { id: 'BF5', name: 'Olive Oil', calories: 884, protein: 0, fat: 100, carbs: 0, quantity: 100 },
                    { id: 'BF6', name: 'Almonds', calories: 579, protein: 21, fat: 50, carbs: 22, quantity: 100 },
                    { id: 'BF7', name: 'Peanut Butter', calories: 588, protein: 25, fat: 50, carbs: 20, quantity: 100 },
                    { id: 'BF8', name: 'Walnuts', calories: 654, protein: 15, fat: 65, carbs: 14, quantity: 100 },
                    { id: 'BF9', name: 'Chia Seeds', calories: 486, protein: 16, fat: 31, carbs: 42, quantity: 100 },
                    { id: 'BF10', name: 'Avocado', calories: 160, protein: 2, fat: 15, carbs: 9, quantity: 100 },
                    { id: 'BF11', name: 'Flax Seeds', calories: 534, protein: 18, fat: 42, carbs: 29, quantity: 100 },
                    { id: 'BF12', name: 'Coconut Oil', calories: 862, protein: 0, fat: 100, carbs: 0, quantity: 100 },
                    { id: 'BF13', name: 'Pumpkin Seeds', calories: 559, protein: 30, fat: 49, carbs: 10, quantity: 100 },
                    { id: 'BF14', name: 'Sesame Seeds', calories: 573, protein: 17, fat: 50, carbs: 23, quantity: 100 },
                    { id: 'BF15', name: 'Hazelnuts', calories: 628, protein: 15, fat: 61, carbs: 17, quantity: 100 },
                    { id: 'BF16', name: 'Cashews', calories: 553, protein: 18, fat: 44, carbs: 30, quantity: 100 },
                    { id: 'BF17', name: 'Pecans', calories: 691, protein: 9, fat: 72, carbs: 14, quantity: 100 },
                    { id: 'BF18', name: 'Macadamia Nuts', calories: 718, protein: 8, fat: 76, carbs: 14, quantity: 100 },
                ],
                            },
            {
                category: 'Vegetable',
                items: [
                    { id: 'BV1', name: 'Spinach', calories: 23, protein: 2.9, fat: 0.4, carbs: 3.6, quantity: 100 },
                    { id: 'BV2', name: 'Tomato', calories: 18, protein: 0.9, fat: 0.2, carbs: 3.9, quantity: 100 },
                    { id: 'BV3', name: 'Bell Pepper', calories: 31, protein: 1, fat: 0.3, carbs: 6, quantity: 100 },
                    { id: 'BV4', name: 'Cucumber', calories: 16, protein: 0.7, fat: 0.1, carbs: 3.6, quantity: 100 },
                    { id: 'BV5', name: 'Carrot', calories: 41, protein: 0.9, fat: 0.2, carbs: 10, quantity: 100 },
                    { id: 'BV6', name: 'Kale', calories: 35, protein: 2.9, fat: 0.6, carbs: 4.4, quantity: 100 },
                    { id: 'BV7', name: 'Zucchini', calories: 17, protein: 1.2, fat: 0.3, carbs: 3.1, quantity: 100 },
                    { id: 'BV8', name: 'Eggplant', calories: 25, protein: 1, fat: 0.2, carbs: 6, quantity: 100 },
                    { id: 'BV9', name: 'Cabbage', calories: 25, protein: 1.3, fat: 0.1, carbs: 6, quantity: 100 },
                    { id: 'BV10', name: 'Sweet Potato', calories: 86, protein: 1.6, fat: 0.1, carbs: 20, quantity: 100 },
                    { id: 'BV11', name: 'Radish', calories: 16, protein: 0.7, fat: 0.1, carbs: 3.4, quantity: 100 },
                    { id: 'BV12', name: 'Beets', calories: 43, protein: 1.6, fat: 0.2, carbs: 10, quantity: 100 },
                    { id: 'BV13', name: 'Lettuce', calories: 15, protein: 1.4, fat: 0.2, carbs: 2.9, quantity: 100 },
                    { id: 'BV14', name: 'Kale', calories: 49, protein: 4.3, fat: 0.9, carbs: 9, quantity: 100 },
                ],
                            },
            {
                category: 'Fruit',
                items: [
                    { id: 'BF1', name: 'Banana', calories: 89, protein: 1.1, fat: 0.3, carbs: 23, quantity: 100 },
                    { id: 'BF2', name: 'Apple', calories: 52, protein: 0.3, fat: 0.2, carbs: 14, quantity: 100 },
                    { id: 'BF3', name: 'Blueberries', calories: 57, protein: 0.7, fat: 0.3, carbs: 14, quantity: 100 },
                    { id: 'BF4', name: 'Strawberries', calories: 32, protein: 0.7, fat: 0.3, carbs: 7.7, quantity: 100 },
                    { id: 'BF5', name: 'Mango', calories: 60, protein: 0.8, fat: 0.4, carbs: 15, quantity: 100 },
                    { id: 'BF6', name: 'Orange', calories: 47, protein: 0.9, fat: 0.1, carbs: 12, quantity: 100 },
                    { id: 'BF7', name: 'Kiwi', calories: 61, protein: 1.1, fat: 0.5, carbs: 15, quantity: 100 },
                    { id: 'BF8', name: 'Plum', calories: 46, protein: 0.7, fat: 0.3, carbs: 11, quantity: 100 },
                    { id: 'BF9', name: 'Papaya', calories: 43, protein: 0.5, fat: 0.3, carbs: 11, quantity: 100 },
                    { id: 'BF10', name: 'Watermelon', calories: 30, protein: 0.6, fat: 0.2, carbs: 8, quantity: 100 },
                    { id: 'BF11', name: 'Grapes', calories: 69, protein: 0.7, fat: 0.2, carbs: 18, quantity: 100 },
                    { id: 'BF12', name: 'Peach', calories: 39, protein: 0.9, fat: 0.3, carbs: 10, quantity: 100 },
                    { id: 'BF13', name: 'Pineapple', calories: 50, protein: 0.5, fat: 0.1, carbs: 13, quantity: 100 },
                ],
                            },
        ],
    },
    {
        mealName: 'Lunch',
        categories: [
                {
                    category: 'Protein',
                    items: [
                        { id: 'LP1', name: 'Chicken Breast', calories: 165, protein: 31, fat: 3.6, carbs: 0, quantity: 100 },
                        { id: 'LP2', name: 'Tofu', calories: 144, protein: 15, fat: 8, carbs: 2, quantity: 100 },
                        { id: 'LP3', name: 'Ground Beef', calories: 250, protein: 26, fat: 15, carbs: 0, quantity: 100 },
                        { id: 'LP4', name: 'Lentils', calories: 116, protein: 9, fat: 0.4, carbs: 20, quantity: 100 },
                        { id: 'LP5', name: 'Salmon', calories: 208, protein: 20, fat: 13, carbs: 0, quantity: 100 },
                        { id: 'LP6', name: 'Turkey Breast', calories: 104, protein: 23, fat: 0.8, carbs: 0, quantity: 100 },
                        { id: 'LP7', name: 'Shrimp', calories: 99, protein: 24, fat: 0.3, carbs: 0.2, quantity: 100 },
                        { id: 'LP8', name: 'Cottage Cheese', calories: 98, protein: 11.1, fat: 4.3, carbs: 3.4, quantity: 100 },
                        { id: 'LP9', name: 'Eggs', calories: 155, protein: 13, fat: 11, carbs: 1.1, quantity: 100 },
                        { id: 'LP10', name: 'Tuna', calories: 132, protein: 29, fat: 0.5, carbs: 0, quantity: 100 },
                        { id: 'LP11', name: 'Chickpeas', calories: 164, protein: 9, fat: 2.6, carbs: 27, quantity: 100 },
                        { id: 'LP12', name: 'Tempeh', calories: 192, protein: 19, fat: 11, carbs: 9, quantity: 100 },
                        { id: 'LP13', name: 'Quinoa', calories: 120, protein: 4.1, fat: 1.9, carbs: 21, quantity: 100 },
                        { id: 'LP14', name: 'Pork Tenderloin', calories: 143, protein: 26, fat: 4, carbs: 0, quantity: 100 },
                        { id: 'LP15', name: 'Mackerel', calories: 205, protein: 19, fat: 13.9, carbs: 0, quantity: 100 },
                    ],
                },
                {
                    category: 'Carb',
                    items: [
                        { id: 'LC1', name: 'Brown Rice', calories: 111, protein: 2.6, fat: 0.9, carbs: 23, quantity: 100 },
                        { id: 'LC2', name: 'Sweet Potato', calories: 86, protein: 1.6, fat: 0.1, carbs: 20, quantity: 100 },
                        { id: 'LC3', name: 'Whole Grain Pasta', calories: 124, protein: 5.8, fat: 0.6, carbs: 27, quantity: 100 },
                        { id: 'LC4', name: 'Couscous', calories: 112, protein: 3.8, fat: 0.2, carbs: 23, quantity: 100 },
                        { id: 'LC5', name: 'Bulgur', calories: 83, protein: 3.1, fat: 0.2, carbs: 18.6, quantity: 100 },
                        { id: 'LC6', name: 'Quinoa', calories: 120, protein: 4.1, fat: 1.9, carbs: 21, quantity: 100 },
                        { id: 'LC7', name: 'Farro', calories: 170, protein: 6, fat: 1.5, carbs: 34, quantity: 100 },
                        { id: 'LC8', name: 'Oats', calories: 389, protein: 17, fat: 7, carbs: 66, quantity: 100 },
                        { id: 'LC9', name: 'Barley', calories: 354, protein: 12, fat: 2.3, carbs: 73.5, quantity: 100 },
                        { id: 'LC10', name: 'Buckwheat', calories: 343, protein: 13, fat: 3.4, carbs: 72, quantity: 100 },
                        { id: 'LC11', name: 'Millet', calories: 119, protein: 3.5, fat: 1, carbs: 23, quantity: 100 },
                        { id: 'LC12', name: 'Corn', calories: 96, protein: 3.4, fat: 1.5, carbs: 21, quantity: 100 },
                        { id: 'LC13', name: 'White Rice', calories: 130, protein: 2.4, fat: 0.3, carbs: 28.7, quantity: 100 },
                        { id: 'LC14', name: 'Polenta', calories: 70, protein: 2, fat: 0.7, carbs: 15, quantity: 100 },
                        { id: 'LC15', name: 'Whole Wheat Bread', calories: 69, protein: 3.6, fat: 1.1, carbs: 12, quantity: 100 },
                        { id: 'LC16', name: 'Rye Bread', calories: 259, protein: 8.5, fat: 3.3, carbs: 48.3, quantity: 100 },
                        { id: 'LC17', name: 'Pita Bread', calories: 275, protein: 9.1, fat: 1.2, carbs: 55, quantity: 100 },
                        { id: 'LC18', name: 'Sourdough Bread', calories: 289, protein: 9.2, fat: 1.8, carbs: 56, quantity: 100 },
                        { id: 'LC19', name: 'Bagel', calories: 250, protein: 9, fat: 1.5, carbs: 48, quantity: 100 },
                        { id: 'LC20', name: 'Ciabatta', calories: 271, protein: 9, fat: 3.6, carbs: 52, quantity: 100 },
                        { id: 'LC21', name: 'Baguette', calories: 270, protein: 9, fat: 1, carbs: 57, quantity: 100 },
                    ],
                },
                {
                    category: 'Fat',
                    items: [
                        { id: 'LF1', name: 'Avocado', calories: 160, protein: 2, fat: 15, carbs: 9, quantity: 100 },
                        { id: 'LF2', name: 'Butter', calories: 717, protein: 0.9, fat: 81, carbs: 0.1, quantity: 100 },
                        { id: 'LF3', name: 'Tahini', calories: 595, protein: 17, fat: 53, carbs: 21, quantity: 100 },
                        { id: 'LF4', name: 'Olive Oil', calories: 884, protein: 0, fat: 100, carbs: 0, quantity: 100 },
                        { id: 'LF5', name: 'Almonds', calories: 579, protein: 21, fat: 50, carbs: 22, quantity: 100 },
                        { id: 'LF6', name: 'Peanut Butter', calories: 588, protein: 25, fat: 50, carbs: 20, quantity: 100 },
                        { id: 'LF7', name: 'Walnuts', calories: 654, protein: 15, fat: 65, carbs: 14, quantity: 100 },
                        { id: 'LF8', name: 'Chia Seeds', calories: 486, protein: 16, fat: 31, carbs: 42, quantity: 100 },
                        { id: 'LF9', name: 'Avocado', calories: 160, protein: 2, fat: 15, carbs: 9, quantity: 100 },
                        { id: 'LF10', name: 'Flax Seeds', calories: 534, protein: 18, fat: 42, carbs: 29, quantity: 100 },
                        { id: 'LF11', name: 'Coconut Oil', calories: 862, protein: 0, fat: 100, carbs: 0, quantity: 100 },
                        { id: 'LF12', name: 'Pumpkin Seeds', calories: 559, protein: 30, fat: 49, carbs: 10, quantity: 100 },
                        { id: 'LF13', name: 'Sesame Seeds', calories: 573, protein: 17, fat: 50, carbs: 23, quantity: 100 },
                        { id: 'LF14', name: 'Sunflower Seeds', calories: 584, protein: 20, fat: 51, carbs: 20, quantity: 100 },
                        { id: 'LF15', name: 'Hazelnuts', calories: 628, protein: 15, fat: 61, carbs: 17, quantity: 100 },
                        { id: 'LF16', name: 'Cashews', calories: 553, protein: 18, fat: 44, carbs: 30, quantity: 100 },
                        { id: 'LF17', name: 'Pecans', calories: 691, protein: 9, fat: 72, carbs: 14, quantity: 100 },
                        { id: 'LF18', name: 'Macadamia Nuts', calories: 718, protein: 8, fat: 76, carbs: 14, quantity: 100 },
                        ],
                },
                    {
                category: 'Vegetable',
                items: [
                    { id: 'LV1', name: 'Spinach', calories: 23, protein: 2.9, fat: 0.4, carbs: 3.6, quantity: 100 },
                    { id: 'LV2', name: 'Tomato', calories: 18, protein: 0.9, fat: 0.2, carbs: 3.9, quantity: 100 },
                    { id: 'LV3', name: 'Bell Pepper', calories: 31, protein: 1, fat: 0.3, carbs: 6, quantity: 100 },
                    { id: 'LV4', name: 'Cucumber', calories: 16, protein: 0.7, fat: 0.1, carbs: 3.6, quantity: 100 },
                    { id: 'LV5', name: 'Carrot', calories: 41, protein: 0.9, fat: 0.2, carbs: 10, quantity: 100 },
                    { id: 'LV6', name: 'Kale', calories: 35, protein: 2.9, fat: 0.6, carbs: 4.4, quantity: 100 },
                    { id: 'LV7', name: 'Zucchini', calories: 17, protein: 1.2, fat: 0.3, carbs: 3.1, quantity: 100 },
                    { id: 'LV8', name: 'Eggplant', calories: 25, protein: 1, fat: 0.2, carbs: 6, quantity: 100 },
                    { id: 'LV9', name: 'Cabbage', calories: 25, protein: 1.3, fat: 0.1, carbs: 6, quantity: 100 },
                    { id: 'LV10', name: 'Sweet Potato', calories: 86, protein: 1.6, fat: 0.1, carbs: 20, quantity: 100 },
                    { id: 'LV11', name: 'Radish', calories: 16, protein: 0.7, fat: 0.1, carbs: 3.4, quantity: 100 },
                    { id: 'LV12', name: 'Beets', calories: 43, protein: 1.6, fat: 0.2, carbs: 10, quantity: 100 },
                    { id: 'LV13', name: 'Lettuce', calories: 15, protein: 1.4, fat: 0.2, carbs: 2.9, quantity: 100 },
                    { id: 'LV14', name: 'Kale', calories: 49, protein: 4.3, fat: 0.9, carbs: 9, quantity: 100 },
                ],
            },
            {
                category: 'Fruit',
                items: [
                    { id: 'LF1', name: 'Banana', calories: 89, protein: 1.1, fat: 0.3, carbs: 23, quantity: 100 },
                    { id: 'LF2', name: 'Apple', calories: 52, protein: 0.3, fat: 0.2, carbs: 14, quantity: 100 },
                    { id: 'LF3', name: 'Blueberries', calories: 57, protein: 0.7, fat: 0.3, carbs: 14, quantity: 100 },
                    { id: 'LF4', name: 'Strawberries', calories: 32, protein: 0.7, fat: 0.3, carbs: 7.7, quantity: 100 },
                    { id: 'LF5', name: 'Mango', calories: 60, protein: 0.8, fat: 0.4, carbs: 15, quantity: 100 },
                    { id: 'LF6', name: 'Orange', calories: 47, protein: 0.9, fat: 0.1, carbs: 12, quantity: 100 },
                    { id: 'LF7', name: 'Kiwi', calories: 61, protein: 1.1, fat: 0.5, carbs: 15, quantity: 100 },
                    { id: 'LF8', name: 'Plum', calories: 46, protein: 0.7, fat: 0.3, carbs: 11, quantity: 100 },
                    { id: 'LF9', name: 'Papaya', calories: 43, protein: 0.5, fat: 0.3, carbs: 11, quantity: 100 },
                    { id: 'LF10', name: 'Watermelon', calories: 30, protein: 0.6, fat: 0.2, carbs: 8, quantity: 100 },
                    { id: 'LF11', name: 'Grapes', calories: 69, protein: 0.7, fat: 0.2, carbs: 18, quantity: 100 },
                    { id: 'LF12', name: 'Peach', calories: 39, protein: 0.9, fat: 0.3, carbs: 10, quantity: 100 },
                    { id: 'LF13', name: 'Pineapple', calories: 50, protein: 0.5, fat: 0.1, carbs: 13, quantity: 100 },
                ],
            },
        ],
    },
    {
        mealName: 'Dinner',
        categories: [
            {
                category: 'Protein',
                items: [
                    { id: 'DP1', name: 'Tofu', calories: 76, protein: 8, fat: 4.8, carbs: 1.9, quantity: 100 },
                    { id: 'DP2', name: 'Lentils', calories: 116, protein: 9, fat: 0.4, carbs: 20, quantity: 100 },
                    { id: 'DP3', name: 'Grilled Chicken', calories: 165, protein: 31, fat: 3.6, carbs: 0, quantity: 100 },
                    { id: 'DP4', name: 'Salmon', calories: 208, protein: 20, fat: 13, carbs: 0, quantity: 100 },
                    { id: 'DP5', name: 'Tempeh', calories: 192, protein: 19, fat: 11, carbs: 9, quantity: 100 },
                    { id: 'DP6', name: 'Turkey Breast', calories: 104, protein: 23, fat: 0.8, carbs: 0, quantity: 100 },
                    { id: 'DP7', name: 'Cottage Cheese', calories: 98, protein: 11.1, fat: 4.3, carbs: 3.4, quantity: 100 },
                    { id: 'DP8', name: 'Tuna', calories: 132, protein: 29, fat: 0.5, carbs: 0, quantity: 100 },
                    { id: 'DP9', name: 'Eggs', calories: 155, protein: 13, fat: 11, carbs: 1.1, quantity: 100 },
                    { id: 'DP10', name: 'Shrimp', calories: 99, protein: 24, fat: 0.3, carbs: 0.2, quantity: 100 },
                ],
            },
            {
                category: 'Carb',
                items: [
                    { id: 'DC1', name: 'Brown Rice', calories: 111, protein: 2.6, fat: 0.9, carbs: 23, quantity: 100 },
                    { id: 'DC2', name: 'Sweet Potato', calories: 86, protein: 1.6, fat: 0.1, carbs: 20, quantity: 100 },
                    { id: 'DC3', name: 'Whole Grain Pasta', calories: 124, protein: 5.8, fat: 0.6, carbs: 27, quantity: 100 },
                    { id: 'DC4', name: 'Couscous', calories: 112, protein: 3.8, fat: 0.2, carbs: 23, quantity: 100 },
                    { id: 'DC5', name: 'Bulgur', calories: 83, protein: 3.1, fat: 0.2, carbs: 18.6, quantity: 100 },
                    { id: 'DC6', name: 'Quinoa', calories: 120, protein: 4.1, fat: 1.9, carbs: 21, quantity: 100 },
                    { id: 'DC7', name: 'Farro', calories: 170, protein: 6, fat: 1.5, carbs: 34, quantity: 100 },
                    { id: 'DC8', name: 'Oats', calories: 389, protein: 17, fat: 7, carbs: 66, quantity: 100 },
                    { id: 'DC9', name: 'Barley', calories: 354, protein: 12, fat: 2.3, carbs: 73.5, quantity: 100 },
                    { id: 'DC10', name: 'Buckwheat', calories: 343, protein: 13, fat: 3.4, carbs: 72, quantity: 100 },
                    { id: 'DC11', name: 'Millet', calories: 119, protein: 3.5, fat: 1, carbs: 23, quantity: 100 },
                    { id: 'DC12', name: 'Corn', calories: 96, protein: 3.4, fat: 1.5, carbs: 21, quantity: 100 },
                    { id: 'DC13', name: 'White Rice', calories: 130, protein: 2.4, fat: 0.3, carbs: 28.7, quantity: 100 },
                    { id: 'DC14', name: 'Polenta', calories: 70, protein: 2, fat: 0.7, carbs: 15, quantity: 100 },
                    { id: 'DC15', name: 'Whole Wheat Bread', calories: 69, protein: 3.6, fat: 1.1, carbs: 12, quantity: 100 },
                    { id: 'DC16', name: 'Rye Bread', calories: 259, protein: 8.5, fat: 3.3, carbs: 48.3, quantity: 100 },
                    { id: 'DC17', name: 'Pita Bread', calories: 275, protein: 9.1, fat: 1.2, carbs: 55, quantity: 100 },
                    { id: 'DC18', name: 'Sourdough Bread', calories: 289, protein: 9.2, fat: 1.8, carbs: 56, quantity: 100 },
                    { id: 'DC19', name: 'Bagel', calories: 250, protein: 9, fat: 1.5, carbs: 48, quantity: 100 },
                    { id: 'DC20', name: 'Ciabatta', calories: 271, protein: 9, fat: 3.6, carbs: 52, quantity: 100 },
                    { id: 'DC21', name: 'Baguette', calories: 270, protein: 9, fat: 1, carbs: 57, quantity: 100 },
                ],
            },
            {
                category: 'Fat',
                items: [
                    { id: 'DF1', name: 'Avocado', calories: 160, protein: 2, fat: 15, carbs: 9, quantity: 100 },
                    { id: 'DF2', name: 'Butter', calories: 717, protein: 0.9, fat: 81, carbs: 0.1, quantity: 100 },
                    { id: 'DF3', name: 'Tahini', calories: 595, protein: 17, fat: 53, carbs: 21, quantity: 100 },
                    { id: 'DF4', name: 'Olive Oil', calories: 884, protein: 0, fat: 100, carbs: 0, quantity: 100 },
                    { id: 'DF5', name: 'Almonds', calories: 579, protein: 21, fat: 50, carbs: 22, quantity: 100 },
                    { id: 'DF6', name: 'Peanut Butter', calories: 588, protein: 25, fat: 50, carbs: 20, quantity: 100 },
                    { id: 'DF7', name: 'Walnuts', calories: 654, protein: 15, fat: 65, carbs: 14, quantity: 100 },
                    { id: 'DF8', name: 'Chia Seeds', calories: 486, protein: 16, fat: 31, carbs: 42, quantity: 100 },
                    { id: 'DF9', name: 'Avocado', calories: 160, protein: 2, fat: 15, carbs: 9, quantity: 100 },
                    { id: 'DF10', name: 'Flax Seeds', calories: 534, protein: 18, fat: 42, carbs: 29, quantity: 100 },
                    { id: 'DF11', name: 'Coconut Oil', calories: 862, protein: 0, fat: 100, carbs: 0, quantity: 100 },
                    { id: 'DF12', name: 'Pumpkin Seeds', calories: 559, protein: 30, fat: 49, carbs: 10, quantity: 100 },
                    { id: 'DF13', name: 'Sesame Seeds', calories: 573, protein: 17, fat: 50, carbs: 23, quantity: 100 },
                    { id: 'DF14', name: 'Sunflower Seeds', calories: 584, protein: 20, fat: 51, carbs: 20, quantity: 100 },
                    { id: 'DF15', name: 'Hazelnuts', calories: 628, protein: 15, fat: 61, carbs: 17, quantity: 100 },
                    { id: 'DF16', name: 'Cashews', calories: 553, protein: 18, fat: 44, carbs: 30, quantity: 100 },
                    { id: 'DF17', name: 'Pecans', calories: 691, protein: 9, fat: 72, carbs: 14, quantity: 100 },
                    { id: 'DF18', name: 'Macadamia Nuts', calories: 718, protein: 8, fat: 76, carbs: 14, quantity: 100 },
                ],
            },
            {
                category: 'Vegetable',
                items: [
                    { id: 'DV1', name: 'Spinach', calories: 23, protein: 2.9, fat: 0.4, carbs: 3.6, quantity: 100 },
                    { id: 'DV2', name: 'Tomato', calories: 18, protein: 0.9, fat: 0.2, carbs: 3.9, quantity: 100 },
                    { id: 'DV3', name: 'Bell Pepper', calories: 31, protein: 1, fat: 0.3, carbs: 6, quantity: 100 },
                    { id: 'DV4', name: 'Cucumber', calories: 16, protein: 0.7, fat: 0.1, carbs: 3.6, quantity: 100 },
                    { id: 'DV5', name: 'Carrot', calories: 41, protein: 0.9, fat: 0.2, carbs: 10, quantity: 100 },
                    { id: 'DV6', name: 'Kale', calories: 35, protein: 2.9, fat: 0.6, carbs: 4.4, quantity: 100 },
                    { id: 'DV7', name: 'Zucchini', calories: 17, protein: 1.2, fat: 0.3, carbs: 3.1, quantity: 100 },
                    { id: 'DV8', name: 'Eggplant', calories: 25, protein: 1, fat: 0.2, carbs: 6, quantity: 100 },
                    { id: 'DV9', name: 'Cabbage', calories: 25, protein: 1.3, fat: 0.1, carbs: 6, quantity: 100 },
                    { id: 'DV10', name: 'Sweet Potato', calories: 86, protein: 1.6, fat: 0.1, carbs: 20, quantity: 100 },
                    { id: 'DV11', name: 'Radish', calories: 16, protein: 0.7, fat: 0.1, carbs: 3.4, quantity: 100 },
                    { id: 'DV12', name: 'Beets', calories: 43, protein: 1.6, fat: 0.2, carbs: 10, quantity: 100 },
                    { id: 'DV13', name: 'Lettuce', calories: 15, protein: 1.4, fat: 0.2, carbs: 2.9, quantity: 100 },
                    { id: 'DV14', name: 'Kale', calories: 49, protein: 4.3, fat: 0.9, carbs: 9, quantity: 100 },
                ],
            },
            {
                category: 'Fruit',
                items: [
                    { id: 'DF1', name: 'Banana', calories: 89, protein: 1.1, fat: 0.3, carbs: 23, quantity: 100 },
                    { id: 'DF2', name: 'Apple', calories: 52, protein: 0.3, fat: 0.2, carbs: 14, quantity: 100 },
                    { id: 'DF3', name: 'Blueberries', calories: 57, protein: 0.7, fat: 0.3, carbs: 14, quantity: 100 },
                    { id: 'DF4', name: 'Strawberries', calories: 32, protein: 0.7, fat: 0.3, carbs: 7.7, quantity: 100 },
                    { id: 'DF5', name: 'Mango', calories: 60, protein: 0.8, fat: 0.4, carbs: 15, quantity: 100 },
                    { id: 'DF6', name: 'Orange', calories: 47, protein: 0.9, fat: 0.1, carbs: 12, quantity: 100 },
                    { id: 'DF7', name: 'Kiwi', calories: 61, protein: 1.1, fat: 0.5, carbs: 15, quantity: 100 },
                    { id: 'DF8', name: 'Plum', calories: 46, protein: 0.7, fat: 0.3, carbs: 11, quantity: 100 },
                    { id: 'DF9', name: 'Papaya', calories: 43, protein: 0.5, fat: 0.3, carbs: 11, quantity: 100 },
                    { id: 'DF10', name: 'Watermelon', calories: 30, protein: 0.6, fat: 0.2, carbs: 8, quantity: 100 },
                    { id: 'DF11', name: 'Grapes', calories: 69, protein: 0.7, fat: 0.2, carbs: 18, quantity: 100 },
                    { id: 'DF12', name: 'Peach', calories: 39, protein: 0.9, fat: 0.3, carbs: 10, quantity: 100 },
                    { id: 'DF13', name: 'Pineapple', calories: 50, protein: 0.5, fat: 0.1, carbs: 13, quantity: 100 },
                ],
            },
        ],
    },
];
