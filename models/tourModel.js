import mongoose from 'mongoose';

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
    },
    duration: { type: Number, required: [true, 'A tour must have a duration'] },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a Group Size'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      trim: true,
    },
    ratingAverage: { type: Number, default: 4.5 },
    ratingQuantity: Number,
    price: { type: Number, required: [true, 'A tour must have a price'] },
    summary: { type: String, trim: true },
    description: {
      type: String,
      required: [true, 'A tour must have a description'],
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image'],
    },
    images: [String],
    startDates: [String],
  },
  {
    timestamps: true,
  },
);

const Tour = mongoose.model('Tour', tourSchema);

export default Tour;
