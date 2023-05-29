const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const StudioSchema = new Schema({
    name: {type: String, required: true},
    img_url: {type: String, default: 'https://st4.depositphotos.com/14953852/24787/v/600/depositphotos_247872612-stock-illustration-no-image-available-icon-vector.jpg'}
});

StudioSchema.virtual("url").get(function() {
    return `/store/studios/${this._id}`;
})

module.exports = mongoose.model("Studio", StudioSchema);