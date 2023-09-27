const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Set name for contact"],
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },

    favorite: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: Schema.Types.ObjectId,
      //  "users" - це колекця в який лежать юзери
      ref: "users",
      required: true,
    },
  },
  { versionKey: false }
);

const ContactSchema = mongoose.model("contact", contactSchema);

module.exports = ContactSchema;
