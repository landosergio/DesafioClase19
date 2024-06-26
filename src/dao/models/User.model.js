import mongoose from "mongoose";

const UserSchema = mongoose.Schema({
  first_name: String,
  last_name: String,
  email: { type: String, unique: true },
  age: Number,
  password: String,
});

export const UserModel = mongoose.model("User", UserSchema);
