import Gig from "../Models/gig.model.js";
import createError from "../utils/createError.js";

export const createGig = async (req, res, next) => {
  if (!req.isSeller)
    return next(createError(403, "You are not allowed to create gigs"));

  try { 
    const newGig = await Gig.create({
      userId: req.userId,
      ...req.body,
    });

    res.status(201).json(newGig);
  } catch (error) {
    next(error);
  }
};
export const deleteGig = async (req, res, next) => {
  try {
    const gig = await Gig.findById(req.params.id);

    if (gig.userId !== req.userId)
      return next(createError(403, "You are not allowed to delete this gig"));

    await Gig.findByIdAndDelete(req.params.id);

    res.status(200).send("Gig deleted successfully");
  } catch (error) {
    return next(error);
  }
};
export const getGig = async (req, res, next) => {
  try {
    const gig = await Gig.findById(req.params.id);
    if (!gig) return next(createError(404, "Gig not found"));
    res.status(200).send(gig);
  } catch (error) {
    return next(error);
  }
};
export const getGigs = async (req, res, next) => {
  const q = req.query;

  const filters = {
    ...(q.userId && { userId: q.userId }),
    ...(q.category && { category: q.category }),
    ...((q.min || q.max) && {
      price: { ...(q.min && {$gt : q.min}) , ...(q.max && {$lt : q.max}) },
    }),
    ...(q.search && { title: { $regex: q.search, $options: "i" } }), //'i' - insensitive to case
  };

  try {
    const gigs = await Gig.find(filters).sort({[q.sort] : -1});
    res.status(200).send(gigs);
  } catch (error) {
    return next(error);
  }
};
