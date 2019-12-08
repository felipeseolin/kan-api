const mongoose = require('mongoose');

const { Schema } = mongoose;

const BoardSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  _user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  lists: [{
    type: Schema.Types.ObjectId,
    ref: 'List',
  }],
}, { timestamps: true });

mongoose.model('Board', BoardSchema);
