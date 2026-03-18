console.log("APP START")

let students = JSON.parse(localStorage.getItem("students") || "[]")

// 🔥 WICHTIG: Absicherung
if(!Array.isArray(students)){
  students = []
}

let currentStudentIndex = null

document.addEventListener("DOMContentLoaded", () => {

  // =========================
  // ELEMENTE
  // =========================
  const addBtn = document.getElementById("addStudentBtn")
  const modal = document.getElementById("studentModal")
  const closeBtn = document.getElementById("closeBtn")
  const saveBtn = document.getElementById("saveBtn")

  const studentList = document.getElementById("studentList")
  const studentPanel = document.getElementById("studentPanel")

  const panelName = document.getElementById("panelName")
  const panelVorname = document.getElementById("panelVorname")
  const panelKlasse = document.getElementById("panelKlasse")

  const deleteBtn = document.getElementById("deleteBtn")
  const editBtn = document.getElementById("editBtn")
  const closePanelBtn = document.getElementById("closePanelBtn")

  const fahrtTitel = document.getElementById("fahrtTitel")
  const fahrtNotiz = document.getElementById("fahrtNotiz")
  const addFahrtBtn = document.getElementById("addFahrtBtn")
  const fahrtenListe = document.getElementById("fahrtenListe")

  // FORM
  const nameInput = document.getElementById("name")
  const vornameInput = document.getElementById("vorname")
  const klasseInput = document.getElementById("klasse")
  const telefonInput = document.getElementById("telefon")
  const adresseInput = document.getElementById("adresse")
  const vorbesitzInput = document.getElementById("vorbesitz")
  const startInput = document.getElementById("startAusbildung")
  const theorieInput = document.getElementById("pruefungTheorie")
  const praxisInput = document.getElementById("pruefungPraxis")

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
      name: nameInput.value,
      vorname: vornameInput.value,
      klasse: klasseInput.value,
      telefon: telefonInput.value,
      adresse: adresseInput.value,
      vorbesitz: vorbesitzInput.value,
      startAusbildung: startInput.value,
      pruefungTheorie: theorieInput.value,
      pruefungPraxis: praxisInput.value,
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

    // optional reset
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

    document.getElementById("panelTelefon").textContent = s.telefon || "-"
    document.getElementById("panelAdresse").textContent = s.adresse || "-"
    document.getElementById("panelVorbesitz").textContent = s.vorbesitz || "-"
    document.getElementById("panelStart").textContent = s.startAusbildung || "-"
    document.getElementById("panelTheorie").textContent = s.pruefungTheorie || "-"
    document.getElementById("panelPraxis").textContent = s.pruefungPraxis || "-"

    renderFahrten()

    studentPanel.style.display = "block"
  }

  // =========================
  // FAHRTEN
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

  function renderFahrten(){

    fahrtenListe.innerHTML = ""

    let s = students[currentStudentIndex]

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

    nameInput.value = s.name
    vornameInput.value = s.vorname
    klasseInput.value = s.klasse

    modal.style.display = "flex"
  }

  renderList()

})
