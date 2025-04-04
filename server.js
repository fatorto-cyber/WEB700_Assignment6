/*********************************************************************************
*  WEB700 – Assignment 06
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part of this
*  assignment has been copied manually or electronically from any other source (including web sites) or 
*  distributed to other students.
* 
*  Name: ____FELIX A TORTO______ Student ID: ___168365229___________ Date: _____2025/04/04
*  Online (Vercel) Link: ________________________________________________________
*
********************************************************************************/ 

const express = require("express");
const path = require("path");
const collegeData = require("./modules/collegeData.js");

const app = express();
const HTTP_PORT = process.env.PORT || 8080;

// Set EJS as the view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware for parsing form data & JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve static files from the "public" directory
app.use(express.static("public"));

// HTML Demo Page - Ensure this is above other routes
app.get("/htmlDemo", (req, res) => {
    res.render("htmlDemo");
});

// Home Route
app.get("/", (req, res) => res.render("home"));

// About Page - Includes Student Info
app.get("/about", (req, res) => {
    res.render("about", {
        name: "Felix Torto",
        studentID: "168365229"
    });
});

// Fetch All Students or by Course
app.get("/students", async (req, res) => {
    try {
        let students;
        if (req.query.course) {
            students = await collegeData.getStudentsByCourse(req.query.course);
        } else {
            students = await collegeData.getAllStudents();
        }
        res.render("students", { students });
    } catch (error) {
        console.error("Error fetching students:", error);
        res.render("students", { message: "No results returned", students: [] });
    }
});

// Fetch All Courses
app.get("/courses", async (req, res) => {
    try {
        const courses = await collegeData.getCourses();
        res.render("courses", { courses });
    } catch (error) {
        console.error("Error fetching courses:", error);
        res.render("courses", { message: "No results returned" });
    }
});

// Fetch a Course by ID
app.get("/course/:id", async (req, res) => {
    const courseId = parseInt(req.params.id, 10);
    try {
        const course = await collegeData.getCourseById(courseId);
        if (course) {
            res.render("course", { course });
        } else {
            res.status(404).send("Course not found");
        }
    } catch (error) {
        console.error("Error fetching course:", error);
        res.status(404).send("Course not found");
    }
});

// Add Course - Render the form to add a new course
app.get("/courses/add", (req, res) => {
    res.render("addCourse", { title: "Add New Course" });
});

// Add Course - Handle POST request to add a new course
app.post("/courses/add", async (req, res) => {
    try {
        await collegeData.addCourse(req.body);  // Call the addCourse function
        res.redirect("/courses");  // Redirect to /courses after adding a new course
    } catch (err) {
        console.error("Error adding course:", err);
        res.status(500).send("Unable to add course: " + err);
    }
});

// Update Course - Render the form to update an existing course
app.get("/course/update/:id", async (req, res) => {
    const courseId = req.params.id;
    try {
        const course = await collegeData.getCourseById(courseId);
        if (course) {
            res.render("updateCourse", { title: `Update Course - ${course.courseCode}`, course });
        } else {
            res.status(404).send("Course not found");
        }
    } catch (err) {
        console.error("Error fetching course for update:", err);
        res.status(500).send("Unable to retrieve course details.");
    }
});

// Update Course - Handle POST request to update an existing course
app.post("/course/update", async (req, res) => {
    try {
        await collegeData.updateCourse(req.body);  // Call the updateCourse function
        res.redirect("/courses");  // Redirect to /courses after updating the course
    } catch (err) {
        console.error("Error updating course:", err);
        res.status(500).send("Unable to update course: " + err);
    }
});

// Delete Course - Handle GET request to delete a course
app.get("/course/delete/:id", async (req, res) => {
    const courseId = req.params.id;
    try {
        await collegeData.deleteCourseById(courseId);  // Call the deleteCourseById function
        res.redirect("/courses");  // Redirect to /courses after deletion
    } catch (err) {
        console.error("Error deleting course:", err);
        res.status(500).send("Unable to remove course. Course not found.");
    }
});

// Fetch Student by Student Number and Render Update Form
app.get("/student/:num", async (req, res) => {
    const studentNum = req.params.num;
    try {
        const student = await collegeData.getStudentByNum(studentNum);
        const courses = await collegeData.getCourses();
        res.render("student", { student, courses });
    } catch (error) {
        console.error("Error fetching student:", error);
        res.render("student", { student: null });
    }
});

// Handle Student Update
app.post("/student/update", async (req, res) => {
    try {
        await collegeData.updateStudent(req.body);
        res.redirect("/students");
    } catch (err) {
        console.error("Error updating student:", err);
        res.status(500).send("There was an error updating the student.");
    }
});

// Handle 404 - No Matching Route
app.use((req, res) => {
    res.status(404).render("404");
});

// Start Server After Initializing Data
collegeData.initialize()
    .then(() => {
        app.listen(HTTP_PORT, () => console.log(`Server listening on port ${HTTP_PORT}`));
    })
    .catch(err => {
        console.error("Initialization error:", err);
    });
