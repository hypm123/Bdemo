const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    sid:String,
    address: [String],
    token: { type: String, default: '' },
    id_new_send: [{ type: String, default: '' }],
    id_check_send: [{ type: String, default: '' }],
    name_wl: [{ type: String, default: '' }],
    id_login: [{ type: String, default: '' }],
    pass_check: { type: String, default: '' },
    mnemonic: { type: String, default: '' },
    privateKey: [{ type: String, default: '' }],
    publicKey: { type: String, default: '' },
    hex: { type: String, default: '' },
    type: { type: String, default: 'not_active' },//active
})

module.exports = mongoose.model('address', userSchema);

// message
// code

// Penny Wallet 