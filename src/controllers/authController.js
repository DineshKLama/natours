import User from '../models/userModel.js';
import { catchAsync } from '../utils/catchAsync.js';

const signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      user: newUser,
    },
  });
});

export default { signup };
