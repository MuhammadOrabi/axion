const { model, Schema } = require('mongoose');

const studentSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  schoolId: {
    type: Schema.Types.ObjectId,
    ref: 'School',
    required: true
  },
  classroomIds: [{
    type: Schema.Types.ObjectId,
    ref: 'Classroom',
  }],
}, {
  toJSON: {
    virtuals: true,
    transform: function (doc, ret) {
      delete ret.__v;
      ret.id = ret._id;
      delete ret._id;
      return ret;
    }
  },
  toObject: {
    virtuals: true
  }
});

studentSchema.virtual('classrooms', {
  ref: 'Classroom',
  localField: 'classroomIds',
  foreignField: '_id',
});

// Create the Student model
module.exports = model('Student', studentSchema);