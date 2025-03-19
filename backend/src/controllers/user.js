import { TryCatch } from "../middlewares/error";

export const updateProfile = TryCatch(async (req, res) => {
  const { name, email } = req.body;
  const user = await User.findByIdAndUpdate(
    req.user.id,
    { name, email },
    { new: true }
  );
  res.json({ message: "Profile updated", user });
})

// Update Password
export const updatePassword = TryCatch(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const user = await User.findById(req.user.id);

  if (!(await bcrypt.compare(oldPassword, user.password))) {
    return res.status(400).json({ error: "Incorrect current password" });
  }

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();
  res.json({ message: "Password updated" });
});

export const getProfile = TryCatch(async (req, res, next) => {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return next(new ErrorHandler("User not found", 404));
  
    res.status(200).json(user);
  });
// Get User Role
export const getUserRole = TryCatch(async (req, res) => {
  const user = await User.findById(req.user.id);
  res.json({ role: user.role });
});

export const deleteAccount = TryCatch(async (req, res, next) => {
  await User.findByIdAndDelete(req.user.id);
  res.clearCookie("refreshToken");
  res.status(200).json({ message: "Account deleted" });
});

