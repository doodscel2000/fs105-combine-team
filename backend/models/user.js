const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firebase_id: {
    type: String, // Firebase UID is a string
    required: true,
    unique: true, // Ensures no duplicates
  },
  shops: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop", // Reference to the Shop schema
    },
  ],
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true, // Converts email to lowercase
    validate: {
      validator: function (v) {
        return /^([a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,})$/i.test(v); // Simple regex for email validation
      },
      message: (props) => `${props.value} is not a valid email!`,
    },
  },
  name: {
    type: String,
    required: true,
    trim: true, // Trim whitespace
    minlength: 3, // Minimum length for name
    maxlength: 100, // Maximum length for name
  },
  phone: {
    type: String,
    required: false,
    validate: {
      validator: function (v) {
        return v === "" || /^\+?[1-9]\d{1,14}$/.test(v); // Simple regex for international phone validation
      },
      message: (props) => `${props.value} is not a valid phone number!`,
    },
  },
  address: {
    type: String,
    required: false,
  },
  profileImage: {
    type: String,
    required: false, // Adjust as necessary
  },
  date_joined: {
    type: Date,
    default: Date.now, // Sets the default to the current date
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
