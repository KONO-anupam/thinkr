import mongoose, {  model, Schema } from "mongoose";

mongoose.connect("mongodb+srv://anupam2work:Spiderman_2020@thinkr.gpe3joy.mongodb.net/")

const userSchema = new Schema({
    username: {type: String ,unique: true},
    password:{type: String}
})

export const userModel = model("Users", userSchema)

const contentTypes = ['image', 'video', 'article', 'audio']; // Extend as needed

const contentSchema = new Schema({
  link: { type: String, required: true },
  type: { type: String, enum: contentTypes, required: true },
  title: { type: String, required: true },
  tags: [{ type: mongoose.Types.ObjectId, ref: 'Tag' }],
  userId: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
});

export const contentModel = model("Content", contentSchema)

const linkSchema = new mongoose.Schema({
  hash: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});