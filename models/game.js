const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const GameSchema = new Schema({
    title: { type: String, required: true},
    studio: {type: Schema.Types.ObjectId, ref: "Studio", required: true},
    description: {type: String, required: true},
    price: { type: Number, required: true},
    num_in_stock: {type: Number, required: true},
    platforms: [{type: Schema.Types.ObjectId, ref: "Platform"}],
    img_url: {type: String, default: 'https://st4.depositphotos.com/14953852/24787/v/600/depositphotos_247872612-stock-illustration-no-image-available-icon-vector.jpg'}
})

GameSchema.virtual("url").get(function() {
    return `/store/games/${this._id}`
});

module.exports = mongoose.model("Game", GameSchema);