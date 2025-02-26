const mongoose = require('mongoose');

const uploadSchema = new mongoose.Schema({
    // school: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'admin',
    //     required: true,
    // },

    // sclassName: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'sclass',
    //     required: true,
    // },
 
    // subName: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'subject',
    //     required: true
    // },
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