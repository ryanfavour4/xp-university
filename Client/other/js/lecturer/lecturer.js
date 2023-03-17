//? THIS WOULD LAUNCH BY DEFAULT
//? AND ALWAYS RENDER ALL DATA FROM THE BACKEND BY DEFAULT

const table = document.getElementById('table-body');
const departmentIdDropDown = document.getElementById('departmentId');
const loading_screen = document.getElementById('loading_screen');


const populate = async () => {
    try {
        const response = await axios.get('http://localhost:8097/api/v1/lecturers');
        const data = response.data;
        data.forEach((lecturer, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
        <td>${index + 1}</td>
        <td>${lecturer.FirstName}</td>
        <td>${lecturer.Surname}</td>
        <td>${lecturer.OtherNames.trim() == '' ? 'No Name' : lecturer.OtherNames}</td>
        <td>${lecturer.StaffId}</td>
        <td>${lecturer.Status == 1 ? '<div class="text-success">Active</div>' : '<div class="text-danger">Inactive<div>'}</td>
        <td>
        <a href="../../html/lecturer/editlecturer.html?id=${lecturer.LecturerId}" class="btn btn-primary">Edit</a>
        <button class="btn btn-danger"  onclick="deleteLecturer(${lecturer.LecturerId})">Delete</button>
        <a href="../../html/lecturer/detaillecturer.html?id=${lecturer.LecturerId}" class="btn btn-success">Details</a>
        </td>
        `;
            table.appendChild(row);
        });
        loading_screen.classList.add('d-none');
    } catch (error) {
        loading_screen.classList.add('d-none');
        console.log(error);
    }


    // //? GET DEPARTMENT ID DIRECTLY FROM SO USER DOESNT INPUT A NON EXISTING FACULTY 
    const fetchDepartmentId = await axios.get('http://localhost:8097/api/v1/departments');
    const fetchDepartmentData = fetchDepartmentId.data;
    const returnedData = fetchDepartmentData.map((eachDepartment, index) => {
        return `<option value=${eachDepartment.DepartmentId}>${eachDepartment.Name}</option>`
    })

    departmentIdDropDown.innerHTML += returnedData.join('');
}

//? REDNDER THE POPULATE FUNCTION AFTER DOM IS READY
document.addEventListener('DOMContentLoaded', populate);





//? SEARCH FUNCTIONALITY TO GET DATA FROM THE DATABASE
//? BASED ON THE QUERIES THE USERS HAS INPUTED

const searchModalForm = document.querySelector('#searchModalForm');
const searchModal = document.getElementById("searchModal");
const searchModalEvent = new MouseEvent('click', {
    view: window,
    bubbles: true,
    cancelable: true
});


searchModalForm.addEventListener('submit', searchFacultyForm)

async function searchFacultyForm(e) {
    e.preventDefault()
    loading_screen.classList.remove('d-none');
    table.innerHTML = null

    const searchDepartmentid = document.getElementById('searchDepartmentid');
    const searchFirstName = document.getElementById('searchFirstName');
    const filterstatus = document.getElementById('filterstatus');

    const formData = {
        FacultyId: Number(searchDepartmentid.value),
        FirstName: searchFirstName.value,
        Status: filterstatus.value = filterstatus.checked == true ? 1 : 0
    }

    //? WE HAVE OUR DATA TO SEARCH FOR NOW WE SEARCH IN OUR DATABASE
    const fetchFilter = await axios.post('http://localhost:8097/api/v1/lecturers/', formData);
    const resultFilter = await fetchFilter
    const filteredData = resultFilter.data
    searchModal.dispatchEvent(searchModalEvent)

    if (filteredData.length < 1) {
        loading_screen.classList.add('d-none');
        setTimeout(() => {
            alert('No Such Data Exist Please Change your filter')
        }, 1000);
    }

    filteredData.forEach((lecturer, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
      <td>${index + 1}</td>
      <td>${lecturer.FirstName}</td>
      <td>${lecturer.Surname}</td>
      <td>${lecturer.OtherNames.trim() == '' ? 'No Name' : lecturer.OtherNames}</td>
      <td>${lecturer.StaffId}</td>
      <td>${lecturer.Status == 1 ? '<div class="text-success">Active</div>' : '<div class="text-danger">Inactive<div>'}</td>
      <td>
        <a href="../../html/department/editdepartment.html?id=${lecturer.LecturerId}" class="btn btn-primary">Edit</a>
        <button class="btn btn-danger"  onclick="deleteLecturer(${lecturer.LecturerId})">Delete</button>
        <a href="../../html/lecturer/detaillecturer.html?id=${lecturer.LecturerId}" class="btn btn-success">Details</a>
      </td>
    `;
        table.appendChild(row);
        loading_screen.classList.add('d-none');
    });
}






//? DELETE FUNCTIONALITY TO REMOVE A FACULTY FROM THE DATABASE
function deleteLecturer(id) {
    loading_screen.classList.remove('d-none');
    axios.delete('http://localhost:8097/api/v1/lecturers/' + id).then((res) => {
        window.location.reload()
        loading_screen.classList.add('d-none');
    }).catch((err) => {
        console.log(err);
    })
}



//? ADD A FACULTY TO THE DATABASE ON CLICK
const addLecturerForm = document.getElementById('addLecturerForm');



addLecturerForm.addEventListener('submit', (e) => {
    e.preventDefault();

    loading_screen.classList.remove('d-none');

    const FirstName = document.getElementById('FirstName');
    const Surname = document.getElementById('Surname');
    const OtherNames = document.getElementById('OtherNames');
    const StaffId = document.getElementById('StaffId');
    const departmentId = document.getElementById('departmentId');
    const addstatus = document.getElementById('addstatus');

    const formData = {
        FirstName: FirstName.value,
        Surname: Surname.value,
        OtherNames: OtherNames.value,
        StaffId: Number(StaffId.value),
        DepartmentId: Number(departmentId.value),
        Status: addstatus.value = addstatus.checked == true ? 1 : 0
    }

    const validate = new Validate();
    validate.length(formData.FirstName, 3, 50, 'First Name');
    validate.length(formData.Surname, 3, 50, 'Surname');

    if (validate.errors.length > 0) {
        alert(validate.errors[0]);
        return;
    } else {
        // Make post request
        axios.post('http://localhost:8097/api/v1/lecturers/add', formData).then((result) => {
            loading_screen.classList.add('d-none');
            window.location.reload()
        }).catch((err) => {
            console.log(err);
        });
    }

})
