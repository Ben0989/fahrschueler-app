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

  const klasseInput = document.getElementById("klasse")
  const telefonInput = document.getElementById("telefon")
  const adresseInput = document.getElementById("adresse")
  const vorbesitzInput = document.getElementById("vorbesitz")
  const startInput = document.getElementById("startAusbildung")
  const theorieInput = document.getElementById("pruefungTheorie")
  const praxisInput = document.getElementById("pruefungPraxis")

  const fahrtTitel = document.getElementById("fahrtTitel")
  const fahrtNotiz = document.getElementById("fahrtNotiz")
  const addFahrtBtn = document.getElementById("addFahrtBtn")
  const fahrtenListe = document.getElementById("fahrtenListe")
  
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

    let student = {
    name: nameInput.value,
    vorname: vornameInput.value,
    klasse: klasseInput.value,
    telefon: telefonInput.value,
    adresse: adresseInput.value,
    vorbesitz: vorbesitzInput.value,
    startAusbildung: startInput.value,
    pruefungTheorie: theorieInput.value,
    pruefungPraxis: praxisInput.value
}

    localStorage.setItem("students", JSON.stringify(students))

    renderList()

    modal.style.display = "none"

    nameInput.value = ""
    vornameInput.value = ""
    klasseInput.value = "B"
    telefonInput.value = ""
    adresseInput.value = ""
    vorbesitzInput.value = ""
    startInput.value = ""
    theorieInput.value = ""
    praxisInput.value = ""
  }

  
    addFahrtBtn.onclick = () => {

  if(currentStudentIndex === null) return

  let titel = fahrtTitel.value
  let notiz = fahrtNotiz.value

  if(!titel) return

  let fahrt = {
    titel,
    notiz,
    datum: new Date().toLocaleDateString()
  }

  let s = students[currentStudentIndex]

  if(!s.fahrten){
    s.fahrten = []
  }

  s.fahrten.push(fahrt)

  localStorage.setItem("students", JSON.stringify(students))

  renderFahrten()

  fahrtTitel.value = ""
  fahrtNotiz.value = ""
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
    document.getElementById("panelKlasse").textContent = s.klasse || "-"
    document.getElementById("panelTelefon").textContent = s.telefon || "-"
    document.getElementById("panelAdresse").textContent = s.adresse || "-"
    document.getElementById("panelVorbesitz").textContent = s.vorbesitz || "-"
    document.getElementById("panelStart").textContent = s.startAusbildung || "-"
    document.getElementById("panelTheorie").textContent = s.pruefungTheorie || "-"
    document.getElementById("panelPraxis").textContent = s.pruefungPraxis || "-"

    
    studentPanel.style.display = "block"
  }


  function renderFahrten(){

  if(currentStudentIndex === null) return

  const fahrtenListe = document.getElementById("fahrtenListe")
  if(!fahrtenListe) return

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
  // PANEL SCHLIESSEN
  // =========================
  closePanelBtn.onclick = () => {
    studentPanel.style.display = "none"
  }

  renderList()
  renderFahrten()
})
