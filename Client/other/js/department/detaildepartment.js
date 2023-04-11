// GET ALL OUR INPUTS READY AHEAD OF TIME 
const departmentIdInput = document.querySelector('#departmentIdInput');
const loading_screen = document.getElementById('loading_screen');


const nameInput = document.querySelector('#nameInput');
const facultyIdInput = document.querySelector('#facultyIdInput');
const uniqueIdInput = document.querySelector('#uniqueIdInput');
const codeInput = document.querySelector('#codeInput');
const statusInput = document.querySelector('#statusInput');

const editingForm = document.querySelector('#editingForm');

// GET PARAMETERS OR ID FROM THE CURRENT DEPARTMENT TO EDITING FORM
// Suppose the URL is http://example.com?param=value1&param2=value2

const params = new URLSearchParams(window.location.search);
// Get the value of the 'id' parameter
const paramValue = params.get('id');
departmentIdInput.value = paramValue;


// Get information from the id parameter
const getDepartmentById = async () => {
    const dataObj = await axios.get(`http://localhost:8097/api/v1/departments/${departmentIdInput.value}`)
    const data = await dataObj.data
    loading_screen.classList.add('d-none');
    nameInput.value  = data.Name;
    facultyIdInput.value = data.FacultyId;
    uniqueIdInput.value  = data.UniqueId;
    codeInput.value  = data.Code;
    statusInput.value  = data.Status;
}



document.addEventListener('DOMContentLoaded', getDepartmentById);