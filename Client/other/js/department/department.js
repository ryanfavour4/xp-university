//? THIS WOULD LAUNCH BY DEFAULT
//? AND ALWAYS RENDER ALL DATA FROM THE BACKEND BY DEFAULT

const table = document.getElementById('table-body');
const facultyIdDropDown = document.getElementById('FacultyIdDropDown');
const loading_screen = document.getElementById('loading_screen');


const populate = async () => {
    try {
        const response = await axios.get('http://localhost:8097/api/v1/departments');
        const data = response.data;

        data.forEach((department, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
        <td>${index + 1}</td>
        <td>${department.Name}</td>
        <td>${department.UniqueId}</td>
        <td>${department.Code}</td>
        <td>${department.Status == 1 ? '<div class="text-success">Active</div>' : '<div class="text-danger">Inactive<div>'}</td>
        <td>
        <a href="../../html/department/editdepartment.html?id=${department.DepartmentId}" class="btn btn-primary">Edit</a>
        <button class="btn btn-danger"  onclick="deleteDepartment(${department.DepartmentId})">Delete</button>
        <a href="../../html/department/detaildepartment.html?id=${department.DepartmentId}" class="btn btn-success">Details</a>
        </td>
        `;
            table.appendChild(row);
        });
        loading_screen.classList.add('d-none');
    } catch (error) {
        loading_screen.classList.add('d-none');
        console.log(error);
    }


    //? GET FACULTY IDS DIRECTLY FROM SO USER DOESNT INPUT A NON EXISTING FACULTY 
    const fetchFacultyId = await axios.get('http://localhost:8097/api/v1/faculties');
    const fetchFacultyIdData = fetchFacultyId.data;
    const returnedData = fetchFacultyIdData.map((eachFaculty, index) => {
        return `<option value=${eachFaculty.FacultyId}>${eachFaculty.Name}</option>`
    })

    facultyIdDropDown.innerHTML += returnedData.join('');
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

    const searchDepartmentName = document.getElementById('searchDepartmentName');
    const searchFacultyid = document.getElementById('searchFacultyid');
    const status = document.getElementById('filterstatus');

    const formData = {
        FacultyId: Number(searchFacultyid.value),
        Name: searchDepartmentName.value,
        Status: status.value = status.checked == true ? 1 : 0
    }

    //? WE HAVE OUR DATA TO SEARCH FOR NOW WE SEARCH IN OUR DATABASE
    const fetchFilter = await axios.post('http://localhost:8097/api/v1/departments/', formData);
    const resultFilter = await fetchFilter
    const filteredData = resultFilter.data
    searchModal.dispatchEvent(searchModalEvent)

    if (filteredData.length < 1) {
        loading_screen.classList.add('d-none');
        setTimeout(() => {
            alert('No Such Data Exist Please Change your filter')
        }, 1000);
    }

    filteredData.forEach((faculty, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
      <td>${index + 1}</td>
      <td>${faculty.Name}</td>
      <td>${faculty.UniqueId}</td>
      <td>${faculty.Code}</td>
      <td>${faculty.Status == 1 ? '<div class="text-success">Active</div>' : '<div class="text-danger">Inactive<div>'}</td>
      <td>
        <a href="../../html/department/editdepartment.html?id=${faculty.FacultyId}" class="btn btn-primary">Edit</a>
        <button class="btn btn-danger"  onclick="deleteDepartment(${faculty.FacultyId})">Delete</button>
        <a href="../../html/department/detaildepartment.html?id=${faculty.FacultyId}" class="btn btn-success">Details</a>
      </td>
    `;
        table.appendChild(row);
        loading_screen.classList.add('d-none');
    });
}






//? DELETE FUNCTIONALITY TO REMOVE A FACULTY FROM THE DATABASE
function deleteDepartment(id) {
    loading_screen.classList.remove('d-none');
    axios.delete('http://localhost:8097/api/v1/departments/' + id).then((res) => {
        window.location.reload()
        loading_screen.classList.add('d-none');
    }).catch((err) => {
        console.log(err);
    })
}



//? ADD A FACULTY TO THE DATABASE ON CLICK
const addDepartmentForm = document.getElementById('addDepartmentForm');



addDepartmentForm.addEventListener('submit', (e) => {
    e.preventDefault();

    loading_screen.classList.remove('d-none');

    const facultyIdDropDown = document.getElementById('FacultyIdDropDown');
    const departmentName = document.getElementById('departmentName');
    const code = document.getElementById('code');
    const uniqueId = document.getElementById('uniqueId');
    const status = document.getElementById('addstatus');

    const formData = {
        FacultyId: Number(facultyIdDropDown.value),
        Name: departmentName.value,
        UniqueId: uniqueId.value,
        Code: code.value,
        Status: status.value = status.checked == true ? 1 : 0
    }

    const validate = new Validate();
    validate.length(formData.Name, 3, 50, 'Name');
    validate.length(formData.UniqueId, 3, 10, 'UniqueId');
    validate.length(formData.Code, 3, 10, 'Code');

    if (validate.errors.length > 0) {
        alert(validate.errors[0]);
        return;
    } else {
        // Make post request
        axios.post('http://localhost:8097/api/v1/departments/add', formData).then((result) => {
            loading_screen.classList.add('d-none');
            window.location.reload()
        }).catch((err) => {
            console.log(err);
        });
    }

})
