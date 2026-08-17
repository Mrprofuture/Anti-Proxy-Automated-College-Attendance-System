/* =========================================
   COLLEGE ATTENDANCE SYSTEM
   FRONTEND MVP
========================================= */


/* ---------- GLOBAL DATA ---------- */

let currentUser = null;
let cameraStream = null;
let attendanceRunning = false;

let students = [
    {
        id: "20260001",
        name: "Rahul Sharma",
        branch: "Mechanical",
        semester: "3",
        section: "A",
        face: true
    },
    {
        id: "20260002",
        name: "Aman Verma",
        branch: "Mechanical",
        semester: "3",
        section: "A",
        face: true
    },
    {
        id: "20260003",
        name: "Ravi Kumar",
        branch: "Mechanical",
        semester: "3",
        section: "A",
        face: true
    },
    {
        id: "20260004",
        name: "Ayush Singh",
        branch: "Mechanical",
        semester: "3",
        section: "A",
        face: true
    }
];


let attendanceRecords = [];


/* ---------- PAGE LOAD ---------- */

document.addEventListener("DOMContentLoaded", () => {

    updateDate();

    document
        .getElementById("loginForm")
        .addEventListener("submit", login);

    document
        .getElementById("studentForm")
        .addEventListener("submit", addStudent);

    renderStudents();
    renderAttendance();

});


/* ---------- DATE ---------- */

function updateDate() {

    const date = new Date();

    document.getElementById("currentDate").textContent =
        date.toLocaleDateString("en-IN", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric"
        });

}


/* ---------- LOGIN ---------- */

function login(event) {

    event.preventDefault();

    const user =
        document.getElementById("loginUser").value.trim();

    const password =
        document.getElementById("loginPassword").value;

    const role =
        document.getElementById("loginRole").value;


    if (!user || !password) {

        showToast("Please enter login details.");

        return;

    }


    currentUser = {
        id: user,
        name: user,
        role: role
    };


    document
        .getElementById("loginPage")
        .classList.add("hidden");

    document
        .getElementById("app")
        .classList.remove("hidden");


    document.getElementById("userName").textContent = user;

    document.getElementById("userRole").textContent =
        role.toUpperCase();


    if (role === "student") {

        document
            .getElementById("teacherMenu")
            .classList.add("hidden");

        document
            .getElementById("studentMenu")
            .classList.remove("hidden");

        showPage("studentDashboardPage");

    } else {

        document
            .getElementById("teacherMenu")
            .classList.remove("hidden");

        document
            .getElementById("studentMenu")
            .classList.add("hidden");

        showPage("dashboardPage");

    }


    showToast("Login successful.");

}


/* ---------- LOGOUT ---------- */

function logout() {

    stopCamera();

    currentUser = null;

    attendanceRunning = false;

    document
        .getElementById("app")
        .classList.add("hidden");

    document
        .getElementById("loginPage")
        .classList.remove("hidden");

    document
        .getElementById("loginForm")
        .reset();

}


/* ---------- PAGE NAVIGATION ---------- */

function showPage(pageId) {

    document
        .querySelectorAll(".page")
        .forEach(page => {
            page.classList.add("hidden");
        });


    const page = document.getElementById(pageId);

    if (page) {
        page.classList.remove("hidden");
    }


    const titles = {

        dashboardPage: "Dashboard",

        studentsPage: "Students",

        attendancePage: "Attendance",

        reportsPage: "Reports",

        auditPage: "Audit Logs",

        studentDashboardPage: "My Dashboard",

        studentAttendancePage: "My Attendance"

    };


    document.getElementById("pageTitle").textContent =
        titles[pageId] || "Dashboard";


    document
        .querySelectorAll(".nav-btn")
        .forEach(btn => btn.classList.remove("active"));

}


/* ---------- STUDENTS ---------- */

function renderStudents(list = students) {

    const table =
        document.getElementById("studentTable");

    table.innerHTML = "";


    list.forEach(student => {

        const row = document.createElement("tr");

        row.innerHTML = `

            <td>${student.id}</td>

            <td>${student.name}</td>

            <td>${student.branch}</td>

            <td>${student.semester}</td>

            <td>${student.section}</td>

            <td>
                <span class="status present">
                    ✓ Registered
                </span>
            </td>

        `;

        table.appendChild(row);

    });


    document.getElementById("totalStudents").textContent =
        students.length;

}


/* ---------- SEARCH STUDENTS ---------- */

