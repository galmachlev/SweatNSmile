/*
 * המסך השני שמוצג לאחר לחיצה על ארוחה כלשהי בדף המתכונים
 * רכיב זה מציג מסך עם רשימת מתכונים בקטגוריה הנבחרת.
 * המתכונים מוצגים כ-FlatList הכוללת שם ותמונה של כל מתכון.
 * כאשר המשתמש לוחץ על מתכון, הרכיב פותח מודל המציג מתכון מפורט (RecipeDetailsScreen)
 * עם פרטי המתכון שנבחר כפרמטר.
*/

import React, { useState } from 'react';
import { StyleSheet, View, Text, FlatList, Image, TouchableOpacity, Modal, Pressable } from 'react-native';

// הגדרת טיפוסי קטגוריות המתכונים
type RecipeCategory = 'Breakfast' | 'Lunch' | 'Dinner' | 'Snacks';

// רשימת המתכונים המאורגנת לפי קטגוריות
const recipes: { [key in RecipeCategory]: { id: string; title: string; image: any; details: string }[] } = {
    
    // כל מתכון מכיל את הפרטים הבאים: מזהה, שם, תמונה והוראות הכנה
    Breakfast: [
        { 
            id: '1', 
            title: 'Pancakes', 
            image: require('../../../Images/pancakes.jpg'), 
            details: '1 cup flour, 1 tbsp sugar, 1 tsp baking powder, 1/2 tsp salt, 1 cup milk, 1 egg, 2 tbsp melted butter. Instructions: Mix dry ingredients, then add wet ingredients. Cook on a hot, greased pan until bubbles form; flip and cook until golden.'
        },
        { 
            id: '2', 
            title: 'Omelette', 
            image: require('../../../Images/omelette.jpg'), 
            details: '2 eggs, 2 tbsp milk, salt and pepper to taste, 1/4 cup shredded cheese, 1/4 cup chopped veggies. Instructions: Beat eggs with milk, season with salt and pepper. Cook in a pan, add cheese and veggies, fold and cook until set.'
        },
        { 
            id: '3', 
            title: 'Smoothie Bowl', 
            image: require('../../../Images/smoothie-bowl.jpg'), 
            details: '1 banana, 1/2 cup mixed berries, 1/2 cup yogurt. Instructions: Blend banana, berries, and yogurt until smooth. Pour into a bowl and top with granola and fresh fruits.'
        },
        { 
            id: '4', 
            title: 'Avocado Toast', 
            image: require('../../../Images/avocado-toast.jpg'), 
            details: '1 ripe avocado, 2 slices of bread, salt, pepper, lemon juice. Instructions: Toast the bread, mash the avocado with salt, pepper, and lemon juice. Spread on toast.'
        },
        { 
            id: '5', 
            title: 'Chia Pudding', 
            image: require('../../../Images/chia-pudding.jpg'), 
            details: '1/4 cup chia seeds, 1 cup milk, 1 tbsp honey (optional). Instructions: Mix chia seeds with milk and honey. Refrigerate overnight. Top with fruits before serving.'
        },
        { 
            id: '6', 
            title: 'Granola', 
            image: require('../../../Images/granola.jpg'), 
            details: '2 cups oats, 1/2 cup honey, 1/4 cup melted coconut oil, 1/2 cup nuts, 1/2 cup dried fruit. Instructions: Mix all ingredients, spread on a baking sheet, bake at 350°F (175°C) for 20-25 minutes, stirring halfway through.'
        },
    ],
    Lunch: [
        { 
            id: '1', 
            title: 'Chicken Salad', 
            image: require('../../../Images/chicken-salad.jpg'), 
            details: '2 cups cooked chicken, 1/2 cup mayo, 1/4 cup chopped celery, 1/4 cup chopped onion, salt and pepper to taste. Instructions: Mix all ingredients in a bowl. Chill before serving.'
        },
        { 
            id: '2', 
            title: 'Quinoa Bowl', 
            image: require('../../../Images/quinoa-salad.jpg'), 
            details: '1 cup cooked quinoa, 1 cup chopped veggies (bell peppers, cucumbers), 1/4 cup feta cheese, 2 tbsp olive oil, 1 tbsp lemon juice. Instructions: Combine all ingredients in a bowl. Toss with olive oil and lemon juice.'
        },
        { 
            id: '3', 
            title: 'Veggie Wrap', 
            image: require('../../../Images/veggie-wrap.jpg'), 
            details: '1 large tortilla, 1/2 cup hummus, 1 cup mixed veggies (lettuce, bell peppers, carrots), 1/4 cup shredded cheese. Instructions: Spread hummus on the tortilla, layer veggies and cheese, then roll up tightly.'
        },
        { 
            id: '4', 
            title: 'Lentil Soup', 
            image: require('../../../Images/lentil-soup.jpg'), 
            details: '1 cup lentils, 1 onion, 2 carrots, 2 celery stalks, 4 cups vegetable broth, 1 tsp cumin. Instructions: Sauté onions, carrots, and celery. Add lentils, broth, and cumin. Simmer for 30 minutes.'
        },
        { 
            id: '5', 
            title: 'Grilled Chicken', 
            image: require('../../../Images/grilled-chicken.jpg'), 
            details: '2 chicken breasts, 2 tbsp olive oil, 1 tsp garlic powder, 1 tsp paprika, salt and pepper to taste. Instructions: Rub chicken with olive oil and spices. Grill over medium heat for 6-8 minutes per side.'
        },
        { 
            id: '6', 
            title: 'Couscous Salad', 
            image: require('../../../Images/couscous-salad.jpg'), 
            details: '1 cup couscous, 1/2 cup cherry tomatoes, 1/4 cup chopped cucumber, 1/4 cup olives, 2 tbsp olive oil, 1 tbsp lemon juice. Instructions: Cook couscous according to package. Mix with veggies, olives, olive oil, and lemon juice.'
        },
    ],
    Dinner: [
        { 
            id: '1', 
            title: 'Spaghetti', 
            image: require('../../../Images/spaghetti.jpg'), 
            details: '200g spaghetti, 1 jar marinara sauce, 1/4 cup grated Parmesan cheese. Instructions: Cook spaghetti according to package. Heat marinara sauce. Toss spaghetti with sauce and cheese.'
        },
        { 
            id: '2', 
            title: 'Stir-Fry', 
            image: require('../../../Images/stir-fry.jpg'), 
            details: '2 cups mixed vegetables (broccoli, bell peppers), 1 cup cooked chicken, 2 tbsp soy sauce, 1 tbsp sesame oil. Instructions: Stir-fry vegetables in sesame oil, add chicken and soy sauce. Cook until veggies are tender.'
        },
        { 
            id: '3', 
            title: 'Stuffed Peppers', 
            image: require('../../../Images/stuffed-peppers.jpg'), 
            details: '4 bell peppers, 1 cup cooked rice, 1/2 cup ground beef, 1/2 cup tomato sauce, 1/4 cup cheese. Instructions: Mix rice, beef, and sauce. Stuff peppers and top with cheese. Bake at 375°F (190°C) for 30 minutes.'
        },
        { 
            id: '4', 
            title: 'Baked Salmon', 
            image: require('../../../Images/baked-salmon.jpg'), 
            details: '2 salmon fillets, 1 tbsp olive oil, 1 lemon, salt and pepper. Instructions: Brush fillets with olive oil, season, and place lemon slices on top. Bake at 400°F (200°C) for 15-20 minutes.'
        },
        { 
            id: '5', 
            title: 'Vegetable Curry', 
            image: require('../../../Images/vegetable-curry.jpg'), 
            details: '2 cups mixed vegetables, 1 can coconut milk, 2 tbsp curry powder. Instructions: Sauté vegetables, add curry powder and coconut milk. Simmer for 20 minutes.'
        },
        { 
            id: '6', 
            title: 'Chicken Tacos', 
            image: require('../../../Images/chicken-tacos.jpg'), 
            details: '1 cup cooked chicken, 4 taco shells, 1/2 cup shredded lettuce, 1/4 cup diced tomatoes, 1/4 cup shredded cheese. Instructions: Fill taco shells with chicken, lettuce, tomatoes, and cheese.'
        },
    ],
    Snacks: [
        { 
            id: '1', 
            title: 'Fruit Salad', 
            image: require('../../../Images/fruit-salad.jpg'), 
            details: '1 cup mixed fruits (apple, berries, banana). Instructions: Chop fruits and mix in a bowl.'
        },
        { 
            id: '2', 
            title: 'Hummus and Veggies', 
            image: require('../../../Images/hummus-veggies.jpg'), 
            details: '1 cup hummus, 1 cup mixed veggies (carrots, cucumbers). Instructions: Serve hummus with sliced veggies for dipping.'
        },
        { 
            id: '3', 
            title: 'Energy Balls', 
            image: require('../../../Images/energy-balls.jpg'), 
            details: '1 cup oats, 1/2 cup peanut butter, 1/4 cup honey, 1/4 cup chocolate chips. Instructions: Mix all ingredients, form into balls, and refrigerate.'
        },
        { 
            id: '4', 
            title: 'Greek Yogurt', 
            image: require('../../../Images/greek-yogurt.jpg'), 
            details: '1 cup Greek yogurt, 1 tbsp honey, 1/4 cup granola. Instructions: Top yogurt with honey and granola.'
        },
        { 
            id: '5', 
            title: 'Apple Slices with Peanut Butter', 
            image: require('../../../Images/apple-peanut-butter.jpg'), 
            details: '1 apple, 2 tbsp peanut butter. Instructions: Slice apple and spread with peanut butter.'
        },
        { 
            id: '6', 
            title: 'Nut Mix', 
            image: require('../../../Images/nut-mix.jpg'), 
            details: '1 cup mixed nuts (almonds, walnuts, cashews). Instructions: Combine nuts in a bowl.'
        },
    ],
};

