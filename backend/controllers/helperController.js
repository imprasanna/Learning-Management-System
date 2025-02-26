const Student = require("../models/studentSchema");


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


module.exports = {
    kMeansClustering,
    findOptimalK,
    getStudentMarksBySubject
};