function searchStudents() {

    const search =
        document
            .getElementById("studentSearch")
            .value
            .toLowerCase();


    const filtered = students.filter(student =>

        student.id.toLowerCase().includes(search) ||

        student.name.toLowerCase().includes(search) ||

        student.branch.toLowerCase().includes(search)

    );


    renderStudents(filtered);

}


/* ---------- STUDENT MODAL ---------- */

function openStudentModal() {

    document
        .getElementById("studentModal")
        .classList.remove("hidden");

}


function closeStudentModal() {

    document
        .getElementById("studentModal")
        .classList.add("hidden");

}


/* ---------- ADD STUDENT ---------- */

function addStudent(event) {

    event.preventDefault();


    const student = {

        id:
            document.getElementById("newStudentId").value,

        name:
            document.getElementById("newStudentName").value,

        branch:
            document.getElementById("newStudentBranch").value,

        semester:
            document.getElementById("newStudentSemester").value,

        section:
            document.getElementById("newStudentSection").value,

        face: false

    };


    students.push(student);

    renderStudents();

    closeStudentModal();

    event.target.reset();

    showToast("Student added successfully.");

}


/* ---------- START ATTENDANCE ---------- */

async function startAttendance() {

    if (attendanceRunning) {
        return;
    }


    attendanceRunning = true;


    document
        .getElementById("startSessionBtn")
        .classList.add("hidden");


    document
        .getElementById("stopSessionBtn")
        .classList.remove("hidden");


    document
        .getElementById("verifyBtn")
        .classList.remove("hidden");


    document.getElementById("sessionStatus").textContent =
        "Attendance session ACTIVE";


    document.getElementById("cameraMessage").textContent =
        "Camera active. Position face inside frame.";


    try {

        await startCamera();

        showToast("Attendance session started.");

    } catch (error) {

        console.error(error);

        showToast(
            "Camera access denied or unavailable."
        );

    }

}


/* ---------- CAMERA ---------- */

async function startCamera() {

    const video =
        document.getElementById("camera");


    cameraStream =
        await navigator.mediaDevices.getUserMedia({

            video: {
                width: 1280,
                height: 720,
                facingMode: "user"
            },

            audio: false

        });


    video.srcObject = cameraStream;

}


/* ---------- STOP ATTENDANCE ---------- */

function stopAttendance() {

    attendanceRunning = false;

    stopCamera();


    document
        .getElementById("startSessionBtn")
        .classList.remove("hidden");


    document
        .getElementById("stopSessionBtn")
        .classList.add("hidden");


    document
        .getElementById("verifyBtn")
        .classList.add("hidden");


    document.getElementById("sessionStatus").textContent =
        "Session stopped";


    document.getElementById("cameraMessage").textContent =
        "Start attendance to activate camera.";


    resetVerification();


    showToast("Attendance session stopped.");

}


/* ---------- STOP CAMERA ---------- */

function stopCamera() {

    if (cameraStream) {

        cameraStream
            .getTracks()
            .forEach(track => track.stop());

        cameraStream = null;

    }


    document.getElementById("camera").srcObject = null;

}


/* ---------- SIMULATED VERIFICATION ---------- */

/*
    IMPORTANT:

    This function is ONLY a frontend demonstration.

    In the real system:

    Browser Camera
        ↓
    Backend API
        ↓
    Liveness AI
        ↓
    Face Recognition
        ↓
    Student ID
        ↓
    Class Validation
        ↓
    Duplicate Check
        ↓
    Database
*/

function simulateVerification() {

    if (!attendanceRunning) {

        showToast("Start attendance first.");

        return;

    }


    const randomStudent =
        students[
            Math.floor(Math.random() * students.length)
        ];


    setVerification(
        "liveStatus",
        true,
        "✓ Liveness Detection"
    );


    setTimeout(() => {

        setVerification(
            "faceStatus",
            true,
            "✓ Face Recognition"
        );

    }, 700);


    setTimeout(() => {

        setVerification(
            "classStatus",
            true,
            "✓ Class Validation"
        );

    }, 1400);


    setTimeout(() => {

        setVerification(
            "duplicateStatus",
            true,
            "✓ Duplicate Check"
        );


        markAttendance(randomStudent);

    }, 2100);

}


/* ---------- VERIFICATION UI ---------- */

function setVerification(id, success, text) {

    const element =
        document.getElementById(id);


    element.classList.remove(
        "success",
        "failed"
    );


    if (success) {

        element.classList.add("success");

    } else {

        element.classList.add("failed");

    }


    element.innerHTML =
        `<span>${success ? "✓" : "✕"}</span> ${text}`;

}


