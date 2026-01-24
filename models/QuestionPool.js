import { Schema, model } from "mongoose";
import { QuestionSchema } from "../test/QuestionSchema.js";

const QuestionPoolSchema = new Schema(
  {
    name: { type: String, required: true },
    questions: {
      type: [QuestionSchema],
      default: [],
    },

    /* More Fields Can be added later */
  },
  { timestamps: true },
);

export const QuestionPool = model("QuestionPool", QuestionPoolSchema);
