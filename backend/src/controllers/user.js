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

