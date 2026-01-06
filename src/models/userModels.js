import mongoose,{Schema} from "mongoose";

const userSchema = new Schema({
    email: {
      type: String,
      required: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      unique: true,
    },
     password: {
      type: String,
      required: true,
      min: 4,
    },
    fullName : {
        type : String,
        required : true,
    },
    phoneNumber: {
      type: String,
      required: true,
      set: (v) => String(v).replace(/\s+/g, "").trim(), // strip spaces
      match: [/^\+?[0-9]{10,15}$/, "Please enter a valid phone number"],
    },
    verified : {
        type : Boolean,
        default : false,
    },
    otp : {
        type : Number,
    },
    otpExpiry : {
        type : Date,
    },
    blocked : {
        type : Boolean,
        default : false,
    }

},{timestamps:true});

export default mongoose.models.User || mongoose.model("User", userSchema);
