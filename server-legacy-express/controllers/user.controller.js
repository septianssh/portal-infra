import User from "../models/User.js";
import bcrypt from "bcryptjs";

export const createUser = async (req, res) => {
  const { username, email, password, roles } = req.body.formData;

  try {
    let user = await User.findOne({ where: { username } });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    user = await User.create({ username, email, password: hashedPassword, roles });
    const { password: _, ...rest } = user.dataValues;
    res.status(201).json({ message: "User registered successfully", user: { ...rest } });
  } catch (err) {
    console.log(err)
    const errorMessage = err.errors[0].message;
    const errorType = err.errors[0].type;
    if (errorMessage) {
      return res.status(400).json({ message: `Get Error ${errorType} with ${errorMessage}` });
    }
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

export const readUserList = async (req, res) => {
  try {
    const userList = await User.findAll();

    res.status(200).json({ userList });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

export const updateUser = async (req, res, next) => {
  const { id, username, email, password } = req.body.formData;
  console.log(req.body);
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.update(
      { username, email, password: hashedPassword },
      { where: { id: id } }
    );
    res.status(201).json({ message: "User update successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

export const deleteUser = async (req, res, next) => {
  const { id } = req.params;
  try {
    await User.destroy({ where: { id: id } });
    res.status(201).json({ message: "User delete successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};
