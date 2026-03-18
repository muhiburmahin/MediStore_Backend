import { categoryService } from "./category.service";
//create Cetagory
const createCategory = async (req, res) => {
    try {
        const { name, imageUrl } = req.body;
        if (!name) {
            return res.status(400).json({ success: false, message: "Name is required" });
        }
        const result = await categoryService.createCategory(name, imageUrl);
        res.status(201).json({
            success: true,
            message: "Category created successfully",
            data: result
        });
    }
    catch (err) {
        res.status(err.message === "Category already exists" ? 409 : 500).json({
            success: false,
            message: err.message || "Internal Server Error"
        });
    }
};
//get all Category
const getAllCategories = async (req, res) => {
    try {
        const result = await categoryService.getAllCategories();
        res.status(200).json({
            success: true,
            message: "Categories fetched successfully",
            data: result.categories,
            total: result.totalCount,
        });
    }
    catch (err) {
        res.status(400).json({
            success: false,
            message: "Failed to fetch categories",
            error: err.message
        });
    }
};
//Category delete by id
const deleteCategoryById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await categoryService.deleteCategoryById(id);
        res.status(200).json({
            success: true,
            message: "Category deleted successfully",
            data: result
        });
    }
    catch (err) {
        res.status(404).json({
            success: false,
            message: "Failed to delete category",
            error: err.message
        });
    }
};
export const categoryController = {
    createCategory,
    getAllCategories,
    deleteCategoryById
};
//# sourceMappingURL=category.controller.js.map