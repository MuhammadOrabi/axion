const { model, Schema } = require('mongoose');

const systemRoles = require("../../../static_arch/roles.system")
const roles = Object.values(systemRoles);

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  role: {
    type: String,
    enum: roles,
  },
  active: {
    type: Boolean,
    default: true,
  }
}, {
  toJSON: {
    transform: function (doc, ret) {
      delete ret.password;
      delete ret.__v;
    }
  }
});

// Create the User model
module.exports = model('User', userSchema);