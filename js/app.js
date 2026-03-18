console.log("APP START")

let students = JSON.parse(localStorage.getItem("students") || "[]")
let currentStudentIndex = null

document.addEventListener("DOMContentLoaded", () => {

  console.log("DOM READY")

  const addBtn = document.getElementById("addStudentBtn")
  const modal = document.getElementById("studentModal")
  const closeBtn = document.getElementById("closeBtn")
  const saveBtn = document.getElementById("saveBtn")

  const deleteBtn = document.getElementById("deleteBtn")
  const editBtn = document.getElementById("editBtn")
  const closePanelBtn = document.getElementById("closePanelBtn")

  // =========================
  // MODAL ÖFFNEN
  // =========================
  addBtn.onclick = () => {
    currentStudentIndex = null
    modal.style.display = "flex"
  }

  // =========================
  // MODAL SCHLIESSEN
  // =========================
  closeBtn.onclick = closeModal

  modal.addEventListener("click", (e) => {
    if(e.target === modal){
      closeModal()
    }
  })

  function closeModal(){
    modal.style.display = "none"
  }

  // =========================
  // SPEICHERN (NEU + UPDATE)
  // =========================
  saveBtn.onclick = () => {

    let student = {
      name: document.getElementById("name").value,
      vorname: document.getElementById("vorname").value,
      klasse: document.getElementById("klasse").value,
      telefon: document.getElementById("telefon").value,
      adresse: document.getElementById("adresse").value,
      vorbesitz: document.getElementById("vorbesitz").value,
      startAusbildung: document.getElementById("startAusbildung").value,
      pruefungTheorie: document.getElementById("pruefungTheorie").value,
      pruefungPraxis: document.getElementById("pruefungPraxis").value
    }

    if(!student.name || !student.vorname){
      alert("Name und Vorname fehlen")
      return
    }

    if(currentStudentIndex !== null){
      students[currentStudentIndex] = student
      currentStudentIndex = null
    } else {
      students.push(student)
    }

    localStorage.setItem("students", JSON.stringify(students))

    renderList()
    closeModal()
    clearForm()
  }

  // =========================
  // LISTE RENDERN
  // =========================
  function renderList(){

    const list = document.getElementById("studentList")
    list.innerHTML = ""

    students.forEach((s, i) => {

      let div = document.createElement("div")
      div.className = "studentCard"

      div.innerHTML = `
        <b>${s.name}</b> ${s.vorname}<br>
        Klasse: ${s.klasse}
      `

      div.onclick = () => openStudent(i)

      list.appendChild(div)
    })
  }

  // =========================
  // PANEL SCHLIESSEN
  // =========================
  closePanelBtn.onclick = () => {
    document.getElementById("studentPanel").style.display = "none"
  }

  // =========================
  // LÖSCHEN
  // =========================
  deleteBtn.onclick = () => {

    if(currentStudentIndex === null) return

    if(!confirm("Wirklich löschen?")) return

    students.splice(currentStudentIndex, 1)

    localStorage.setItem("students", JSON.stringify(students))

    document.getElementById("studentPanel").style.display = "none"

    renderList()
  }

  // =========================
  // BEARBEITEN
  // =========================
  editBtn.onclick = () => {

    let s = students[currentStudentIndex]

    document.getElementById("name").value = s.name
    document.getElementById("vorname").value = s.vorname
    document.getElementById("klasse").value = s.klasse
    document.getElementById("telefon").value = s.telefon
    document.getElementById("adresse").value = s.adresse
    document.getElementById("vorbesitz").value = s.vorbesitz
    document.getElementById("startAusbildung").value = s.startAusbildung
    document.getElementById("pruefungTheorie").value = s.pruefungTheorie
    document.getElementById("pruefungPraxis").value = s.pruefungPraxis

    modal.style.display = "flex"
  }

  // =========================
  // FORM LEEREN
  // =========================
  function clearForm(){
    document.getElementById("name").value = ""
    document.getElementById("vorname").value = ""
    document.getElementById("telefon").value = ""
    document.getElementById("adresse").value = ""
    document.getElementById("vorbesitz").value = ""
    document.getElementById("startAusbildung").value = ""
    document.getElementById("pruefungTheorie").value = ""
    document.getElementById("pruefungPraxis").value = ""
  }

  // =========================
  // STUDENT ÖFFNEN
  // =========================
  function openStudent(index){

    currentStudentIndex = index

    let s = students[index]

    document.getElementById("panelName").textContent = s.name
    document.getElementById("panelVorname").textContent = s.vorname
    document.getElementById("panelKlasse").textContent = s.klasse
    document.getElementById("panelTelefon").textContent = s.telefon || "-"
    document.getElementById("panelAdresse").textContent = s.adresse || "-"
    document.getElementById("panelVorbesitz").textContent = s.vorbesitz || "-"
    document.getElementById("panelStart").textContent = s.startAusbildung || "-"
    document.getElementById("panelTheorie").textContent = s.pruefungTheorie || "-"
    document.getElementById("panelPraxis").textContent = s.pruefungPraxis || "-"

    document.getElementById("studentPanel").style.display = "block"
  }

  // Initial laden
  renderList()

})
