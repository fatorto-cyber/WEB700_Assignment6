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
        res.render("course", { course });
    } catch (error) {
        console.error("Error fetching course:", error);
        res.status(404).send("Course not found");
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
