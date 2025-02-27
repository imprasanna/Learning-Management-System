const mongoose = require('mongoose');

const uploadSchema = new mongoose.Schema({
    teacherName: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'teacher',
        required: true
    },
   
    videos: [
        {
            chapter: {
                type: String,
                required: true
            },
            videoUrl: {
                type: String,
                required: true
            }
        }
    ],
   
});

module.exports = mongoose.model("upload", uploadSchema);