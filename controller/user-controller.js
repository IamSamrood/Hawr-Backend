import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import User from "../models/user.js";

export const register = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            email,
            password

        } = req.body;
        const userExist = await User.findOne({ email: email });
        if (userExist) return res.status(400).json({ msg: "Email already used. " });
        const salt = await bcrypt.genSalt();

        const passwordHash = await bcrypt.hash(password, salt);

        const newUser = new User({
            firstName,
            lastName,
            email,
            password: passwordHash,
        });
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);


    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email });
        if (!user) return res.status(400).json({ msg: "User does not exist. " });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: "Invalid credentials. " });

        const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY);
        delete user.password;
        res.status(200).json({ token, user });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
};

export const getUserProfile =async (req, res) => {
    try {
        const { id } = req.user;
        
        const user = await User.findById(id);

        if (!user)
            return res.status(400).json({ message: "User Not Found" });

        res.status(200).json({ user, message: 'Success' });
    } catch (error) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
}

export const updateUserProfile = async (req, res) => {
    try {
        // Extract the user ID from the request
        const { id } = req.user;

        const { firstName, lastName, gender, phone, email } = req.body;

        // Find the user by ID in the database
        let user = await User.findById(id);

        // If user not found, return error
        if (!user) {
            return res.status(400).json({ message: "User Not Found" });
        }

        // Update user information with the data from the request body
        user.firstName = firstName;
        user.lastName = lastName;
        user.phone = phone;
        user.gender = gender;
        

        // Save the updated user information to the database
        user = await user.save();

        // Return success response
        res.status(200).json({ user, message: 'User updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
