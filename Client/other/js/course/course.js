//? THIS WOULD LAUNCH BY DEFAULT
//? AND ALWAYS RENDER ALL DATA FROM THE BACKEND BY DEFAULT

const table = document.getElementById("table-body");
const departmentIdDropDown = document.getElementById("departmentId");
const loading_screen = document.getElementById("loading_screen");

const populate = async () => {
    try {
        const response = await axios.get("http://localhost:8097/api/v1/courses");
        const data = response.data;
        data.forEach((course, index) => {
            const row = document.createElement("tr");
            row.innerHTML = `
        <td>${index + 1}</td>
        <td>${course.Name}</td>
        <td>${course.UniqueId}</td>
        <td>${course.Units}</td>
        <td>${course.Code}</td>
        <td>${course.CourseLevel}</td>
        <td>${course.CourseSemester}</td>
        <td>${course.Status == 1
                    ? '<div class="text-success">Active</div>'
                    : '<div class="text-danger">Inactive<div>'
                }</td>
        <td>
        <a href="../../html/course/editcourse.html?id=${course.CourseId
                }" class="btn btn-primary">Edit</a>
        <button class="btn btn-danger"  onclick="deletecourse(${course.CourseId
                })">Delete</button>
        <a href="../../html/course/detailcourse.html?id=${course.CourseId
                }" class="btn btn-success">Details</a>
        </td>
        `;
            table.appendChild(row);
        });
        loading_screen.classList.add("d-none");
    } catch (error) {
        loading_screen.classList.add("d-none");
        console.log(error);
    }

    // //? GET DEPARTMENT ID DIRECTLY FROM SO USER DOESNT INPUT A NON EXISTING FACULTY
    const fetchDepartmentId = await axios.get(
        "http://localhost:8097/api/v1/departments"
    );
    const fetchDepartmentData = fetchDepartmentId.data;
    const returnedData = fetchDepartmentData.map((eachDepartment, index) => {
        return `<option value=${eachDepartment.DepartmentId}>${eachDepartment.Name}</option>`;
    });

    departmentIdDropDown.innerHTML += returnedData.join("");
};

//? REDNDER THE POPULATE FUNCTION AFTER DOM IS READY
document.addEventListener("DOMContentLoaded", populate);

//? SEARCH FUNCTIONALITY TO GET DATA FROM THE DATABASE
//? BASED ON THE QUERIES THE USERS HAS INPUTED

const searchModalForm = document.querySelector("#searchModalForm");
const searchModal = document.getElementById("searchModal");
const searchModalEvent = new MouseEvent("click", {
    view: window,
    bubbles: true,
    cancelable: true,
});

searchModalForm.addEventListener("submit", searchCourseForm);

async function searchCourseForm(e) {
    e.preventDefault();
    loading_screen.classList.remove("d-none");
    table.innerHTML = null;

    const searchDepartmentid = document.getElementById("searchDepartmentid");
    const Name = document.getElementById("Name");
    const filterstatus = document.getElementById("filterstatus");

    const formData = {
        DepartmentId: Number(searchDepartmentid.value),
        Name: Name.value,
        Status: (filterstatus.value = filterstatus.checked == true ? 1 : 0),
    };

    //? WE HAVE OUR DATA TO SEARCH FOR NOW WE SEARCH IN OUR DATABASE
    const fetchFilter = await axios.post(
        "http://localhost:8097/api/v1/courses",
        formData
    ).catch(err => {
        if (err.response.data
        ) {
            loading_screen.classList.add("d-none");
            setTimeout(() => {
                alert("No Such Data Exist Please Change your filter");
            }, 1000);
        }
    });
    const resultFilter = await fetchFilter;
    const filteredData = resultFilter.data;
    searchModal.dispatchEvent(searchModalEvent);

    if (filteredData.length < 1) {
        loading_screen.classList.add("d-none");
        setTimeout(() => {
            alert("No Such Data Exist Please Change your filter");
        }, 1000);
    }

    filteredData.forEach((course, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
    <td>${index + 1}</td>
    <td>${course.Name}</td>
    <td>${course.UniqueId}</td>
    <td>${course.Units}</td>
    <td>${course.Code}</td>
    <td>${course.CourseLevel}</td>
    <td>${course.CourseSemester}</td>
    <td>${course.Status == 1
                ? '<div class="text-success">Active</div>'
                : '<div class="text-danger">Inactive<div>'
            }</td>
    <td>
    <a href="../../html/course/editcourse.html?id=${course.CourseId
            }" class="btn btn-primary">Edit</a>
    <button class="btn btn-danger"  onclick="deletecourse(${course.CourseId
            })">Delete</button>
    <a href="../../html/course/detailcourse.html?id=${course.CourseId
            }" class="btn btn-success">Details</a>
    </td>
    `;
        table.appendChild(row);
        loading_screen.classList.add("d-none");
    });
}

//? DELETE FUNCTIONALITY TO REMOVE A FACULTY FROM THE DATABASE
function deletecourse(id) {
    loading_screen.classList.remove("d-none");
    axios
        .delete("http://localhost:8097/api/v1/lecturers/" + id)
        .then((res) => {
            window.location.reload();
            loading_screen.classList.add("d-none");
        })
        .catch((err) => {
            console.log(err);
        });
}

//? ADD A FACULTY TO THE DATABASE ON CLICK
const addCourseForm = document.getElementById("addCourseForm");

addCourseForm.addEventListener("submit", (e) => {
    e.preventDefault();

    loading_screen.classList.remove("d-none");

    const Name = document.getElementById("Name");
    const UniqueId = document.getElementById("UniqueId");
    const Code = document.getElementById("Code");
    const Units = document.getElementById("Units");
    const departmentId = document.getElementById("departmentId");
    const CourseLevel = document.getElementById("CourseLevel");
    const CourseSemester = document.getElementById("CourseSemester");
    const addstatus = document.getElementById("addstatus");

    const formData = {
        Name: Name.value,
        UniqueId: UniqueId.value,
        Code: Code.value,
        Units: Number(Units.value),
        CourseLevel: Number(CourseLevel.value),
        DepartmentId: Number(departmentId.value),
        CourseSemester: CourseSemester.value,
        Status: (addstatus.value = addstatus.checked == true ? 1 : 0),
    };

    const validate = new Validate();
    validate.length(formData.Name, 3, 50, "Name");
    validate.length(formData.Code, 3, 50, "Code");
    validate.length(formData.CourseSemester, 1, 10, "Course Semester");

    if (validate.errors.length > 0) {
        alert(validate.errors[0]);
        return;
    } else {
        // Make post request
        axios
            .post("http://localhost:8097/api/v1/courses/add", formData)
            .then((result) => {
                loading_screen.classList.add("d-none");
                window.location.reload();
            })
            .catch((err) => {
                console.log(err);
            });
    }
});
