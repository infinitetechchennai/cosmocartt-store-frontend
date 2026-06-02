import User from "../models/User.js";
import bcrypt from "bcryptjs";

// GET USERS
export const getUsers = async (req, res) => {

  try {

    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).json(users);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};

// CREATE USER
export const createUser = async (req, res) => {

  try {

    const {
      name,
      email,
      password,
      role,
      permissions
    } = req.body;

    const existingUser = await User.findOne({
      email
    });

    if (existingUser) {

      return res.status(400).json({
        message: "User already exists"
      });

    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    const user = await User.create({

      name,

      email,

      password: hashedPassword,

      role,

      permissions,

      status: "Active",

      activityLogs: [
        {
          action: "User Created"
        }
      ]

    });

    res.status(201).json(user);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};

// UPDATE USER
export const updateUser = async (req, res) => {

  try {

    const { id } = req.params;

    const updatedUser =
      await User.findByIdAndUpdate(

        id,

        req.body,

        { new: true }

      ).select("-password");

    res.status(200).json(updatedUser);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};

// DELETE USER
export const deleteUser = async (req, res) => {

  try {

    await User.findByIdAndDelete(
      req.params.id
    );

    res.status(200).json({
      message: "User Deleted"
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};