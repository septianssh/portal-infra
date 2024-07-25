// controllers/auth.controller.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const signIn = async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const secretKey = process.env.JWT_SECRET_KEY;
    const payload = {
      userId: user.id,
    };
    const token = jwt.sign(payload, secretKey);
    const expiryDate = new Date(Date.now() + 3600000); // 1 hour
    const { password: hashedPassword, ...rest } = user.dataValues;
    const resData = { ...rest, tokenExpiry: expiryDate };

    res
      .cookie("access_token", token,
        {
          httpOnly: true,
          secure: true,
          sameSite: 'None',
          expires: expiryDate
        })
      .status(200)
      .json(resData);
  } catch (error) {
    next(error);
  }
};

export const signOut = async (req, res, next) => {
  res.clearCookie("access_token").status(200).json("Signout Success!");
};
