// GET ALL OUR INPUTS READY AHEAD OF TIME 
const LecturerId = document.querySelector('#LecturerId');

const departmentIdDropDown = document.getElementById('departmentId');
const loading_screen = document.getElementById('loading_screen');


const FirstName = document.querySelector('#FirstName');
const Surname = document.querySelector('#Surname');
const OtherNames = document.querySelector('#OtherNames');
const departmentId = document.querySelector('#departmentId');
const StaffId = document.querySelector('#StaffId');
const statusInput = document.querySelector('#statusInput');

const editingForm = document.querySelector('#editingForm');

// GET PARAMETERS OR ID FROM THE CURRENT DEPARTMENT TO EDITING FORM
// Suppose the URL is http://example.com?param=value1&param2=value2

const params = new URLSearchParams(window.location.search);
// Get the value of the 'id' parameter
const paramValue = params.get('id');
LecturerId.value = paramValue;


// Get information from the id parameter
const getDepartmentById = async () => {
    const dataObj = await axios.get(`http://localhost:8097/api/v1/courses/${LecturerId.value}`)
    const data = await dataObj.data
    loading_screen.classList.add('d-none');
    FirstName.value = data.FirstName;
    Surname.value = data.Surname;
    OtherNames.value = data.OtherNames;
    StaffId.value = data.StaffId;
    statusInput.value = data.Status;

    // //? GET DEPARTMENT ID DIRECTLY FROM SO USER DOESNT INPUT A NON EXISTING FACULTY 
    const fetchDepartmentId = await axios.get('http://localhost:8097/api/v1/departments');
    const fetchDepartmentData = fetchDepartmentId.data;
    const returnedData = fetchDepartmentData.map((eachDepartment, index) => {
        return `<option value=${eachDepartment.DepartmentId}>${eachDepartment.Name}</option>`
    })

    departmentIdDropDown.innerHTML += returnedData.join('');
    departmentId.value = data.DepartmentId;
}



document.addEventListener('DOMContentLoaded', getDepartmentById);


