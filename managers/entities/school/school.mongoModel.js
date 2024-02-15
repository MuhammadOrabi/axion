const { model, Schema } = require('mongoose');

const schoolSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  adminId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
}, {
  toJSON: {
    transform: function (doc, ret) {
      delete ret.__v;
      ret.id = ret._id;
      delete ret._id;
      return ret;
    }
  }
});

// Create the School model
module.exports = model('School', schoolSchema);