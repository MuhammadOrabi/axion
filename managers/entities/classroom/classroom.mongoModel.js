const { model, Schema } = require('mongoose');

const classroomSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  schoolId: {
    type: Schema.Types.ObjectId,
    ref: 'School',
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

// Create the Classroom model
module.exports = model('Classroom', classroomSchema);