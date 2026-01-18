const mongoose = require('mongoose');


const ApplicationSchema = new mongoose.Schema({
  name: String,
  department: String,
  year: String,
  studentEmail: String,
  phoneNumber: String,
  subject: String,
  content: String,

  stage: { type: String, enum: ['advisor', 'hod', 'principal'], default: 'advisor' },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  finalStatus: { type: String, enum: ['approved', 'rejected'], default: null },

  advisorStatus: { type: String, enum: ['approved', 'rejected'], default: null },
hodStatus: { type: String, enum: ['approved', 'rejected'], default: null },
principalStatus: { type: String, enum: ['approved', 'rejected'], default: null },


  stageHistory: [{
    stage: { type: String, enum: ['advisor', 'hod', 'principal'], required: true },
    action: { type: String, enum: ['approve', 'reject', 'forward'], required: true },
    decidedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    decidedByRole: { type: String, enum: ['advisor', 'hod', 'principal'], required: true },
    decidedAt: { type: Date, default: Date.now },
    notes: { type: String }
  }]

  

}, { timestamps: true });


module.exports = mongoose.model('Application', ApplicationSchema);
