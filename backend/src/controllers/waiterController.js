import asyncHandler from "express-async-handler";
import { getAllWaitersService, getWaiterByIdService, getWaiterByNameService, createWaiterService, updateWaiterService, deactivateWaiterService } from "../models/waiterModel.js";

//@desc Get all waiters paginated
//@route GET /api/waiters
//access Private
export const getAllWaiters = asyncHandler(async (req, res) => {

  const waiters = await getAllWaitersService()

  if(!waiters?.length) {
    return res.json({message: "No waiters found"})
  }

  res.json({data: waiters})
})

//@desc Get waiter by ID
//@route GET /api/waiters/:id
//access Private
export const getWaiterById = asyncHandler(async (req, res) => {
    const {id} = req.params

    if(!id) {
      return res.status(400).json({message: "Waiter ID is required"})
    }

    const waiter = await getWaiterByIdService(id)

    if(!waiter) {
      return res.status(404).json({message: "Waiter not found"})
    }

    res.json({data: waiter})
})

//@desc Create new waiter
//@route POST /api/waiters
//access Private
export const createWaiter = asyncHandler(async (req, res) => {
    const {fullname} = req.body

    if(!fullname) {
      return res.status(400).json({message: "Fullname is required"})
    }

    const formattedFullname = fullname.toLowerCase()

    const existingWaiter = await getWaiterByNameService(formattedFullname)
    
    if(existingWaiter) {
      return res.status(409).json({message: "Waiter name already exists"})
    }

    const newWaiter = await createWaiterService(formattedFullname)

    res.status(201).json({message: "New waiter created", data: newWaiter})
})

//@desc Update a waiter
//@route PATCH /api/waiters/:id
//access Private
export const updateWaiter = asyncHandler(async (req, res) => {
    const {id} = req.params
    const {fullname, active} = req.body

    if(!id) {
      return res.status(400).json({message: "Waiter ID is required"})
    }

    if(!fullname || typeof active !== "boolean") {
      return res.status(400).json({message: "All fields are required"})
    }

    const formattedFullname = fullname.toLowerCase()

    const existingWaiterName = await getWaiterByNameService(formattedFullname)

    if(existingWaiterName && existingWaiterName.id !== id) {
      return res.status(409).json({message: "Waiter name already exists"})
    }

    const existingWaiter = await getWaiterByIdService(id)

    if(!existingWaiter) {
      return res.status(404).json({message: "Waiter not found"})
    }

    const fieldsToUpdate = { formattedFullname, active }

    const updatedWaiter = await updateWaiterService(id, fieldsToUpdate)

    res.json({message: "Waiter updated", data: updatedWaiter})
})

//@desc Deactivate a waiter
//@route PATCH /api/waiters/deactivate/:id
//access Private
export const deactivateWaiter = asyncHandler(async (req, res) => {
    const {id} = req.params

    if(!id) {
      return res.status(400).json({message: "Waiter ID is required"})
    }

    const deactivateWaiter = await deactivateWaiterService(id)

    if(!deactivateWaiter) {
      return res.status(404).json({message: "Waiter not found"})
    }

    res.json({message: "Waiter deactivated successfully", data: deactivateWaiter})
})