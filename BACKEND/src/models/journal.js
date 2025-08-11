const { kMaxLength } = require("buffer");
const mongoose = require("mongoose");
const { type } = require("os");

const journalSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    tags: {
      type: [String], // Array of strings for tags
      default: [],
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
    summary: {
      type: String,
      maxLength: 500,
    },
    image: {
      type: String, // URL or path to the image
      default: null,
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
  }
);
journalSchema.index({ title: "text", content: "text" });

const Journal = mongoose.model("Journal", journalSchema);
module.exports = Journal;
