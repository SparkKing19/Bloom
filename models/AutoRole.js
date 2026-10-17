const mongoose = require('mongoose');

const autoroleSchema = new mongoose.Schema({
    guildId: { type: String, required: true, unique: true },
    roleId: { type: String, required: true }
});

module.exports = mongoose.models.AutoRole || mongoose.model('AutoRole', autoroleSchema);
