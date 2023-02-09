const mongoose = require('mongoose')
const Schema = mongoose.Schema

var ChatMessagesSchema = new Schema({
  id: {
    type: Number,
    required: [true, 'Message must have a ID'],
    trim: true,
    // unique: true
  },
  username: {
    type: String,
    required: [true, 'Username is required'],
    trim: true
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    trim: true
  },
  time: {
    type: Date,
    required: [true, 'Time is required'],
    default: Date.now
  },
})

const ChatMessages = mongoose.model('ChatMessage', ChatMessagesSchema)

module.exports = ChatMessages
