const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const { Schema } = mongoose;

const ProjectSchema = new Schema(
  {
    createdAt: { type: Date },
    updatedAt: { type: Date },
    name: { type: String, required: true },
    description: { type: String, required: true },
    tags: [{ type: String }],
  },
  { timestamps: { createdAt: 'created_at' } }
);

module.exports = mongoose.model('Project', ProjectSchema);
