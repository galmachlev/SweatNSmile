interface FoodItem {
    name: string;
    calories: number;
    protein: number;
    fat: number;
    carbs: number;
    quantity: number; // הכמות בגרמים
}

interface FoodCategory {
    category: string;
    items: FoodItem[];
}

export const foodData: FoodCategory[] = [
    {
        category: 'Proteins',
        items: [
            { name: 'Chicken Breast', calories: 165, protein: 31, fat: 3.6, carbs: 0, quantity: 100 },
            { name: 'Tofu', calories: 144, protein: 15, fat: 8, carbs: 2, quantity: 100 },
            { name: 'Lentils', calories: 116, protein: 9, fat: 0.4, carbs: 20, quantity: 100 },
            { name: 'Turkey Breast', calories: 135, protein: 30, fat: 1, carbs: 0, quantity: 100 },
            { name: 'Eggs', calories: 155, protein: 13, fat: 11, carbs: 1.1, quantity: 100 },
            { name: 'Salmon', calories: 206, protein: 22, fat: 13, carbs: 0, quantity: 100 },
            { name: 'Beef Steak', calories: 242, protein: 26, fat: 17, carbs: 0, quantity: 100 },
            { name: 'Pork Tenderloin', calories: 143, protein: 24, fat: 4, carbs: 0, quantity: 100 },
            { name: 'Greek Yogurt', calories: 100, protein: 10, fat: 0, carbs: 4, quantity: 100 },
            { name: 'Shrimp', calories: 85, protein: 20, fat: 0.5, carbs: 0, quantity: 100 },
            { name: 'Cottage Cheese', calories: 98, protein: 11, fat: 4, carbs: 3.4, quantity: 100 },
            { name: 'Chickpeas', calories: 164, protein: 9, fat: 2.6, carbs: 27, quantity: 100 },
            { name: 'Edamame', calories: 121, protein: 11, fat: 5, carbs: 9, quantity: 100 },
            { name: 'Venison', calories: 158, protein: 30, fat: 3.5, carbs: 0, quantity: 100 },
            { name: 'Bison', calories: 143, protein: 28, fat: 2.4, carbs: 0, quantity: 100 },
            { name: 'Duck Breast', calories: 337, protein: 25, fat: 28, carbs: 0, quantity: 100 },
            { name: 'Fish (Cod)', calories: 105, protein: 23, fat: 1, carbs: 0, quantity: 100 },
            { name: 'Whey Protein', calories: 120, protein: 24, fat: 1, carbs: 3, quantity: 100 },
            { name: 'Sardines', calories: 208, protein: 25, fat: 11, carbs: 0, quantity: 100 },
            { name: 'Crab', calories: 87, protein: 18, fat: 1, carbs: 0, quantity: 100 },
            { name: 'Lamb', calories: 294, protein: 25, fat: 21, carbs: 0, quantity: 100 },
            { name: 'Seitan', calories: 120, protein: 25, fat: 1, carbs: 3, quantity: 100 },
            { name: 'Quail', calories: 123, protein: 22, fat: 5, carbs: 0, quantity: 100 },
            { name: 'Clams', calories: 148, protein: 25, fat: 2, carbs: 5, quantity: 100 },
            { name: 'Octopus', calories: 164, protein: 28, fat: 4, carbs: 0, quantity: 100 },
            { name: 'Mussels', calories: 172, protein: 24, fat: 4, carbs: 7, quantity: 100 },
            { name: 'Prawns', calories: 70, protein: 14, fat: 1, carbs: 0, quantity: 100 },
            { name: 'Soya Chunks', calories: 333, protein: 52, fat: 0.6, carbs: 27, quantity: 100 },
            { name: 'Tempeh', calories: 195, protein: 20, fat: 11, carbs: 9, quantity: 100 },
            { name: 'Liver', calories: 175, protein: 26, fat: 6, carbs: 0, quantity: 100 },
            { name: 'Soy Milk', calories: 33, protein: 3, fat: 2, carbs: 1, quantity: 100 },
        ],
    },
    {
        category: 'Carbs',
        items: [
            { name: 'Brown Rice', calories: 111, protein: 2.6, fat: 0.9, carbs: 23, quantity: 100 },
            { name: 'Quinoa', calories: 120, protein: 4.1, fat: 1.9, carbs: 21, quantity: 100 },
            { name: 'Sweet Potato', calories: 86, protein: 1.6, fat: 0.1, carbs: 20, quantity: 100 },
            { name: 'Oats', calories: 68, protein: 2.5, fat: 1.4, carbs: 12, quantity: 100 },
            { name: 'Whole Wheat Bread', calories: 69, protein: 3.6, fat: 1.1, carbs: 12, quantity: 100 },
            { name: 'Pasta', calories: 131, protein: 5, fat: 1.1, carbs: 25, quantity: 100 },
            { name: 'Potato', calories: 77, protein: 2, fat: 0.1, carbs: 17, quantity: 100 },
            { name: 'Barley', calories: 123, protein: 3.5, fat: 0.4, carbs: 28, quantity: 100 },
            { name: 'Buckwheat', calories: 92, protein: 3.4, fat: 0.6, carbs: 19, quantity: 100 },
            { name: 'Rye Bread', calories: 83, protein: 3.4, fat: 1, carbs: 15, quantity: 100 },
            { name: 'Corn', calories: 96, protein: 3.4, fat: 1.5, carbs: 21, quantity: 100 },
            { name: 'Couscous', calories: 176, protein: 6, fat: 0.3, carbs: 36, quantity: 100 },
            { name: 'Millet', calories: 119, protein: 3.5, fat: 1.2, carbs: 23, quantity: 100 },
            { name: 'Chickpea Pasta', calories: 131, protein: 25, fat: 2, carbs: 22, quantity: 100 },
            { name: 'Rice Noodles', calories: 192, protein: 4.2, fat: 0.4, carbs: 43, quantity: 100 },
            { name: 'Bread (White)', calories: 75, protein: 2.4, fat: 0.9, carbs: 14, quantity: 100 },
            { name: 'Soba Noodles', calories: 113, protein: 4, fat: 0.5, carbs: 24, quantity: 100 },
            { name: 'Polenta', calories: 70, protein: 1.5, fat: 0.4, carbs: 15, quantity: 100 },
            { name: 'Tortilla', calories: 150, protein: 4, fat: 3, carbs: 25, quantity: 100 },
            { name: 'Farro', calories: 150, protein: 6, fat: 1, carbs: 32, quantity: 100 },
            { name: 'Teff', calories: 255, protein: 10, fat: 1.4, carbs: 50, quantity: 100 },
            { name: 'Freekeh', calories: 180, protein: 13, fat: 1, carbs: 35, quantity: 100 },
            { name: 'Yams', calories: 118, protein: 1.5, fat: 0.2, carbs: 27, quantity: 100 },
            { name: 'Sorghum', calories: 132, protein: 4.1, fat: 1.1, carbs: 28, quantity: 100 },
        ],
    },
    {
        category: 'Fruits',
        items: [
            { name: 'Banana', calories: 89, protein: 1.1, fat: 0.3, carbs: 23, quantity: 100 },
            { name: 'Apple', calories: 52, protein: 0.3, fat: 0.2, carbs: 14, quantity: 100 },
            { name: 'Orange', calories: 47, protein: 0.9, fat: 0.1, carbs: 12, quantity: 100 },
            { name: 'Grapes', calories: 69, protein: 0.7, fat: 0.2, carbs: 18, quantity: 100 },
            { name: 'Strawberry', calories: 32, protein: 0.7, fat: 0.3, carbs: 7.7, quantity: 100 },
            { name: 'Watermelon', calories: 30, protein: 0.6, fat: 0.2, carbs: 8, quantity: 100 },
            { name: 'Peach', calories: 39, protein: 0.9, fat: 0.3, carbs: 10, quantity: 100 },
            { name: 'Pineapple', calories: 50, protein: 0.5, fat: 0.1, carbs: 13, quantity: 100 },
            { name: 'Mango', calories: 60, protein: 0.8, fat: 0.4, carbs: 15, quantity: 100 },
            { name: 'Blueberry', calories: 57, protein: 0.7, fat: 0.3, carbs: 14, quantity: 100 },
            { name: 'Blackberry', calories: 43, protein: 1.4, fat: 0.5, carbs: 10, quantity: 100 },
            { name: 'Kiwi', calories: 61, protein: 1.1, fat: 0.5, carbs: 15, quantity: 100 },
            { name: 'Raspberry', calories: 52, protein: 1.2, fat: 0.7, carbs: 12, quantity: 100 },
            { name: 'Avocado', calories: 160, protein: 2, fat: 15, carbs: 9, quantity: 100 },
            { name: 'Coconut', calories: 354, protein: 3.3, fat: 33, carbs: 15, quantity: 100 },
            { name: 'Papaya', calories: 43, protein: 0.5, fat: 0.3, carbs: 11, quantity: 100 },
            { name: 'Pomegranate', calories: 83, protein: 1.7, fat: 1.2, carbs: 19, quantity: 100 },
            { name: 'Date', calories: 277, protein: 2, fat: 0.2, carbs: 75, quantity: 100 },
            { name: 'Lemon', calories: 29, protein: 1.1, fat: 0.3, carbs: 9, quantity: 100 },
            { name: 'Lime', calories: 30, protein: 0.99, fat: 0.2, carbs: 7, quantity: 100 },
            { name: 'Clementine', calories: 47, protein: 0.9, fat: 0.1, carbs: 12, quantity: 100 },
            { name: 'Passion Fruit', calories: 97, protein: 2.2, fat: 0.4, carbs: 25, quantity: 100 },
        ],
    },
    {
        category: 'Vegetables',
        items: [
            { name: 'Broccoli', calories: 55, protein: 3.7, fat: 0.6, carbs: 11, quantity: 100 },
            { name: 'Spinach', calories: 23, protein: 2.9, fat: 0.4, carbs: 4, quantity: 100 },
            { name: 'Carrot', calories: 41, protein: 0.9, fat: 0.2, carbs: 10, quantity: 100 },
            { name: 'Kale', calories: 49, protein: 4.3, fat: 0.9, carbs: 9, quantity: 100 },
            { name: 'Bell Pepper', calories: 31, protein: 1, fat: 0.3, carbs: 6, quantity: 100 },
            { name: 'Tomato', calories: 18, protein: 0.9, fat: 0.2, carbs: 4, quantity: 100 },
            { name: 'Cucumber', calories: 16, protein: 0.7, fat: 0.1, carbs: 4, quantity: 100 },
            { name: 'Zucchini', calories: 17, protein: 1.2, fat: 0.3, carbs: 3, quantity: 100 },
            { name: 'Cauliflower', calories: 25, protein: 1.9, fat: 0.3, carbs: 5, quantity: 100 },
            { name: 'Brussels Sprouts', calories: 43, protein: 3.4, fat: 0.3, carbs: 9, quantity: 100 },
            { name: 'Eggplant', calories: 25, protein: 1, fat: 0.2, carbs: 6, quantity: 100 },
            { name: 'Onion', calories: 40, protein: 1.1, fat: 0.1, carbs: 9, quantity: 100 },
            { name: 'Garlic', calories: 149, protein: 6.4, fat: 0.5, carbs: 33, quantity: 100 },
            { name: 'Sweet Corn', calories: 86, protein: 3.3, fat: 1.2, carbs: 19, quantity: 100 },
            { name: 'Potato', calories: 77, protein: 2, fat: 0.1, carbs: 17, quantity: 100 },
            { name: 'Pumpkin', calories: 26, protein: 1, fat: 0.1, carbs: 7, quantity: 100 },
            { name: 'Asparagus', calories: 20, protein: 2.2, fat: 0.2, carbs: 4, quantity: 100 },
            { name: 'Radish', calories: 16, protein: 0.7, fat: 0.1, carbs: 4, quantity: 100 },
            { name: 'Beetroot', calories: 43, protein: 1.6, fat: 0.2, carbs: 10, quantity: 100 },
            { name: 'Celery', calories: 14, protein: 0.7, fat: 0.2, carbs: 3, quantity: 100 },
            { name: 'Artichoke', calories: 47, protein: 3.5, fat: 0.2, carbs: 11, quantity: 100 },
        ],
    },
];