// לאחר לחיצה על ארוחה כלשהי - תוצג רשימה מתכונים שכל אחד מהם מורכב מתמונה קטנה, שם המתכון וכפתור להצגת הפרטים המלאים
const RecipeItem = ({ title, image, onPress }: { title: string; image: any; onPress: () => void }) => (
    <View style={styles.recipeItem}>
        <Image source={image} style={styles.recipeImage} />
        <Text style={styles.recipeTitle}>{title}</Text>
        <TouchableOpacity onPress={onPress} style={styles.detailsButton}>{/* RecipeDetailsכפתור להצגת הפרטים המלאים שיפעיל את רכיב ה */}
            <Text style={styles.detailsButtonText}>Details</Text>
        </TouchableOpacity>
    </View>
);

// הצגת תוכן פרטי המתכון - חלוקת התצוגה ל-2 קבוצות: מרכיבים והוראות ההכנה
const RecipeDetails = ({ details }: { details: string }) => {
    const [ingredients, instructions] = details.split('Instructions:');
    return (
        <View>
            <Text style={styles.modalTitle}>Ingredients</Text>
            <Text style={styles.modalText}>{ingredients.trim()}</Text>

            <Text style={styles.modalTitle}>Instructions</Text>
            <Text style={styles.modalText}>{instructions.trim()}</Text>
        </View>
    );
};

