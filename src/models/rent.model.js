const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { Schema } = mongoose;

const rentSchema = new Schema({
  //_idRenter: Schema.Types.ObjectId,
  //_idTenant: Schema.Types.ObjectId,
  _idRenter: {type: String, required: true},
  _idTenant: {type: String, required: true},
  _idHouse: {type: String, required: true},
  startRent: { type: Date, required: true},
  endRent: { type: Date},
  numPeoples: {type: Number, required: true, min: 1},
  active: {type: Boolean, default: true},
  price: {
    type: Number,
    required: true,
    min: 10,
  },
  rating: {
    type: Number, 
    min: 1, 
    max: 5, 
  }

}, {
  timestamps: true,
  collection: 'rent',
});



const Rent = mongoose.model('Rent', rentSchema);
module.exports = Rent;
