import bcrypt from "bcrypt";
import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import { createUserService, getUserByUsernameService, getUserByFullnameService } from "../models/userModel.js";

//@desc Register user
//@route POST /api/auth/register
//access Public
export const registerUser = asyncHandler(async (req, res) => {
  const { fullname, username,  password, role} = req.body;

  if (!username || !password || !fullname) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const formattedUsername = username.toLowerCase()

  const formattedFullname = fullname.toLowerCase()

  
  //check if username already exists
  const existingUsername = await getUserByUsernameService(formattedUsername);
  if (existingUsername) {
    return res.status(409).json({ message: "Username already exists" });
  }

  //check if fullname already exists
  const existingFullname = await getUserByFullnameService(formattedFullname);
  if (existingFullname) {
    return res.status(409).json({ message: "Full name already exists" });
  }

  //hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await createUserService(formattedFullname, formattedUsername, hashedPassword, role);
  if (user) {
    res.status(201).json({ message: "User registered", user });
  }
})


//@desc Login user
//@route POST /api/auth/login
//access Public
export const loginUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  //check if the user exists
  const foundUser = await getUserByUsernameService(username);
  if (!foundUser) {
    return res.status(404).json({ message: "User doesn't exist" });
  }

  //check if user is active
  if(!foundUser.active) {
    return res.status(401).json({message: "User is deactivated"})
  }


  //check if password is correct
  const isMatch = await bcrypt.compare(password, foundUser.password);

  if (!isMatch) {
    return res.status(401).json({ message: "Password is incorrect" });
  }

  //Generate access token
  const accessToken = jwt.sign(
    {
      UserInfo: {
        id: foundUser.id,
        username: foundUser.username,
        fullname: foundUser.fullname,
        role: foundUser.role,
      },
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" }
  );

  //generate refresh token
  const refreshToken = jwt.sign(
    { username: foundUser.username },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );

  //send cookie to frontend
  res.cookie("jwt", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000, //7days
  });

  res.json({ accessToken });
});


//@desc Generating new access token from refresh token
//@route GET /api/auth/refresh
//access Public - because access token has expired
export const refresh = asyncHandler(async (req, res) => {
  const cookie = req.cookies;

  if (!cookie?.jwt) return res.status(401).json({ message: "Unauthorized" });

  const refreshToken = cookie.jwt;

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    asyncHandler(async (err, decoded) => {
      if (err)
        return res
          .status(403)
          .json({ message: "Forbidden. Refresh Token expired." });

      //check if the user exists
      const foundUser = await getUserByUsernameService(decoded.username);
      if (!foundUser)
        return res.status(401).json({ message: "Unauthorized no user found" });

      //Generate access token
      const accessToken = jwt.sign(
        {
          UserInfo: {
            id: foundUser.id,
            username: foundUser.username,
            fullname: foundUser.fullname,
            role: foundUser.role,
          },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "15s" }
      );

      res.json({accessToken})
    })
  );
});

// @desc Logout
// @route POST /api/auth/logout
// @access Public 
export const logout = asyncHandler(async (req, res) => {
  const cookies = req.cookies;
  if(!cookies?.jwt) return res.sendStatus(204)
  
  res.clearCookie("jwt", {
    httpOnly: true,
    secure: true,
    sameSite: 'none'
  });

  res.json({message: "cookie cleared"})
})