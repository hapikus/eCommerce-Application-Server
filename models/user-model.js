const {Schema, model} = require('mongoose');

const UserSchema = new Schema({
    email: {type: String, unique: true, required: true},
    password: {type: String, required: true},
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    isActivated: {type: Boolean, default: false},
    activationLink: {type: String},
    billingAddress: [{type: Schema.Types.ObjectId, ref: 'BillingAddress'}],
    shippingAddress: [{type: Schema.Types.ObjectId, ref: 'ShippingAddress'}],
    orders: [{type: Schema.Types.ObjectId, ref: 'Order'}],
});

module.exports = model('User', UserSchema);