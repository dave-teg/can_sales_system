import asyncHandler from "express-async-handler";
import { getAllUsersService, updateUserService, getUserByFullnameService, deactivateUserService } from "../models/userModel.js";
import bcrypt from "bcrypt";

//@desc Get all users paginated
//@route GET /api/users
//access Private/Admin
export const getAllUsers = asyncHandler(async (req, res) => {

  const users = await getAllUsersService()

  if(!users?.length) {
    return res.json({message: "No users found"})
  }

  res.json({data: users})
})

//@desc Update a user
//@route PATCH /api/users/:id
//access Private/admin
export const updateUser = asyncHandler(async (req, res) => {
    const {fullname, role, password, active} = req.body;
    const {id} = req.params

    if(!id || !fullname || !role || typeof active !== 'boolean' ) {
      return res.status(400).json({message: "All fields are required"})
    }

    const formattedFullname = fullname.toLowerCase()

    //check if fullname already exists
      const existingFullname = await getUserByFullnameService(formattedFullname);
      if (existingFullname && existingFullname.id !== id) {
        return res.status(409).json({ message: "Full name already exists" });
      }

    let hashedPassword;

    if(password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }
    
    let fieldsToUpdate;

    fieldsToUpdate = password ? {formattedFullname, role, hashedPassword, active} : {formattedFullname, role, active}

    const updatedUser = await updateUserService(id, fieldsToUpdate)

    if(!updatedUser) {
      return res.status(404).json({message: "User not found"})
    }

    res.json({message: "Successfully updated user", data: updatedUser})
})

//@desc Update credentials
//@route PATCH /api/users/credentials/:id
//access Private
export const updateCredentials = asyncHandler(async (req, res) => {
    const id = req.user.id
    let {username, password} = req.body

    if(!username) {
      res.status(400).json({message: "Username is required"})
    }

    username = username.toLowerCase()
    // FOR LATER
})

//@desc Deactivate a user
//@route PATCH /api/users/deactivate/:id
//access Private/admin
export const deactivateUser = asyncHandler(async (req, res) => {
  const {id} = req.params;

  if (!id) return res.status(400).json({ message: "Id is required" });

  const deactivatedUser = await deactivateUserService(id)

  if(!deactivatedUser) {
    return res.status(404).json({message: "No user to deactivate"})
  }

  res.json({message: "User deactivated successfully", data: deactivatedUser})
})