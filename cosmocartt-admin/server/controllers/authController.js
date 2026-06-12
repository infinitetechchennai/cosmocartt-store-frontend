import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";


// REGISTER

export const registerUser = async (req, res) => {

  try {

    const {
      name,
      email,
      password,
      role,
      permissions
    } = req.body;

    const existingUser = await User.findOne({ email });

    if(existingUser){
      return res.status(400).json({
        message: "User already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({

      name,
    
      email,
    
      password: hashedPassword,
    
      role,
    
      permissions
    
    });

    res.status(201).json({
      message: "User Registered Successfully",
      user
    });

  } catch(error){
    res.status(500).json({
      message: error.message
    });
  }

};


// LOGIN

export const loginUser = async (req, res) => {

  try {

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if(!user){
      return res.status(400).json({
        message: "Invalid Credentials"
      });
    }

    if (user.status === "Inactive") {

      return res.status(403).json({
        message: "Account Disabled"
      });
    
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if(!isMatch){
      return res.status(400).json({
        message: "Invalid Credentials"
      });
    }

    const token = jwt.sign({

      id: user._id,
      role: user.role

    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d"
    });

    user.lastLogin = new Date();

    user.activityLogs.push({
      action: "Logged In"
    });

    await user.save();

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax"
    });

    res.status(200).json({
      message: "Login Successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        permissions: user.permissions || []
      }
    });

  } catch(error){
    res.status(500).json({
      message: error.message
    });
  }

};