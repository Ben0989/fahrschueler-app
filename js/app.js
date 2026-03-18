console.log("APP START")

let students = JSON.parse(localStorage.getItem("students") || "[]")

if(!Array.isArray(students)){
  students = []
}

let currentStudentIndex = null

document.addEventListener("DOMContentLoaded", () => {

  const addBtn = document.getElementById("addStudentBtn")
  const modal = document.getElementById("studentModal")
  const closeBtn = document.getElementById("closeBtn")
  const saveBtn = document.getElementById("saveBtn")
  const studentList = document.getElementById("studentList")

  const studentPanel = document.getElementById("studentPanel")
  const panelName = document.getElementById("panelName")
  const panelVorname = document.getElementById("panelVorname")
  const closePanelBtn = document.getElementById("closePanelBtn")

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

    students.forEach((s, i) => {

      let div = document.createElement("div")

      div.innerHTML = `<b>${s.name}</b> ${s.vorname}`

      div.onclick = () => openStudent(i)

      studentList.appendChild(div)
    })
  }

  // =========================
  // STUDENT ÖFFNEN
  // =========================
  function openStudent(index){

    currentStudentIndex = index

    let s = students[index]

    panelName.textContent = s.name
    panelVorname.textContent = s.vorname

    studentPanel.style.display = "block"
  }

  // =========================
  // PANEL SCHLIESSEN
  // =========================
  closePanelBtn.onclick = () => {
    studentPanel.style.display = "none"
  }

  renderList()

})
