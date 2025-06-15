import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const signup = async (req, res) => {
    try{
        const {username, email, password} = req.body;
        // Checking if already a user exist with given username
        const checkUser = await User.findOne({username});
        const checkMail = await User.findOne({email});

        // console.log(`Signup request with username:${username}, email:${email}, pwd:${password}`);

        if (checkUser){
            return res.status(400).json({message: "Username already taken"});
        }
        if (checkMail){
            return res.status(400).json({message: "Email already exists"});
        }
    
        const hashedPwd = await bcrypt.hash(password, 10);
        // Creating the new user to store in the database
        const newUser = new User({
            username: username,
            email: email,
            password: hashedPwd
        });
        // Saving in the database
    
        await newUser.save();
        // Send the jwt token
        const token = jwt.sign(
            {id: newUser._id},
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );
        res.status(200).json({message: "User Created Successfully", token})
    }
    catch (err){
        res.status(500).json({message: "Error with server"});
    }

};

export const login = async (req, res) => {
    try{
        const { email, password } = req.body;
        const userCred = await User.findOne({email});

        // console.log(`Req recieved for login with email:${email} and pwd:${password}`);

        if (!userCred){
            return res.status(400).json({message: "User not found"});
        }

        // Check the current password with stored password
        const storedPass = userCred.password;
        const isMatch = await bcrypt.compare(password, storedPass);

        if (!isMatch){
            return res.status(400).json({message: "Invalid password"});
        }

        // Generate a jwt token and give it to client
        const token = jwt.sign({id: userCred._id}, process.env.JWT_SECRET, {expiresIn: '7d'});
        res.status(200).json({message: "Logged in successfully", token});
    }
    catch (err){
        res.status(500).json({message: "Error with server"});
    }
    
};

export const checkMail = async (req, res)=>{
    try {
        const {email} = req.body;
        const user = await User.findOne({email: email});

        // console.log(`Request received for checkingMail with mail:${email}`);

        if (user) 
            return res.status(200).json({ exists: true, message: 'Email exists' });
        else 
            return res.status(200).json({ exists: false, message: 'Email not found' });
        
  } catch (error) {
        res.status(500).json({ message: 'Server error' });
  }

  
}

export const checkToken = async (req, res) =>{
    const token = req.body.token;

    // console.log(`Recieved the token:${token}`);

    if (!token) return res.status(401).json({ message: "Access Denied. No token provided." });

    try {
        jwt.verify(token, process.env.JWT_SECRET);
        res.status(200).json({ message: "Token verified successfully" });
    } catch (err) {
        res.status(400).json({ message: "Invalid Token" });
    }
};