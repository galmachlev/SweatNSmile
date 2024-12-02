import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, Image, Modal, Button } from 'react-native';
import { Product } from '../../types/product'; // ייבוא טיפוס המוצר
import { Video } from 'expo-av'; // וידאו להצגת סרטונים
import { Ionicons } from '@expo/vector-icons'; // אייקונים, כולל אייקון עגלה

const StoreScreen = () => {
    const [products, setProducts] = useState<Product[]>([]); // רשימת המוצרים בחנות
    const [search, setSearch] = useState(''); // ערך החיפוש
    const [cart, setCart] = useState<Product[]>([]); // רשימת מוצרים בעגלה
    const [isCartOpen, setIsCartOpen] = useState(false); // האם העגלה פתוחה או סגורה
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null); // מוצר שנבחר לתצוגה
    const [quantity, setQuantity] = useState(1); // כמות פריטים שנבחרו
    const [isModalVisible, setIsModalVisible] = useState(false); // האם חלון המוצר פתוח

    // הבאת מוצרים ברגע שהרכיב נטען
    useEffect(() => {
        fetchProducts();
    }, []);

    // פונקציה להבאת מוצרים מהשרת
    const fetchProducts = async () => {
        try {
            const response = await fetch('https://database-s-smile.onrender.com/api/products'); // קריאה ל-API
            const data = await response.json(); // המרת התגובה למידע
            setProducts(data); // עדכון רשימת המוצרים
        } catch (error) {
            console.error("Failed to fetch products:", error); // טיפול בשגיאות
        }
    };

    // פונקציה להוספת מוצר לעגלה
    const handleAddToCart = (product: Product) => {
        const existingItem = cart.find(item => item._id === product._id); // בדיקה אם המוצר כבר בעגלה
        if (existingItem) {
            // אם המוצר כבר בעגלה, עדכון הכמות
            setCart(cart.map(item => item._id === product._id ? { ...item, quantity: item.quantity + quantity } : item));
        } else {
            // אם המוצר לא בעגלה, הוספה חדשה
            setCart([...cart, { ...product, quantity }]);
        }
        closeProductModal(); // סגירת חלון המוצר
    };

    // פתיחת חלון מוצר
    const openProductModal = (product: Product) => {
        setSelectedProduct(product); // הגדרת המוצר שנבחר
        setQuantity(1); // איפוס הכמות לכמות ברירת מחדל
        setIsModalVisible(true); // פתיחת החלון
    };

    // סגירת חלון מוצר
    const closeProductModal = () => {
        setSelectedProduct(null); // איפוס המוצר הנבחר
        setIsModalVisible(false); // סגירת החלון
    };

    // פתיחה/סגירה של העגלה
    const toggleCart = () => {
        setIsCartOpen(!isCartOpen); // הפיכת מצב העגלה
    };

    // הסרת מוצר מהעגלה
    const handleRemoveFromCart = (productId: string) => {
        setCart(cart.filter(item => item._id !== productId)); // סינון המוצר מהעגלה
    };

    // שינוי כמות פריט בעגלה
    const handleQuantityChange = (productId: string, change: number) => {
        setCart(cart.map(item => item._id === productId
            ? { ...item, quantity: Math.max(1, item.quantity + change) } // מניעת כמות נמוכה מ-1
            : item
        ));
    };

    return (
        <View style={styles.container}>
            {/* סרטון תדמית בראש המסך */}
            <View style={styles.hero}>
                <Video
                    source={require('../../Images/Video - Copy.mp4')} // מקור הסרטון
                    rate={1.0}
                    volume={1.0}
                    isMuted={false}
                    resizeMode="cover"
                    shouldPlay
                    isLooping
                    style={styles.video}
                    isMuted={true} // הסרטון מושתק כברירת מחדל
                />
            </View>

            {/* שורת חיפוש ואייקון עגלה */}
            <View style={styles.headerRow}>
                <TextInput
                    style={styles.searchBar}
                    placeholder="Search products" // טקסט placeholder
                    value={search}
                    onChangeText={setSearch} // עדכון ערך החיפוש
                />
                <TouchableOpacity onPress={toggleCart} style={styles.cartIconContainer}>
                    <Ionicons name="cart" size={40} color="#333" paddingRight={2} /> {/* אייקון העגלה */}
                    {cart.length > 0 && <View style={styles.cartBadge}><Text style={styles.cartBadgeText}>{cart.length}</Text></View>} {/* תווית כמות בעגלה */}
                </TouchableOpacity>
            </View>

            {/* רשימת המוצרים */}
            <FlatList
                data={products.filter(product => 
                    product.name.toLowerCase().includes(search.toLowerCase()) // סינון לפי חיפוש
                )}
                keyExtractor={(item) => item._id} // שימוש ב-ID ייחודי כמפתח
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => openProductModal(item)} style={styles.productContainer}>
                        <View style={styles.productCard}>
                            <Image source={{ uri: item.imageURL }} style={styles.productImage} /> {/* תמונה של המוצר */}
                            <Text style={styles.productName}>{item.name}</Text> {/* שם המוצר */}
                            <Text>${item.price}</Text> {/* מחיר המוצר */}
                        </View>
                    </TouchableOpacity>
                )}
                numColumns={2} // תצוגה של שני עמודות
            />

            {/* עגלה */}
            {isCartOpen && (
                <View style={styles.cartOverlay}>
                    <Text style={styles.cartTitle}>Cart</Text>

                    {/* רשימת פריטים בעגלה */}
                    <FlatList
                        data={cart}
                        keyExtractor={(item) => item._id}
                        renderItem={({ item }) => (
                            <View style={styles.cartItemContainer}>
                                <Image source={{ uri: item.imageURL }} style={styles.cartItemImage} /> {/* תמונה של פריט בעגלה */}
                                <View style={styles.cartItemDetails}>
                                    <Text style={styles.cartItemName}>{item.name}</Text> {/* שם הפריט */}
                                    <Text style={styles.cartItemPrice}>${(item.price * item.quantity).toFixed(2)}</Text> {/* מחיר כולל לכמות */}
                                </View>
                                <View style={styles.cartItemControls}>
                                    {/* כפתורים לשינוי כמות והסרה */}
                                    <TouchableOpacity style={styles.quantityButton} onPress={() => handleQuantityChange(item._id, -1)}>
                                        <Text style={styles.quantityButtonText}>-</Text>
                                    </TouchableOpacity>
                                    <Text style={styles.quantityText}>{item.quantity}</Text>
                                    <TouchableOpacity style={styles.quantityButton} onPress={() => handleQuantityChange(item._id, 1)}>
                                        <Text style={styles.quantityButtonText}>+</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => handleRemoveFromCart(item._id)} style={styles.removeButton}>
                                        <Text style={styles.removeButtonText}>Remove</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )}
                    />

                    {/* סיכום כולל */}
                    <Text style={styles.cartTotal}>
                        Total: ${cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}
                    </Text>

                    {/* כפתור לסגירת העגלה */}
                    <TouchableOpacity onPress={toggleCart} style={styles.closeCartButton}>
                        <Text style={styles.closeCartButtonText}>Close Cart</Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* חלון מוצר */}
            <Modal
                visible={isModalVisible}
                transparent={true}
                animationType="slide"
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        {selectedProduct && (
                            <>
                                <Image source={{ uri: selectedProduct.imageURL }} style={styles.modalImage} /> {/* תמונה של המוצר */}
                                <Text style={styles.modalTitle}>{selectedProduct.name}</Text> {/* שם המוצר */}
                                <Text style={styles.modalDescription}>{selectedProduct.description}</Text> {/* תיאור המוצר */}
                                <Text style={styles.modalPrice}>${selectedProduct.price}</Text> {/* מחיר המוצר */}

                                {/* שליטה על כמות */}
                                <View style={styles.quantityContainer}>
                                    <Button title="-" onPress={() => setQuantity(Math.max(1, quantity - 1))} />
                                    <Text style={styles.quantityText}>{quantity}</Text>
                                    <Button title="+" onPress={() => setQuantity(quantity + 1)} />
                                </View>

                                {/* כפתור להוספה לעגלה */}
                                <TouchableOpacity 
                                    onPress={() => handleAddToCart(selectedProduct)} 
                                    style={styles.addToCartButton}
                                >
                                    <Text style={styles.addToCartButtonText}>Add {quantity} to Cart</Text>
                                </TouchableOpacity>

                                {/* כפתור לסגירת החלון */}
                                <TouchableOpacity onPress={closeProductModal} style={styles.closeModalButton}>
                                    <Text style={styles.closeModalButtonText}>Close</Text>
                                </TouchableOpacity>
                            </>
                        )}
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        padding: 16, 
        backgroundColor: '#f5f5f5' 
    },
    hero: { 
        width: '100%', 
        height: 200, 
        marginBottom: 16 
    },
    video: { 
        width: '100%', 
        height: '100%', 
        opacity: 0.8 
    },
    headerRow: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        marginBottom: 16 
    },
    searchBar: { 
        flex: 1, 
        height: 40, 
        borderColor: '#ddd', 
        borderWidth: 1, 
        borderRadius: 8, 
        paddingHorizontal: 8 
    },
    cartIconContainer: { 
        marginLeft: 16, 
        position: 'relative' 
    },
    cartBadge: { 
        position: 'absolute', 
        top: -5, 
        right: -10, 
        backgroundColor: 'red', 
        borderRadius: 10, 
        padding: 2, 
        minWidth: 18, 
        alignItems: 'center' 
    },
    cartBadgeText: { 
        color: '#fff', 
        fontSize: 12, 
        fontWeight: 'bold' 
    },
    productContainer: { 
        flex: 1, 
        padding: 8 
    },
    productCard: { 
        flex: 1, 
        backgroundColor: '#fff', 
        padding: 16, 
        borderRadius: 8, 
        alignItems: 'center', 
        marginBottom: 12, 
        shadowColor: "#000", 
        shadowOpacity: 0.1, 
        shadowOffset: { width: 0, height: 2 }, 
        shadowRadius: 4 
    },
    productName: { 
        fontWeight: 'bold', 
        fontSize: 16, 
        textAlign: 'center' 
    },
    productImage: { 
        width: '100%', 
        height: 150, 
        borderRadius: 8, 
        marginBottom: 8 
    },
    cartOverlay: { 
        position: 'absolute', 
        top: 0, 
        bottom: 0, 
        left: 0, 
        right: 0, 
        backgroundColor: 'rgba(0, 0, 0, 0.7)', 
        padding: 16, 
        justifyContent: 'flex-start',  
    },
    cartTitle: { 
        fontSize: 24, 
        color: '#fff', 
        fontWeight: 'bold', 
        marginBottom: 20,
        alignSelf: 'center'
    },

    // Cart Item Container
    cartItemContainer: { 
        flexDirection: 'row', 
        alignItems: 'center',  
        backgroundColor: '#ffffff', 
        borderRadius: 8, 
        padding: 12,
        marginBottom: 10, 
        width: '100%', 
        shadowColor: "#000", 
        shadowOpacity: 0.1, 
        shadowOffset: { width: 0, height: 2 }, 
        shadowRadius: 4 
    },
    cartItemImage: { 
        width: 50,                 
        height: 50, 
        borderRadius: 5, 
        marginRight: 12 
    },
    cartItemDetails: { 
        flex: 1,                      
        flexDirection: 'column', 
        justifyContent: 'center'
    },
    cartItemName: { 
        fontSize: 16, 
        fontWeight: 'bold', 
        color: '#333', 
        marginBottom: 4 
    },
    cartItemPrice: { 
        fontSize: 14, 
        color: '#4CAF50'
    },

    // Quantity Controls
    cartItemControls: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'center'
    },
    quantityButton: { 
        width: 30, 
        height: 30, 
        backgroundColor: '#ddd', 
        alignItems: 'center', 
        justifyContent: 'center', 
        borderRadius: 5,
        marginHorizontal: 5
    },
    quantityButtonText: { 
        fontSize: 16, 
        fontWeight: 'bold', 
        color: '#333'
    },
    quantityText: { 
        fontSize: 16, 
        fontWeight: 'bold', 
        textAlign: 'center'
    },

    // Cart Total and Close Button
    cartFooter: {
        marginTop: 20,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
    cartTotal: { 
        fontSize: 18, 
        fontWeight: 'bold', 
        color: '#FFF', 
        marginBottom: 15, 
        textAlign: 'center',
    },
    closeCartButton: { 
        paddingVertical: 12, 
        paddingHorizontal: 24,
        backgroundColor: '#f44336', 
        borderRadius: 8, 
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        width: '70%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        marginBottom: 30
    },
    closeCartButtonText: { 
        color: '#fff', 
        fontSize: 16, 
        fontWeight: 'bold',
    },
    modalContainer: { 
        flex: 1, 
        backgroundColor: 'rgba(0, 0, 0, 0.5)', 
        justifyContent: 'center', 
        alignItems: 'center' 
    },
    modalContent: { 
        width: '80%', 
        backgroundColor: '#fff', 
        padding: 20, 
        borderRadius: 10, 
        alignItems: 'center' 
    },
    modalImage: { 
        width: '100%', 
        height: 200, 
        borderRadius: 10, 
        marginBottom: 15 
    },
    modalTitle: { 
        fontSize: 20, 
        fontWeight: 'bold', 
        marginBottom: 10 
    },
    modalDescription: { 
        fontSize: 16, 
        textAlign: 'center', 
        marginBottom: 10 
    },
    modalPrice: { 
        fontSize: 18, 
        color: '#4CAF50', 
        marginBottom: 20 
    },
    quantityContainer: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        marginBottom: 15 
    },
    addToCartButton: { 
        padding: 10, 
        backgroundColor: '#4CAF50', 
        borderRadius: 8, 
        alignItems: 'center', 
        marginTop: 10 
    },
    addToCartButtonText: { 
        color: '#fff' 
    },
    closeModalButton: { 
        marginTop: 15 
    },
    closeModalButtonText: { 
        color: '#f44336' 
    }
});



export default StoreScreen;
