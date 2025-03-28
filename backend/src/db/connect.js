import mongoose from "mongoose";
export const dbConnection = (mongoURI) => {
    mongoose
      .connect(mongoURI, {
        dbName: "auth-app_2025",
      })
      .then(() => {
        console.log("Connected to database!");
      })
      .catch((err) => {
        console.log("Some error occured while connecting to database:", err);
      });
  };