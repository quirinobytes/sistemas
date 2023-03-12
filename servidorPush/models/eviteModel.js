const mongoose = require('mongoose')
const Schema = mongoose.Schema

var EviteModelSchema = new Schema({
  identificador: {
    type: String,
    required: [true, 'Identificador das imagens e videos'],
    trim: true
  },
  from: {
    type: String,
    required: [true, 'From: nome do usuario que enviou'],
    trim: true
  },
  hash: {
    type: String,
    required: [true, 'Hash das imagens e videos'],
    trim: true
  },
  votosnao: {
    type: Number,
    required: [true, 'Qtde de Votosnao'],
  },
  ranking: {
    type: Number,
    required: [false, 'Ranking'],
  }

})

const EviteModel = mongoose.model('EvitesModel', EviteModelSchema)

module.exports = EviteModel
