//? THIS WOULD LAUNCH BY DEFAULT
//? AND ALWAYS RENDER ALL DATA FROM THE BACKEND BY DEFAULT

const table = document.getElementById('table-body');
const loading_screen = document.getElementById('loading_screen');


const populate = async () => {
  try {
    const response = await axios.get('http://localhost:8097/api/v1/faculties');
    const data = response.data;

    data.forEach((faculty, index) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${index + 1}</td>
        <td>${faculty.Name}</td>
        <td>${faculty.UniqueId}</td>
        <td>${faculty.Code}</td>
        <td>${faculty.Status == 1 ? '<div class="text-success">Active</div>' : '<div class="text-danger">Inactive<div>'}</td>
        <td>
        <a href="../../html/faculty/editfaculty.html?id=${faculty.FacultyId}" class="btn btn-primary">Edit</a>
        <button class="btn btn-danger"  onclick="deletefaculty(${faculty.FacultyId})">Delete</button>
        <a href="../../html/faculty/detailfaculty.html?id=${faculty.FacultyId}" class="btn btn-success">Details</a>
        </td>
        `;
      table.appendChild(row);
    });
    loading_screen.classList.add('d-none');
  } catch (error) {
    loading_screen.classList.add('d-none');
    console.log(error);
  }

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

  const formData = new FormData(searchModalForm);
  const searchFormData = Object.fromEntries(formData.entries());
  if (searchFormData.Status) {
    searchFormData.Status = 1;
  } else {
    searchFormData.Status = 0;
  }

  //? WE HAVE OUR DATA TO SEARCH FOR NOW WE SEARCH IN OUR DATABASE
  const fetchFilter = await axios.post('http://localhost:8097/api/v1/faculties/', searchFormData);
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
        <a href="../../html/faculty/editfaculty.html?id=${faculty.FacultyId}" class="btn btn-primary">Edit</a>
        <button class="btn btn-danger"  onclick="deletefaculty(${faculty.FacultyId})">Delete</button>
        <a href="../../html/faculty/detailfaculty.html?id=${faculty.FacultyId}" class="btn btn-success">Details</a>
      </td>
    `;
    table.appendChild(row);
    loading_screen.classList.add('d-none');
  });
}






//? DELETE FUNCTIONALITY TO REMOVE A FACULTY FROM THE DATABASE
function deletefaculty(id) {
  loading_screen.classList.remove('d-none');
  axios.delete('http://localhost:8097/api/v1/faculties/' + id).then((res) => {
    window.location.reload()
    loading_screen.classList.add('d-none');
  }).catch((err) => {
    console.log(err);
  })
}



//? ADD A FACULTY TO THE DATABASE ON CLICK
const addFacultyForm = document.getElementById('addFacultyForm');


addFacultyForm.addEventListener('submit', (e) => {
  e.preventDefault();
  loading_screen.classList.remove('d-none');
  const formData = new FormData(addFacultyForm);
  const data = Object.fromEntries(formData.entries());
  // validate checkbox
  if (data.Status) {
    data.Status = 1;
  } else {
    data.Status = 0;
  }

  const validate = new Validate();
  validate.length(data.Name, 3, 50, 'Name');
  validate.length(data.UniqueId, 3, 10, 'UniqueId');
  validate.length(data.Code, 3, 10, 'Code');

  if (validate.errors.length > 0) {
    alert(validate.errors[0]);
    return;
  } else {
    // Make post request
    axios.post('http://localhost:8097/api/v1/faculties/add', data).then((result) => {
      loading_screen.classList.add('d-none');  
    window.location.reload()
    }).catch((err) => {
      console.log(err);
    });
  }

})
