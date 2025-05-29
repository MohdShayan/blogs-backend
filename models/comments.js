
import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
    },
    blogId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "blog",
        required: true,
    },
}, {timestamps: true});

const COMMENT = mongoose.model("comment", commentSchema);

export default COMMENT;