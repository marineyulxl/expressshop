const { model, Schema } = require('mongoose')
const videoSchema = new Schema({
    videoUrl: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
})
module.exports = model('Video', videoSchema)