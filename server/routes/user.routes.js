import { requireAuth } from '@clerk/express';
import express from 'express'
import { getFavourites, getUserBookings, updateFavourite } from '../controllers/user.controller.js';
const userRouter=express.Router();

userRouter.get('/bookings', requireAuth(), getUserBookings)
userRouter.get('/favourites', requireAuth(), getFavourites)
userRouter.post('/update-favourites', requireAuth(), updateFavourite)
export default userRouter;