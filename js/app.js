console.log("APP START")

let students = JSON.parse(localStorage.getItem("students") || "[]")

// 🔥 Absicherung
if(!Array.isArray(students)){
  students = []
}

document.addEventListener("DOMContentLoaded", () => {

  const addBtn = document.getElementById("addStudentBtn")
  const modal = document.getElementById("studentModal")
  const closeBtn = document.getElementById("closeBtn")
  const saveBtn = document.getElementById("saveBtn")
  const studentList = document.getElementById("studentList")

  const nameInput = document.getElementById("name")
  const vornameInput = document.getElementById("vorname")

  // =========================
  // MODAL
  // =========================
  addBtn.onclick = () => {
    modal.style.display = "flex"
  }

  closeBtn.onclick = () => {
    modal.style.display = "none"
  }

  modal.onclick = (e) => {
    if(e.target === modal){
      modal.style.display = "none"
    }
  }

  // =========================
  // SPEICHERN
  // =========================
  saveBtn.onclick = () => {

    let name = nameInput.value
    let vorname = vornameInput.value

    if(!name || !vorname){
      alert("Name fehlt")
      return
    }

    students.push({
      name,
      vorname
    })

    localStorage.setItem("students", JSON.stringify(students))

    renderList()

    modal.style.display = "none"

    nameInput.value = ""
    vornameInput.value = ""
  }

  // =========================
  // LISTE
  // =========================
  function renderList(){

    studentList.innerHTML = ""

    students.forEach(s => {

      let div = document.createElement("div")

      div.innerHTML = `<b>${s.name}</b> ${s.vorname}`

      studentList.appendChild(div)
    })
  }

  renderList()

})
