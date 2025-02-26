const Upload = require("../models/uploadSchema");
const mongoose = require("mongoose");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const cloudinary = require("../utils/cloudinary");



const uploadVideoToCloudinary = (fileBuffer) => {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: "video",
          folder: "lms",
        },
        (error, result) => {
          if (error) {
            reject(new AppError(error.message, 500));
          } else {
            resolve(result.secure_url);
          }
        }
      );
  
      uploadStream.end(fileBuffer);
    });
  };

const uploadVideo = async (req, res) => {
    const {  teacherName, chapter } = req.body;

    try {
        if (!req.file) {
            console.log(req.file);
          return next(new AppError("Please upload a video file!", 400));
        }
        const url = await uploadVideoToCloudinary(req.file.buffer);
        // Check if a document with the same school, sclassName, subName, and teacherName exists
        let existingVideo = await Upload.findOne({ teacherName });

        if (existingVideo) {
            // Check if the chapter already exists
            const chapterExists = existingVideo.videos.some(video => video.chapter === chapter);
            
            if (chapterExists) {
                return res.status(400).json({ error: "This chapter already exists." });
            }

            // If chapter does not exist, push new video details
            existingVideo.videos.push({ chapter, videoUrl: url });
            await existingVideo.save();
            return res.status(200).json({ message: "Video added successfully to the existing subject.", 
                data: {chapter, videoUrl: url}
             });
        }

        // If no existing document, create a new one
        const newVideo = new Upload({
            teacherName,
            videos: [{ chapter, videoUrl: url }]
        });

        await newVideo.save();
        return res.status(201).json({ message: "Video uploaded successfully." });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};


const getAllVideos = async (req, res) => {
    const {  teacherName } = req.body;

    try {
        const existingVideo = await Upload.findOne({ teacherName });
        return res.status(200).json({status: "success", message: "Fetched successfully", videos: existingVideo.videos });
}catch(err){
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
}
}

const getVideo = async (req, res) => {
    const {  teacherName, chapterId } = req.body;

    try {
        const existingVideo = await Upload.findOne({ teacherName});
        if(!existingVideo){
            return res.status(404).json({error: "Video not found"});
        }
        const video = existingVideo.videos.find(video =>{
           return video._id.toString() === chapterId
        } );
        if(!video){
            return res.status(404).json({error: "Video not found"});
        }
        return res.status(200).json({status: "success", message: "Fetched successfully", video: video });
}catch(err){
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
}
}

const editVideo = async (req, res) => {
    const {  teacherName, chapterId, chapter } = req.body;

    try {
        const existingVideo = await Upload.findOne({ teacherName});
        if(!existingVideo){
            return res.status(404).json({error: "Video not found"});
        }
        const video = existingVideo.videos.find(video =>{
           return video._id.toString() === chapterId
        } );
        if(!video){
            return res.status(404).json({error: "Video not found"});
        }
        video.chapter = chapter;
        // video.videoUrl = videoUrl;
        await existingVideo.save();
        return res.status(200).json({status: "success", message: "Video updated successfully"});
}
catch(err){
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
}
}


const deleteVideo = async (req, res) => {
    const {  teacherName, chapterId } = req.body;

    // Validate if chapterId is a valid ObjectId
    if (!chapterId || !mongoose.Types.ObjectId.isValid(String(chapterId))) {
        return res.status(400).json({ error: "Invalid chapterId format. Must be a valid ObjectId." });
    }
    try {
        const teacherVideo = await Upload.findOne({ teacherName });
        if (!teacherVideo) {
            return res.status(404).json({ error: "Video not found by the teacher" });
        }
        const video = teacherVideo.videos.find(video => video._id.toString() === chapterId);
        if (!video) {
            return res.status(404).json({ error: "Video not found" });
        }
        // video.remove();
        teacherVideo.videos.pull({ _id: chapterId });
        await teacherVideo.save();
        // const result = await Upload.findOneAndUpdate(
        //     { teacherName,  },
        //     { $pull: { videos: { _id: new mongoose.Types.ObjectId(chapterId) } } },
        //     { new: true }
        // );


        return res.status(200).json({ status: "success", message: "Video deleted successfully" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};



module.exports = { uploadVideo, getAllVideos, getVideo, editVideo, deleteVideo };