import { Router } from "express";
import { addProduct, getProductById, getProducts, getUniqueProductSizes } from "../controller/product-controller.js";



const router = Router();

// Route to add a new product
router.post('/', addProduct);

router.post('/get-products', getProducts);

// Route to get unique product sizes
router.get('/unique-sizes', getUniqueProductSizes);

// Route to get a product by ID
router.get('/:productId', getProductById);






export default router;
