import { Router } from "express";
import { addProduct, getProductById, getProducts, getUniqueProductSizes, updateProduct } from "../controller/product-controller.js";



const router = Router();

// Route to add a new product
router.post('/', addProduct);

router.put('/', updateProduct);

router.post('/get-products', getProducts);

// Route to get unique product sizes
router.get('/unique-sizes', getUniqueProductSizes);

// Route to get a product by ID
router.get('/:productId', getProductById);








export default router;
