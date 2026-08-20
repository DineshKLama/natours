import User from '../models/userModel.js';
import { catchAsync } from '../utils/catchAsync.js';
////////////////////////////////////////////////////
// USER ROUTE HANDLERS

const getAllUsers = catchAsync(async (req, res) => {
  const users = await User.find({});

  res.status(200).json({ status: 'success', data: { users } });
});

const getUser = (req, res) => {
  res
    .status(500)
    .json({ status: 'error', message: 'This route is not defined!' });
};

const createUser = (req, res) => {
  res
    .status(500)
    .json({ status: 'error', message: 'This route is not defined!' });
};

const updateUser = (req, res) => {
  res
    .status(500)
    .json({ status: 'error', message: 'This route is not defined!' });
};

const deleteUser = (req, res) => {
  res
    .status(500)
    .json({ status: 'error', message: 'This route is not defined!' });
};

export default { getAllUsers, getUser, createUser, updateUser, deleteUser };
