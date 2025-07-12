let currentPage = 1;
const itemsPerPage = 5; // or 10, adjust as needed



function renderPagination(totalItems) {
  const pagination = document.getElementById("pagination");
  pagination.innerHTML = "";

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  if (totalPages <= 1) return;

  if (currentPage > 1) {
    const prevBtn = document.createElement("button");
    prevBtn.classList.add("pagination-btn")
    prevBtn.textContent = "Prev";
    prevBtn.onclick = () => {
      currentPage--;
      renderEmployees(mockEmployees);
    };
    pagination.appendChild(prevBtn);
  }

  for (let i = 1; i <= totalPages; i++) {
    const pageBtn = document.createElement("button");
    pageBtn.classList.add("pagination-btn")
    pageBtn.textContent = i;
    if (i === currentPage) {
      pageBtn.style.backgroundColor = "green";
      pageBtn.disabled = true;
    }
    pageBtn.onclick = () => {
      currentPage = i;
      renderEmployees(mockEmployees);
    };
    pagination.appendChild(pageBtn);
  }

  if (currentPage < totalPages) {
    const nextBtn = document.createElement("button");
    nextBtn.classList.add("pagination-btn")
    nextBtn.textContent = "Next";
    nextBtn.onclick = () => {
      currentPage++;
      renderEmployees(mockEmployees);
    };
    pagination.appendChild(nextBtn);
  }
}


function renderEmployees(list) {
  const container = document.getElementById("employee-list");
  container.innerHTML = "";

  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const paginatedItems = list.slice(start, end);

  paginatedItems.forEach(emp => {
    const card = document.createElement("div");
    card.className = "employee-card";
    card.innerHTML = `
      <h3>${emp.firstName} ${emp.lastName}</h3>
      <p>ID: ${emp.id}</p>
      <p>Email: ${emp.email}</p>
      <p>Department: ${emp.department}</p>
      <p>Role: ${emp.role}</p>
      <button onclick="editEmployee(${emp.id})">Edit</button>
      <button onclick="deleteEmployee(${emp.id})">Delete</button>
    `;
    container.appendChild(card);
  });

  renderPagination(list.length);
}


const searchInput = document.getElementById("searchInput");
if (searchInput) {
  searchInput.addEventListener("input", () => {
    const q = searchInput.value.toLowerCase();
    const filtered = mockEmployees.filter(e =>
      `${e.firstName} ${e.lastName} ${e.email}`.toLowerCase().includes(q)
    );
    renderEmployees(filtered);
  });
}

// INIT DASHBOARD
if (document.getElementById("employee-list")) {
  renderEmployees(mockEmployees);
}

// DELETE
function deleteEmployee(id) {
  if (confirm("Delete?")) {
    mockEmployees = mockEmployees.filter(emp => emp.id !== id);
    localStorage.setItem("employees", JSON.stringify(mockEmployees));
    renderEmployees(mockEmployees);
  }
}

// EDIT
function editEmployee(id) {
  window.location.href = `form.html?id=${id}`;
}

// ADD BTN
const addBtn = document.getElementById("addEmployeeBtn");
if (addBtn) {
  addBtn.onclick = () => window.location.href = "form.html";
}

// FORM PAGE
const form = document.getElementById("employeeForm");
if (form) {
  const params = new URLSearchParams(window.location.search);
  const editId = params.get("id");
  if (editId) {
    const emp = mockEmployees.find(e => e.id == editId);
    if (emp) {
      document.getElementById("employeeId").value = emp.id;
      document.getElementById("firstName").value = emp.firstName;
      document.getElementById("lastName").value = emp.lastName;
      document.getElementById("email").value = emp.email;
      document.getElementById("department").value = emp.department;
      document.getElementById("role").value = emp.role;
    }
  }

  form.onsubmit = e => {
    e.preventDefault();
    const newEmp = {
      id: document.getElementById("employeeId").value ? parseInt(document.getElementById("employeeId").value) : generateId(),
      firstName: document.getElementById("firstName").value.trim(),
      lastName: document.getElementById("lastName").value.trim(),
      email: document.getElementById("email").value.trim(),
      department: document.getElementById("department").value.trim(),
      role: document.getElementById("role").value.trim(),
    };

    if (!validateEmail(newEmp.email)) {
      alert("Invalid email");
      return;
    }

    const idx = mockEmployees.findIndex(e => e.id === newEmp.id);
    if (idx > -1) {
      mockEmployees[idx] = newEmp;
    } else {
      mockEmployees.push(newEmp);
    }

    localStorage.setItem("employees", JSON.stringify(mockEmployees));
    window.location.href = "index.html";
  };

  document.getElementById("cancelBtn").onclick = () => {
    window.location.href = "index.html";
  };
}