/* ---------- RESET VERIFICATION ---------- */

function resetVerification() {

    const items = [

        ["liveStatus", "○ Liveness Detection"],

        ["faceStatus", "○ Face Recognition"],

        ["classStatus", "○ Class Validation"],

        ["duplicateStatus", "○ Duplicate Check"]

    ];


    items.forEach(item => {

        const element =
            document.getElementById(item[0]);

        element.classList.remove(
            "success",
            "failed"
        );

        element.innerHTML =
            `<span>${item[1].split(" ")[0]}</span> ${item[1].substring(item[1].indexOf(" ") + 1)}`;

    });

}


/* ---------- MARK ATTENDANCE ---------- */

function markAttendance(student) {

    const alreadyMarked =
        attendanceRecords.some(record =>

            record.studentId === student.id

        );


    if (alreadyMarked) {

        showToast(
            `${student.name} already marked.`
        );

        return;

    }


    const now = new Date();


    const record = {

        studentId: student.id,

        name: student.name,

        subject:
            document.getElementById("subject").value,

        time:
            now.toLocaleTimeString("en-IN"),

        liveness: "PASS",

        faceMatch: "MATCH",

        status: "PRESENT"

    };


    attendanceRecords.push(record);


    renderAttendance();

    updateDashboardStats();


    showToast(
        `✓ ${student.name} marked PRESENT`
    );

}


/* ---------- ATTENDANCE TABLE ---------- */

function renderAttendance() {

    const table =
        document.getElementById("attendanceTable");

    const dashboard =
        document.getElementById("dashboardAttendance");


    table.innerHTML = "";

    dashboard.innerHTML = "";


    attendanceRecords.forEach(record => {

        const row = document.createElement("tr");

        row.innerHTML = `

            <td>${record.studentId}</td>

            <td>${record.name}</td>

            <td>${record.time}</td>

            <td>
                <span class="status present">
                    PASS
                </span>
            </td>

            <td>
                <span class="status present">
                    MATCH
                </span>
            </td>

            <td>
                <span class="status present">
                    PRESENT
                </span>
            </td>

        `;

        table.appendChild(row);


        const dashboardRow =
            document.createElement("tr");


        dashboardRow.innerHTML = `

            <td>${record.studentId}</td>

            <td>${record.name}</td>

            <td>${record.subject.split(" - ")[0]}</td>

            <td>${record.time}</td>

            <td>
                <span class="status present">
                    Present
                </span>
            </td>

        `;


        dashboard.appendChild(dashboardRow);

    });


    document.getElementById("liveCount").textContent =
        attendanceRecords.length;

}


/* ---------- DASHBOARD STATISTICS ---------- */

function updateDashboardStats() {

    const present =
        attendanceRecords.length;


    const total =
        students.length;


    const absent =
        Math.max(total - present, 0);


    const percentage =
        total === 0
            ? 0
            : Math.round((present / total) * 100);


    document.getElementById("presentCount").textContent =
        present;


    document.getElementById("absentCount").textContent =
        absent;


    document.getElementById("attendancePercent").textContent =
        percentage + "%";


    document.getElementById("circlePercent").textContent =
        percentage + "%";


    const circle =
        document.querySelector(".progress-circle");


    circle.style.background =
        `conic-gradient(#3867e8 ${percentage * 3.6}deg, #edf0f5 0deg)`;

}


/* ---------- REPORT ---------- */

function generateReport() {

    showToast(
        "Report generated successfully."
    );

}


/* ---------- EXPORT ---------- */

function downloadReport() {

    const data = [

        ["Student ID", "Name", "Subject", "Time", "Status"],

        ...attendanceRecords.map(record => [

            record.studentId,

            record.name,

            record.subject,

            record.time,

            record.status

        ])

    ];


    const csv =
        data
            .map(row => row.join(","))
            .join("\n");


    const blob =
        new Blob([csv], {
            type: "text/csv"
        });


    const url =
        URL.createObjectURL(blob);


    const link =
        document.createElement("a");


    link.href = url;

    link.download =
        "attendance-report.csv";


    link.click();


    URL.revokeObjectURL(url);


    showToast(
        "Attendance report exported."
    );

}


/* ---------- TOAST ---------- */

function showToast(message) {

    const toast =
        document.getElementById("toast");


    toast.textContent = message;

    toast.classList.add("show");


    setTimeout(() => {

        toast.classList.remove("show");

    }, 3000);

}
