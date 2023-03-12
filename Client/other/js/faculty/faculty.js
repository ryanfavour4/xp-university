const addFacultyForm = document.getElementById('addFacultyForm');


const populate = async () => {
  try {
    const table = document.getElementById('table-body');
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
  } catch (error) {
    console.log(error);
  }

}


document.addEventListener('DOMContentLoaded', populate);

function deletefaculty(id){
  axios.delete('http://localhost:8097/api/v1/faculties/'+id).then((res) => {
    window.location.reload()
  }).catch((err) => {
    console.log(err);
  })
}


addFacultyForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const formData = new FormData(addFacultyForm);
  const data = Object.fromEntries(formData.entries());
  // validate checkbox
  if (data.Status) {
    data.Status = 1;
  } else {
    data.Status = 0;
  }
  console.log(data);

  const validate = new Validate();
  validate.length(data.Name, 3, 50, 'Name');
  validate.length(data.UniqueId, 3, 10, 'UniqueId');
  validate.length(data.Code, 3, 10, 'Code');

  if (validate.errors.length > 0) {
    alert(validate.errors[0]);
    return;
  } else {
    console.log(data);
    // Make post request
    axios.post('http://localhost:8097/api/v1/faculties/add',data).then((result) => {
      console.log(result);
      window.location.reload()
    }).catch((err) => {
      console.log(err);
    });
  }

})



// 