// מסך קטגוריית המתכונים הראשי
const RecipeCategoryScreen: React.FC<{ route: any }> = ({ route }) => {
    const [selectedRecipe, setSelectedRecipe] = useState<string | null>(null); // מצב המתכון הנוכחי - בהתחלה כלום ואז בהתאם לבחירת המשתמש
    // פונקציה להגדרת המתכון הנבחר להצגה במודל
    const handleRecipePress = (details: string) => {
        setSelectedRecipe(details);
    };
    
    const { category } = route.params; // קבלת הקטגוריה מהפרמטרים שהועברו מהמסך הקודם בעת הניווט
    const data = recipes[category as RecipeCategory] || [];  // שליפת והצגת המתכונים לפי קטגוריה נבחרת
    

    return (
        <View style={styles.container}>

            {/* כותרת המסך שמציגה את שם הקטגוריה של המתכונים שנבחרה */}
            <Text style={styles.header}>{category}</Text>
            
            {/* רכיב FlatList להצגת רשימת המתכונים לפי הקטגוריה שנבחרה */}
            <FlatList
                data={data} // הנתונים של המתכונים בקטגוריה הנבחרת
                renderItem={({ item }) => ( // פונקציה לרינדור כל פריט ברשימה
                    <RecipeItem
                        title={item.title} // כותרת המתכון
                        image={item.image} // תמונת המתכון
                        onPress={() => handleRecipePress(item.details)} // פעולה לבחירת המתכון בלחיצה על הפריט
                    />
                )}
                keyExtractor={item => item.id}  // מזהה ייחודי עבור כל פריט כדי לשפר ביצועים
            />
            {/* מודל להצגת פרטי המתכון שנבחר */}
            <Modal
                visible={!!selectedRecipe} // יחזיר אמת אם יש מתכון שנבחר ושקר אם לא
                transparent={true}
                animationType="fade" 
                onRequestClose={() => setSelectedRecipe(null)} 
            >
                <View style={styles.modalBackground}>
                    <View style={styles.modalContent}>
                        {/* מציג את רכיב פרטי המתכון אם יש מתכון שנבחר */}
                        {selectedRecipe && <RecipeDetails details={selectedRecipe} />}
                        
                        {/* כפתור סגירה של המודל */}
                        <Pressable onPress={() => setSelectedRecipe(null)} style={styles.closeButton}>
                            <Text style={styles.closeButtonText}>Close</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

// סטיילים
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9f9f9',
        padding: 20,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
    },
    recipeItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    recipeImage: {
        width: 80,
        height: 80,
        borderRadius: 10,
        marginRight: 10,
    },
    recipeTitle: {
        fontSize: 18,
        color: '#333',
        flex: 1,
    },
    detailsButton: {
        backgroundColor: '#3E6613',
        borderRadius: 5,
        padding: 10,
    },
    detailsButtonText: {
        color: 'white',
        fontSize: 14,
    },
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        width: '80%',
        maxWidth: 400,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#3E6613',
        marginBottom: 8,
        marginTop: 16,
    },
    modalText: {
        fontSize: 16,
        color: '#333',
        lineHeight: 24,
        textAlign: 'left',
    },
    closeButton: {
        marginTop: 50,
        alignItems: 'center',
    },
    closeButtonText: {
        color: '#3E6613',
        fontSize: 16,
    },
});

export default RecipeCategoryScreen;
