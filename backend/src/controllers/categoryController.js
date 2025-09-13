import asyncHandler from "express-async-handler";
import {
  getCategoriesService,
  createCategoryService,
  updateCategoryService,
  getCategoryByCategoryNameService,
} from "../models/categoryModel.js";

//@desc Get all categories paginated
//@route GET /api/categories
//access Private
export const getAllCategories = asyncHandler(async (req, res) => {
  const categories = await getCategoriesService();

  if (!categories.length) {
    return res.json({ message: "No categories found" });
  }

  res.json({ data: categories });
});

//@desc Create a category
//@route POST /api/categories
//access Private
export const createCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ message: "Name is required" });
  }

  const formattedName = name.toLowerCase();

  const existingCategoryName = await getCategoryByCategoryNameService(
    formattedName
  );
  if (existingCategoryName) {
    return res.status(409).json({ message: "Category name already exists" });
  }

  const newCategory = await createCategoryService(formattedName);

  res
    .status(201)
    .json({ message: "New category created successfully", data: newCategory });
});

//@desc Update a category
//@route PATCH /categories/:id
//access Private
export const updateCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, active } = req.body;

  if (!name || typeof active !== "boolean") {
    return res.status(400).json({ message: "All fields are required" });
  }

  const formattedName = name.toLowerCase();

  const existingCategoryName = await getCategoryByCategoryNameService(
    formattedName
  );
  if (existingCategoryName && existingCategoryName.id !== id) {
    return res.status(409).json({ message: "Category name already exists" });
  }

  const fieldsToUpdate = { formattedName, active };

  const updatedCategory = await updateCategoryService(id, fieldsToUpdate);

  if (!updatedCategory) {
    return res.status(404).json({ message: "Category not found" });
  }

  res.json({ message: "Successfully updated category", data: updatedCategory });
});

//@desc Deactivate a category
//@route PATCH /api/categories/deactivate/:id
//access Private
export const deactivateCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) return res.status(400).json({ message: "Id is required" });

  const fieldsToUpdate = { active: false };

  const deactivatedCategory = await updateCategoryService(id, fieldsToUpdate);

  if (!deactivatedCategory) {
    return res.status(404).json({ message: "Category not found" });
  }

  res.json({ message: "Category deactivated successfully", data: deactivatedCategory });
});
