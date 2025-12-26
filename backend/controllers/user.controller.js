import User from "../models/user.model.js";

const getCurrentUser = async (req, res) => {
  try {
    const userId= req.userId;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: User ID missing" });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json( user );
  } catch (error) {
    return res.status(500).json({ message: "Server error while fetching user" });
  }
};

export { getCurrentUser };