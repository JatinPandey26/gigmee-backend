import User from "../Models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import createError from "../utils/createError.js";

export const register = async (req, res, next) => {
  try {
    const hashedPassword = bcrypt.hashSync(req.body.password, 10);
    const newUser = await User.create({
      ...req.body,
      password: hashedPassword,
    });
    const { password, ...info } = newUser._doc;
    res.status(201).send(info);
  } catch (error) {
    next(createError(500, error)); 
  }   
}; 
    
export const login = async (req, res, next) => {
  try { 
    const user = await User.findOne({ username: req.body.username });

    if (!user) { 
      return next(createError(404, "User not found"));
    }

    const isCorrectPassword = bcrypt.compareSync(
      req.body.password,
      user.password
    );

    if (!isCorrectPassword) {
      return next(createError(400, "Incorrect username or password"));
    }

    const token = jwt.sign(
      {
        id: user._id,
        isSeller: user.isSeller,
      },
      process.env.JWT_SECRET
    );

    const { password, ...info } = user._doc;

    res
      .cookie("accessToken", token, {
        httpOnly: true,
      })
      .status(200)
      .send(info);
  } catch (error) {
    return next(createError(500, "Something went wrong"));
  }
};

export const logout = async (req, res) => {
  try {
    res
      .clearCookie("accessToken", {
        sameSite: "none",
        secure: true,
      })
      .status(200)
      .send("Logged out successfully");
  } catch (error) {}
};
