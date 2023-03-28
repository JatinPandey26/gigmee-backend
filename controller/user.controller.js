import User from "../Models/user.model.js";
import jwt from "jsonwebtoken";
import createError from "../utils/createError.js";
export const deleteUser = async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (req.userId === user._id.toString()) {
    await User.findByIdAndDelete(req.params.id);
  } else {
    return next(createError(403, "You can not delete this account"));
  }

  res.status(200).send("User Deleted");
};

export const getUser = async (req, res, next) => {
  const user = await User.findById(req.params.id);
  try {
    if (!user) next(createError(404, "User not found"));
    res.status(200).send(user);
  } catch (error) {
    next(error);
  }
};
