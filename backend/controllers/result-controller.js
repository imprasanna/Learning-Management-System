const fs = require('fs');
const path = require('path');
const fastCsv = require('fast-csv');
const Student = require("../models/studentSchema")


// K-Means Clustering Function
function kMeansClustering(data, k, maxIterations = 100) {
    let points = data.map(({ name, rollNum, marks }) => ({ name, rollNum, marks }));

    // Step 1: Initialize centroids randomly
    let centroids = points
        .sort(() => Math.random() - 0.5) // Shuffle data
        .slice(0, k) // Pick first K elements as initial centroids
        .map(point => point.marks);

    let clusters = new Array(k);
    let prevCentroids = [];

    for (let iter = 0; iter < maxIterations; iter++) {
        // Step 2: Assign each point to the nearest centroid
        clusters = Array.from({ length: k }, () => []);
        points.forEach(point => {
            let distances = centroids.map(c => Math.abs(point.marks - c));
            let clusterIndex = distances.indexOf(Math.min(...distances));
            clusters[clusterIndex].push(point);
        });

        // Step 3: Recalculate centroids
        prevCentroids = [...centroids];
        centroids = clusters.map(cluster => {
            if (cluster.length === 0) return prevCentroids[clusters.indexOf(cluster)]; // Prevent empty clusters
            return cluster.reduce((sum, point) => sum + point.marks, 0) / cluster.length;
        });

        // Step 4: Stop if centroids don't change
        if (centroids.every((c, i) => c === prevCentroids[i])) break;
    }

    // Step 5: Assign Grades ("A", "B", "C"...) based on cluster performance
    let sortedCentroids = [...centroids].sort((a, b) => b - a); // Sort centroids in descending order
    let result = [];
    const grades = ["A", "B", "C", "D", "E", "F"]; // Extend if needed

    clusters.forEach((cluster, index) => {
        let grade = grades[sortedCentroids.indexOf(centroids[index])] || "F"; // Assign grade based on rank
        cluster.forEach(student => {
            result.push({
                name: student.name,
                rollNum: student.rollNum,
                marks: student.marks,
                grade: grade
            });
        });
    });

    return result;
}


// Elbow Method to Find Optimal K
function findOptimalK(data) {
    let minK = 1, maxK = Math.min(10, data.length); // Limit max k to avoid overfitting
    let sseValues = [];

    for (let k = minK; k <= maxK; k++) {
        let clusters = kMeansClustering(data, k);
        
        // Calculate SSE
        let centroids = clusters.reduce((acc, student) => {
            if (!acc[student.grade]) acc[student.grade] = [];
            acc[student.grade].push(student.marks);
            return acc;
        }, {});

        let sse = Object.values(centroids).reduce((total, marks) => {
            let mean = marks.reduce((a, b) => a + b, 0) / marks.length;
            return total + marks.reduce((sum, m) => sum + Math.pow(m - mean, 2), 0);
        }, 0);

        sseValues.push({ k, sse });
    }

    // Find the "elbow" point using the maximum drop in SSE
    let optimalK = minK;
    let maxDrop = 0;
    for (let i = 1; i < sseValues.length; i++) {
        let drop = sseValues[i - 1].sse - sseValues[i].sse;
        if (drop > maxDrop) {
            maxDrop = drop;
            optimalK = sseValues[i].k;
        }
    }

    return optimalK;
}

const getStudentMarksBySubject = async(classId, subjectId) => {
    try {
    const students = await Student.find({ sclassName: classId });

    const result = students.map(student => {
        // Check if examResult exists and is an array
        if (Array.isArray(student.examResult)) {
            const subjectResult = student.examResult.find(sub => sub.subName.toString() === subjectId);
            
            if (subjectResult) {
                return {
                    name: student.name,
                    rollNum: student.rollNum,
                    marks: subjectResult.marksObtained || null
                };
            }
        }
        return {
            name: student.name,
            rollNum: student.rollNum,
            marks: null
        };
    }).filter(Boolean); // Remove null values (students with no matching subject)
    return result;
}catch(err){
    throw err;
}
}

