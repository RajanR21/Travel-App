// const { toJSON } = require("./plugins");
import mongoose from "mongoose";

const citySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    state: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "State",
      required: true,
    },
  },
  { timestamps: true }
);

// citySchema.plugin(toJSON);

const City = mongoose.model("City", citySchema);

export { City };
