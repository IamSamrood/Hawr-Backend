import mongoose from "mongoose";
import Cart from "../models/cart.js";


export const addToCart = async (req, res) => {
    try {
        const { productId, quantity, size, price, actualPrice } = req.body;
        const { id } = req.user;

       

        let cart = await Cart.findOne({ userId: id });

        if (!cart) {
            cart = new Cart({ userId: id, items: [{ productId, quantity, size, price, actualPrice }] });
        } else {

            const itemIndex = cart.items.findIndex(item => item.productId.equals(new mongoose.Types.ObjectId(productId)) && item.size === size);

            if (itemIndex !== -1) {
                // If the quantity is negative, decrease the item quantity
                if (quantity < 0) {
                    cart.items[itemIndex].quantity += quantity;
                    // If the quantity becomes 0 or negative, remove the item from the cart
                    if (cart.items[itemIndex].quantity <= 0) {
                        cart.items.splice(itemIndex, 1);
                    }
                } else if (quantity == 0) {
                    cart.items.splice(itemIndex, 1);
                } else {
                    cart.items[itemIndex].quantity += quantity;
                }
            } else {
                cart.items.push({ productId, quantity, size, price, actualPrice });
            }
        }

        await cart.save();

        res.status(200).json({ message: 'Item added to cart successfully', cart });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

export const getCartByUser = async (req, res) => {
    try {
        
        const { id } = req.user;

        const cart = await Cart.findOne({ userId:id }).populate('items.productId');

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        res.status(200).json({ cart });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
}