const getAllStudentsMarksBySubject = async (req, res) => {
    try {
        const { classId, subjectId } = req.body; // Consider using req.query if using GET method
        if (!classId || !subjectId) {
            return res.status(400).json({ success: false, message: "classId and subjectId are required" });
        }

        const studentResult = await getStudentMarksBySubject(classId, subjectId);
        const optimalK = findOptimalK(studentResult);
        const result = kMeansClustering(studentResult, optimalK);
        console.log(result);

        res.status(200).json({
            success: true,
            message: "Students marks fetched successfully",
            data: result
        });

    } catch (err) {
        res.status(500).json({ success: false, message: "Internal Server Error", error: err.message });
    }
};

const editStudentMarks = async (req, res) => {
    try {
        const { rollNum, subjectId,classId, marks } = req.body;
        if (!rollNum || !subjectId || !marks) {
            return res.status(400).json({ success: false, message: "studentId, subjectId, and marks are required" });
        }
if(marks<0 || marks>100){
    return res.status(400).json({ success: false, message: "Marks should be between 0 and 100" });
}

        const student = await Student.findOne({rollNum: rollNum});
        if (!student) {
            return res.status(404).json({ success: false, message: "Student not found" });
        }

        const subjectIndex = student.examResult.findIndex(sub => sub.subName.toString() === subjectId);
        if (subjectIndex === -1) {
            return res.status(404).json({ success: false, message: "Subject not found" });
        }

        student.examResult[subjectIndex].marksObtained = marks;
        await student.save();

        const result = await getStudentMarksBySubject(classId, subjectId);

        res.status(200).json({ success: true, message: "Student marks updated successfully", data: result });

    } catch (err) {
        res.status(500).json({ success: false, message: "Internal Server Error", error: err.message });
    }
}

const deleteStudentMarks = async (req, res) => {
    const { rollNum, subjectId, classId } = req.body;
    if (!rollNum || !subjectId || !classId) {
        return res.status(400).json({ success: false, message: "rollNum, classId and subjectId are required" });
    }
    const student = await Student.findOne({rollNum: rollNum});
    if (!student) {
        return res.status(404).json({ success: false, message: "Student not found" });
    }
    const subjectIndex = student.examResult.findIndex(sub => sub.subName.toString() === subjectId);
    if (subjectIndex === -1) {
        return res.status(404).json({ success: false, message: "Subject not found" });
    }
    student.examResult[subjectIndex].marksObtained = null;
    await student.save();

    const result = await getStudentMarksBySubject(classId, subjectId);

    res.status(200).json({ success: true, message: `Student ${student.name}'s marks deleted successfully`, data: result });
}


const downloadStudentResult = async (req, res) => {
    try {
        const { classId, subjectId } = req.body; // Consider using req.query for GET requests
        if (!classId || !subjectId) {
            return res.status(400).json({ success: false, message: "classId and subjectId are required" });
        }

        const studentResult = await getStudentMarksBySubject(classId, subjectId);
        const optimalK = findOptimalK(studentResult);
        const result = kMeansClustering(studentResult, optimalK);

        res.setHeader("Content-Disposition", `attachment; filename=student_result_${classId}_${subjectId}.csv`);
        res.setHeader("Content-Type", "text/csv");

        const csvStream = fastCsv.format({ headers: true });
        csvStream.pipe(res);

        result.forEach(student => {
            csvStream.write({
                Name: student.name,
                RollNumber: student.rollNum,
                Marks: student.marks,
                Grade: student.grade,
            });
        });

        csvStream.end();
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
};

module.exports = {
    getAllStudentsMarksBySubject,
    editStudentMarks,
    deleteStudentMarks,
    downloadStudentResult
}