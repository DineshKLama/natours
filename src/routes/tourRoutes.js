import express from 'express';
import tourController from '../controllers/tourController.js';

/////////////////////////////////////////////////
// API ROUTES

const tourRouter = express.Router();

// tourRouter.param('id', tourController.checkId);

tourRouter
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.createTour);
tourRouter
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

export default tourRouter;
