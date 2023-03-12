// GET ALL OUR INPUTS READY AHEAD OF TIME 
const facultyIdInput = document.querySelector('#facultyIdInput');

const nameInput = document.querySelector('#nameInput');
const uniqueIdInput = document.querySelector('#uniqueIdInput');
const codeInput = document.querySelector('#codeInput');
const statusInput = document.querySelector('#statusInput');

const editingForm = document.querySelector('#editingForm');

// GET PARAMETERS OR ID FROM THE CURRENT FACULTY TO EDITING FORM
// Suppose the URL is http://example.com?param=value1&param2=value2

const params = new URLSearchParams(window.location.search);
// Get the value of the 'id' parameter
const paramValue = params.get('id');
facultyIdInput.value = paramValue;


// Get information from the id parameter
const getFacultyById = async () => {
    const dataObj = await axios.get(`http://localhost:8097/api/v1/faculties/${facultyIdInput.value}`)
    const data = await dataObj.data
    console.log(data.UniqueId);
    nameInput.value  = data.Name;
    uniqueIdInput.value  = data.UniqueId;;
    codeInput.value  = data.Code;
    statusInput.value  = data.Status;
} 



document.addEventListener('DOMContentLoaded', getFacultyById);



// SUBMIT FORM TO EDIT THE DB
editingForm.addEventListener('submit', (e) => {
    e.preventDefault();
    // GET INPUT TO EDIT
    const nameInput = document.querySelector('#nameInput');
    const uniqueIdInput = document.querySelector('#uniqueIdInput');
    const codeInput = document.querySelector('#codeInput');
    const statusInput = document.querySelector('#statusInput');

    // INITIALIZE OUR VALIDATOR FUNCTION
    const validate = new Validate();

    // OBEJCT TO SEND TO DB
    const submitForm = {
        "FacultyId": Number(facultyIdInput.value),
        "Name": nameInput.value,
        "UniqueId": uniqueIdInput.value,
        "Code": codeInput.value,
        "Status": Number(statusInput.value)
    }

    validate.length(submitForm.Name, 3, 50, 'Name');
    validate.length(submitForm.UniqueId, 3, 10, 'UniqueId');
    validate.length(submitForm.Code, 3, 10, 'Code');

    // CHECK FOR ERROR BEFORE PUTING
    if (validate._errors.length > 0) {
        alert(validate._errors[0])
    }else{
    // Make put request
    axios.put('http://localhost:8097/api/v1/faculties', submitForm).then((result) => {
        console.log(result);
        window.location.href = 'http://localhost:5500/other/html/faculty/faculty.html'
      }).catch((err) => {
        console.log(err);
      });
    }

}); 