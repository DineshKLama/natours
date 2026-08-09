import Tour from '../models/tourModel.js';

/**
 * @desc    Get all tours
 * @route   GET /api/v1/tours
 * @access  Public
 */
export const getAllTours = async (req, res) => {
  try {
    // BUilD QUERY
    // 1) Filtering
    const queryObj = { ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((field) => delete queryObj[field]);

    // Advanced Filtering
    // console.log(req.query);
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    let query = Tour.find(JSON.parse(queryStr));

    // ------------------------------------------------------------------
    // 2) SORTING
    // ------------------------------------------------------------------
    // Example: ?sort=-price,ratingsAverage -> query.sort('-price ratingsAverage')
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      // Default sort by creation date descending (newest first)
      query = query.sort('-createdAt');
    }

    // 3) FIELD LIMITING
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      query = query.select(fields);
    } else {
      query = query.select('-__v');
    }

    // 4) PAGINATION AND LIMIT
    const page = req.query.page * 1 || 10;
    const limit = req.query.limit * 1 || 100;
    const pageIndex = (page - 1) * limit;

    if (req.query.page) {
      const countItem = await Tour.countDocuments();
      query = query.skip(pageIndex).limit(limit);

      if (pageIndex >= countItem) throw new Error('This page does not exist');
    }

    // ------------------------------------------------------------------
    // EXECUTE QUERY
    // ------------------------------------------------------------------
    const tours = await query;

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
export const getTour = async (req, res) => {
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
export const createTour = async (req, res) => {
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
export const updateTour = async (req, res) => {
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
export const deleteTour = async (req, res) => {
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

export default {
  getAllTours,
  getTour,
  createTour,
  updateTour,
  deleteTour,
};
