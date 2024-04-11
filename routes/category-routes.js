import { Router } from "express";
import { addCategory, getAllCategories, getCategories, getCategoriesByProduct, updateCategory,  } from "../controller/category-controller.js";

const router = Router();


// Route to get categories with pagination and search
router.get('/', getCategories);

// getALl
router.get('/all', getAllCategories)

// Route to add a new category
router.post('/',addCategory );

// Route to update a category by ID
router.put('/:id', updateCategory );

// Route to get categories by product count
router.get('/product-count',getCategoriesByProduct );



export default router;