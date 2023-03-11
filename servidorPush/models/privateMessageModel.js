const mongoose = require('mongoose')
const Schema = mongoose.Schema

var PrivateMessagesSchema = new Schema({
  id: {
    type: String,
    required: [true, 'Message must have a ID'],
    trim: true,
    //unique: [true, 'Verificar isso, colocar pra funcionar.' ]
  },
  toAndFrom: {
    type: String,
    required: [true, 'toAndFrom Juntos para fazer a busca do histórico'],
    trim: true
  },
  from: {
    type: String,
    required: [true, 'from is required'],
    trim: true
  },
  to: {
    type: String,
    required: [true, 'to is required'],
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
  identificador: {
    type: String,
    required: [false, 'Identificador das imagens e videos'],
    trim: true
  },
  visualizada: {
    type: Boolean,
    required: [false, 'Indica se ja foi visualizado imagens, videos ou texto'],
    trim: true,
    default: false
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

const PrivateMessages = mongoose.model('PrivateMessage', PrivateMessagesSchema)

module.exports = PrivateMessages
