import express from 'express';
import userController from '../controllers/userController.js';
import authController from '../controllers/authController.js';

///////////////////////////////////////////////
// API ROUTES

const userRouter = express.Router();

// userRouter.param('id', )

userRouter.post('/signup', authController.signup);

userRouter
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);
userRouter
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

export default userRouter;
