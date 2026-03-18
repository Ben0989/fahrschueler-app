console.log("APP START")

let students = JSON.parse(localStorage.getItem("students") || "[]")
let currentStudentIndex = null

document.addEventListener("DOMContentLoaded", () => {

  const addBtn = document.getElementById("addStudentBtn")
  const modal = document.getElementById("studentModal")
  const closeBtn = document.getElementById("closeBtn")
  const saveBtn = document.getElementById("saveBtn")

  const deleteBtn = document.getElementById("deleteBtn")
  const editBtn = document.getElementById("editBtn")
  const closePanelBtn = document.getElementById("closePanelBtn")

  const addFahrtBtn = document.getElementById("addFahrtBtn")

  // =========================
  // MODAL
  // =========================
  addBtn.onclick = () => {
    currentStudentIndex = null
    modal.style.display = "flex"
  }

  closeBtn.onclick = () => modal.style.display = "none"

  modal.onclick = (e) => {
    if(e.target === modal){
      modal.style.display = "none"
    }
  }

  // =========================
  // SPEICHERN
  // =========================
  saveBtn.onclick = () => {

    let student = {
      name: name.value,
      vorname: vorname.value,
      klasse: klasse.value,
      telefon: telefon.value,
      adresse: adresse.value,
      vorbesitz: vorbesitz.value,
      startAusbildung: startAusbildung.value,
      pruefungTheorie: pruefungTheorie.value,
      pruefungPraxis: pruefungPraxis.value,
      fahrten: []
    }

    if(!student.name || !student.vorname){
      alert("Name fehlt")
      return
    }

    if(currentStudentIndex !== null){
      student.fahrten = students[currentStudentIndex].fahrten || []
      students[currentStudentIndex] = student
      currentStudentIndex = null
    } else {
      students.push(student)
    }

    localStorage.setItem("students", JSON.stringify(students))

    renderList()
    modal.style.display = "none"
  }

  // =========================
  // LISTE
  // =========================
  function renderList(){

    studentList.innerHTML = ""

    students.forEach((s, i) => {

      let div = document.createElement("div")
      div.className = "studentCard"

      div.innerHTML = `
        <b>${s.name}</b> ${s.vorname}<br>
        Klasse: ${s.klasse}
      `

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
    panelKlasse.textContent = s.klasse

    renderFahrten()

    studentPanel.style.display = "block"
  }

  // =========================
  // FAHRTEN SPEICHERN
  // =========================
  addFahrtBtn.onclick = () => {

    let titel = fahrtTitel.value
    let notiz = fahrtNotiz.value

    if(!titel) return

    let fahrt = {
      titel,
      notiz,
      datum: new Date().toLocaleDateString()
    }

    if(!students[currentStudentIndex].fahrten){
      students[currentStudentIndex].fahrten = []
    }

    students[currentStudentIndex].fahrten.push(fahrt)

    localStorage.setItem("students", JSON.stringify(students))

    renderFahrten()

    fahrtTitel.value = ""
    fahrtNotiz.value = ""
  }

  // =========================
  // FAHRTEN ANZEIGEN
  // =========================
  function renderFahrten(){

    let s = students[currentStudentIndex]

    fahrtenListe.innerHTML = ""

    if(!s.fahrten) return

    s.fahrten.forEach(f => {

      let div = document.createElement("div")

      div.innerHTML = `
        <b>${f.titel}</b> (${f.datum})<br>
        ${f.notiz || ""}
        <hr>
      `

      fahrtenListe.appendChild(div)
    })
  }

  // =========================
  // PANEL
  // =========================
  closePanelBtn.onclick = () => {
    studentPanel.style.display = "none"
  }

  deleteBtn.onclick = () => {

    if(!confirm("Löschen?")) return

    students.splice(currentStudentIndex, 1)

    localStorage.setItem("students", JSON.stringify(students))

    studentPanel.style.display = "none"
    renderList()
  }

  editBtn.onclick = () => {

    let s = students[currentStudentIndex]

    name.value = s.name
    vorname.value = s.vorname
    klasse.value = s.klasse

    modal.style.display = "flex"
  }

  renderList()

})
