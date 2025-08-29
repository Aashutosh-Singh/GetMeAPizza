import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const { Schema, model } = mongoose;

const userSchema = new Schema({
  email: { type: String, required: true, unique: true, index: true },
  verified: { type: Boolean, default: false },
  handle: { type: String, unique: true, minLength: 3, sparse: true, lowercase: true, trim: true, maxLength: 25 },
    name: { type: String, maxLength: 25, minLength: 3, trim: true },
  password: { type: String, minlength: 6 },
  googleId: { type: String, unique: true, sparse: true },
  githubId: { type: String, unique: true, sparse: true },
  authProvider: {
    type: String,
    enum: ['local', 'google'],
    required: true
  },
  profilePic: String,
  coverPic: String,
  tagline: { type: String, maxLength: 100 },
  bio: { type: String, maxLength: 500 },
  createdAt: { type: Date, default: Date.now },
  verificationCode: String,
  verificationExpires: Date,
});

// Hash password before save
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

// Method for password validation
userSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.models.User || model('User', userSchema);
