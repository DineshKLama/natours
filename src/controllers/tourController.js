import Tour from '../models/tourModel.js';
import { APIFeatures } from '../utils/apiFeatures.js';

const aliasTopTours = (req, res, next) => {
  console.log(req.query);

  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';

  next();
};

/**
 * @desc    Get all tours
 * @route   GET /api/v1/tours
 * @access  Public
 */
const getAllTours = async (req, res) => {
  try {
    // ------------------------------------------------------------------
    // EXECUTE QUERY
    // ------------------------------------------------------------------
    const features = new APIFeatures(Tour, req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const tours = await features.query;
    //query.sort().select().skip().limit().find()

    // SEND RESPONSE
    res.status(200).json({
      status: 'success',
      requestTime: req.requestTime,
      results: tours.length,
      data: {
        tours,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message,
    });
  }
};

/**
 * @desc    Get single tour by ID
 * @route   GET /api/v1/tours/:id
 * @access  Public
 */
const getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);

    // If ID is a valid ObjectId format but does not match any document
    if (!tour) {
      return res.status(404).json({
        status: 'fail',
        message: 'No tour found with that ID',
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

/**
 * @desc    Create a new tour
 * @route   POST /api/v1/tours
 * @access  Private/Admin
 */
const createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

/**
 * @desc    Update a tour by ID
 * @route   PATCH /api/v1/tours/:id
 * @access  Private/Admin
 */
const updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      returnDocument: 'after', // Return modified document instead of original
      runValidators: true, // Re-run schema validators on updated fields
    });

    if (!tour) {
      return res.status(404).json({
        status: 'fail',
        message: 'No tour found with that ID',
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

/**
 * @desc    Delete a tour by ID
 * @route   DELETE /api/v1/tours/:id
 * @access  Private/Admin
 */
const deleteTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndDelete(req.params.id);

    if (!tour) {
      return res.status(404).json({
        status: 'fail',
        message: 'No tour found with that ID',
      });
    }

    // Standard REST HTTP 204 No Content for successful deletion
    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

const getTourStats = async (req, res) => {
  try {
    const stats = await Tour.aggregate([
      {
        $match: { ratingsAverage: { $gte: 4.5 } },
      },
      {
        $group: {
          _id: '$difficulty',
          numTours: { $sum: 1 },
          numRatings: { $sum: '$ratingsQuantity' },
          avgRating: { $avg: '$ratingsAverage' },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
        },
      },
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        stats,
      },
    });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err });
  }
};

const getMonthlyPlan = async (req, res) => {
  try {
    const year = req.params.year * 1;

    const plan = await Tour.aggregate([
      {
        $unwind: '$startDates',
      },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lt: new Date(`${year + 1}-01-01`), // Fixes date boundary issue
          },
        },
      },
      {
        $group: {
          _id: { $month: '$startDates' }, // Fixed missing '$' prefix
          numTourStarts: { $sum: 1 },
          tours: { $push: '$name' }, // Optional: collects tour names starting in each month
        },
      },
      {
        $addFields: { month: '$_id' },
      },
      {
        $project: {
          _id: 0, // Hides the default _id field
        },
      },
      {
        $sort: { numTourStarts: -1 }, // Sorts months with the most tour starts first
      },
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        plan,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message || err,
    });
  }
};

export default {
  getAllTours,
  getTour,
  createTour,
  updateTour,
  deleteTour,
  getTourStats,
  aliasTopTours,
  getMonthlyPlan,
};
