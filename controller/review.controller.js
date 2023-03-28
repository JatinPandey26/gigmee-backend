import Gig from "../Models/gig.model.js";
import Review from "../Models/review.model.js";
import createError from "../utils/createError.js";

export const getReviewByGigId = async (req, res, next) => {
  try {
    const reviews = await Review.find({ gigId: req.params.gigId });
    res.status(200).send(reviews);
  } catch (error) {
    next(error);
  }
};

export const createReview = async (req, res, next) => {
  try {
    if (req.isSeller)
      return next(createError(403, "Seller cannot create reviews"));

    const review = await Review.findOne({
      gigId: req.body.gigId,
      userId: req.userId,
    });

    if (review) {
      return next(createError(400, "Review already exists"));
    }

    const newReview = await Review.create({
      ...req.body,
      userId: req.userId,
      gigId: req.body.gigId,
    });

    await Gig.findByIdAndUpdate(req.body.gigId, {
      $inc: { totalStars: req.body.star, starNumber: 1 },
    });
 
    res.status(201).send(newReview);
  } catch (error) {
    next(error);
  }
};

export const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findOne({})
  } catch (error) {
    next(error);
  }
};
