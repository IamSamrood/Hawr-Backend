import { Router } from "express";
import { addProduct, deleteProduct, getProductById, getProducts, getUniqueProductSizes, updateProduct } from "../controller/product-controller.js";

const router = Router();

router.post('/', addProduct);

router.put('/', updateProduct);

router.delete('/:productId', deleteProduct);

router.get('/get-products', getProducts);

// Route to get unique product sizes
router.get('/unique-sizes', getUniqueProductSizes);

// Route to get a product by ID
router.get('/:productId', getProductById);








export default router;
