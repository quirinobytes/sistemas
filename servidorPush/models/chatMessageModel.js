const mongoose = require('mongoose')
const Schema = mongoose.Schema

var ChatMessagesSchema = new Schema({
  id: {
    type: Number,
    required: [true, 'Message must have a ID'],
    trim: true,
    // unique: true      <- Verificar isso, colocar pra funcionar.
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
  filepath: {
    type: String,
    required: [false, 'File path in server']
  },
  time: {
    type: Date,
    required: [true, 'Time is required'],
    default: Date.now
  },
  identificador: {
    type: String,
    required: [false, 'Identificador das imagens e videos'],
    trim: true
  },
  votossim: {
    type: Number,
    required: [false, 'Votos sim'],
    default: 0
  },
  votosnao: {
    type: Number,
    required: [false, 'Votos nao'],
    default: 0
  }

})

const ChatMessageModel = mongoose.model('ChatMessage', ChatMessagesSchema)

module.exports = ChatMessageModel
