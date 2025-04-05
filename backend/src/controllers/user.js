import { TryCatch } from "../middlewares/error.js";
import { User } from "../models/user.js";

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


// `select * from (select v12 as opening , (select sum(v8) from tran2 as t1  where t1.mastercode1=master1.code and  ( t1.t3 not like  'PDC'  or t1.t3 is null ) and t1.dated <  #2025-03-19#    and Vchtype not in (12,13,27,26,31,36 ,11,4,5 )   group by  t1.mastercode1) as bal,code,parentgrp,(SELECT name FROM master1 as m WHERE m.code =master1.code) as Account,(SELECT name FROM master1 as m WHERE m.code = master1.parentgrp) as parentgrpname  from master1  where mastertype=2   and parentgrp not in (122,123,124,126,125,127,115,108,-1) 
// union all select v12 as opening , (select sum(v8) from tran2 as t1  where t1.mastercode1=master1.code and  ( t1.t3 not like  'PDC'  or t1.t3 is null ) and t1.dated >  #24-04-01#  and t1.dated <  #2025-03-19#    and Vchtype not in (12,13,27,26,31,36 ,11,4,5 )   group by  t1.mastercode1) as bal,code,parentgrp,(SELECT name FROM master1 as m WHERE m.code =master1.code) as Account,(SELECT name FROM master1 as m WHERE m.code = master1.parentgrp) as parentgrpname   from master1  where mastertype=2   and parentgrp  in (122,123,124,126,125,127,-1) 
// union all select v12 as opening , (select sum(v8) from tran2 as t1  where t1.mastercode1=master1.code and  ( t1.t3 not like  'PDC'  or t1.t3 is null ) and t1.dated >  #24-04-01#  and t1.dated <  #2025-03-19#    and Vchtype not in (12,13,27,26,31,36 ,11,4,5 )   group by  t1.mastercode1) as bal,code,parentgrp,(SELECT name FROM master1 as m WHERE m.code =master1.code) as Account,(SELECT name FROM master1 as m WHERE m.code = master1.parentgrp) as parentgrpname   from master1  where mastertype=2   and parentgrp  in (108,-1) 
// union all select    v12 as opening  ,(select top 1 amount from ClosingStockValuenew  where   dated <  #2025-03-19#     and mastercode=master1.code  order by dated desc) as bal,code,parentgrp,(SELECT name FROM master1 as m WHERE m.code =master1.code) as Account,(SELECT name FROM master1 as m WHERE m.code = master1.parentgrp) as parentgrpname   from master1  where mastertype=2   and parentgrp  in (115,-1)  ) as v`
