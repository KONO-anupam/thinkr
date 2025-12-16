import mongoose, { model, Schema } from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
    throw new Error("db url is missing!");
}
mongoose.connect(dbUrl);
//user schemma 
const userSchema = new Schema({
    username: { type: String, unique: true },
    password: { type: String }
});
export const userModel = model("User", userSchema);
//content schema
const contentTypes = ['image', 'video', 'article', 'audio']; // Extend as needed
const contentSchema = new Schema({
    link: { type: String, required: true },
    type: { type: String, enum: contentTypes, required: true },
    title: { type: String },
    tags: [{ type: mongoose.Types.ObjectId, ref: 'Tag' }],
    userId: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
});
export const contentModel = model("Contents", contentSchema);
//Link schema
const linkSchema = new mongoose.Schema({
    hash: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});
export const linkModel = mongoose.model('Links', linkSchema);
//Tag schema
const tagSchema = new mongoose.Schema({
    title: { type: String, required: true, unique: true }
});
export const tagModel = mongoose.model('Tag', tagSchema);
//# sourceMappingURL=db.js.map