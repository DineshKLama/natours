import { Schema, model } from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';

const userSchema = Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name!'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    trim: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  photo: String,
  password: {
    type: String,
    trim: true,
    required: [true, 'Please provide a password'],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please provide a confirm password'],
    validate: {
      validator: function (value) {
        return value === this.password;
      },
      message: 'Password are not the same',
    },
  },
  passwordChangedAt: Date,
});

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;

  const salt = await bcrypt.genSalt(12);

  this.password = await bcrypt.hash(this.password, salt);
  this.passwordConfirm = undefined;
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword,
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    // Convert Date object to seconds (base 10)
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10,
    );

    console.log(changedTimestamp, JWTTimestamp);
  }

  // False means NOT changed after the token was issued
  return false;
};

const User = model('User', userSchema);

export default User;
