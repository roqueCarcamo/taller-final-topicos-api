const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
  text: {
    type: String,
    required: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  answer: [{
    type: Schema.Types.ObjectId,
    ref: 'answer'
  }]
},{
    timestamps: true
});
    
module.exports = mongoose.model('question', schema);
