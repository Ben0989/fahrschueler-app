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

  const deleteBtn = document.getElementById("deleteBtn")
  const editBtn = document.getElementById("editBtn")

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

  saveBtn.onclick = () => {

    let name = nameInput.value
    let vorname = vornameInput.value

    if(!name || !vorname){
      alert("Name fehlt")
      return
    }

    let student = {
      name,
      vorname,
      klasse: klasseInput.value,
      telefon: telefonInput.value,
      adresse: adresseInput.value,
      vorbesitz: vorbesitzInput.value,
      startAusbildung: startInput.value,
      pruefungTheorie: theorieInput.value,
      pruefungPraxis: praxisInput.value
    }

    if(currentStudentIndex !== null){
      student.fahrten = students[currentStudentIndex].fahrten || []
      student.diagramm = students[currentStudentIndex].diagramm || {}
      student.drives = students[currentStudentIndex].drives || { ul:0, ab:0, na:0 }
      students[currentStudentIndex] = student
      currentStudentIndex = null
    } else {
      students.push(student)
    }

    localStorage.setItem("students", JSON.stringify(students))

    renderList()
    modal.style.display = "none"

    nameInput.value = ""
    vornameInput.value = ""
    klasseInput.value = "B"
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
  }

  function renderFahrten(){

    if(currentStudentIndex === null) return

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

  function renderList(){

    studentList.innerHTML = ""

    students.forEach((s, i) => {

      let div = document.createElement("div")

      div.innerHTML = `<b>${s.name}</b> ${s.vorname}`

      div.onclick = () => openStudent(i)

      studentList.appendChild(div)
    })
  }

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

    renderFahrten()
    renderDiagram()
    renderAuswertung()
    renderDrives()
    showTab("info")
  }

  deleteBtn.onclick = () => {

    if(currentStudentIndex === null) return
    if(!confirm("Wirklich löschen?")) return

    students.splice(currentStudentIndex, 1)

    localStorage.setItem("students", JSON.stringify(students))

    studentPanel.style.display = "none"

    renderList()
  }

  editBtn.onclick = () => {

    if(currentStudentIndex === null) return

    let s = students[currentStudentIndex]

    nameInput.value = s.name
    vornameInput.value = s.vorname
    klasseInput.value = s.klasse || "B"

    modal.style.display = "flex"
  }

  closePanelBtn.onclick = () => {
    studentPanel.style.display = "none"
  }

  renderList()

})


// =========================
// TAB SYSTEM
// =========================
function showTab(tabId){

  document.querySelectorAll(".tab").forEach(tab => {
    tab.style.display = "none"
  })

  const active = document.getElementById(tabId)
  if(active){
    active.style.display = "block"
  }

  if(tabId === "diagramm") renderDiagram()

  if(tabId === "auswertung"){
    renderAuswertung()
    renderDrives()
  }
}


// =========================
// DIAGRAMM
// =========================
function renderDiagram(){

  const container = document.getElementById("diagramContainer")

  if(!container || typeof DIAGRAMM === "undefined") return
  if(currentStudentIndex === null) return

  container.innerHTML = ""

  let s = students[currentStudentIndex]

  if(!s.diagramm){
    s.diagramm = {}
  }

  Object.keys(DIAGRAMM).forEach(kategorie => {

    let box = document.createElement("div")
    box.className = "diagramBox"

    let html = `<h3>${kategorie}</h3>`

    DIAGRAMM[kategorie].forEach(item => {

      let checked = s.diagramm[item] || false

      html += `
        <label>
          ${item}
          <input type="checkbox" ${checked ? "checked" : ""}>
        </label>
      `
    })

    box.innerHTML = html

    box.querySelectorAll("input").forEach((cb, index) => {

      let item = DIAGRAMM[kategorie][index]

      cb.onchange = () => {
        s.diagramm[item] = cb.checked
        localStorage.setItem("students", JSON.stringify(students))
      }

    })

    container.appendChild(box)
  })
}


// =========================
// AUSWERTUNG (NEU LOGIK)
// =========================
function renderAuswertung(){

  if(currentStudentIndex === null) return
  if(typeof DIAGRAMM === "undefined") return

  let s = students[currentStudentIndex]

  if(!s.diagramm) return

  const container = document.getElementById("progressContainer")
  const gesamt = document.getElementById("gesamtProgress")
  const ampel = document.getElementById("ampel")
  const status = document.getElementById("pruefungsreife")

  if(!container) return

  container.innerHTML = ""

  let total = 0
  let doneTotal = 0

  let reifePercent = 0

  Object.keys(DIAGRAMM).forEach(kategorie => {

    let items = DIAGRAMM[kategorie]

    let done = items.filter(i => s.diagramm[i]).length
    let percent = Math.round((done / items.length) * 100)

    total += items.length
    doneTotal += done

    // 🔥 Reife/Test = eine Kategorie
    if(kategorie.toLowerCase().includes("reife") || 
       kategorie.toLowerCase().includes("test")){
      reifePercent = percent
    }

    let color = "red"
    if(percent >= 80) color = "green"
    else if(percent >= 50) color = "orange"

    let div = document.createElement("div")
    div.className = "progressBlock"

    div.innerHTML = `
      <div class="progressTitle">${kategorie} (${percent}%)</div>
      <div class="progressBar">
        <div class="progressFill ${color}" style="width:${percent}%"></div>
      </div>
    `

    container.appendChild(div)
  })

  let gesamtProzent = Math.round((doneTotal / total) * 100)

  gesamt.textContent = "Gesamt: " + gesamtProzent + "%"

  // 🔥 Sonderfahrten prüfen
  let drivesOK = false

  if(s.drives){
    let limits = getDriveLimits(s.klasse)

    drivesOK =
      s.drives.ul >= limits.ul &&
      s.drives.ab >= limits.ab &&
      s.drives.na >= limits.na
  }

  let pruefungsreif =
    gesamtProzent >= 80 &&
    reifePercent === 100 &&
    drivesOK

  if(pruefungsreif){
    ampel.textContent = "🟢"
    status.textContent = "Prüfungsreif"
  }
  else if(gesamtProzent >= 50){
    ampel.textContent = "🟡"
    status.textContent = "Noch nicht prüfungsreif"
  }
  else{
    ampel.textContent = "🔴"
    status.textContent = "Ausbildung unzureichend"
  }
}


// =========================
// SONDERFAHRTEN
// =========================
function getDriveLimits(klasse){

  if(klasse === "B"){
    return { ul:5, ab:4, na:3 }
  }

  if(klasse === "BE"){
    return { ul:3, ab:1, na:1 }
  }

  return { ul:0, ab:0, na:0 }
}

function renderDrives(){

  if(currentStudentIndex === null) return

  let s = students[currentStudentIndex]

  if(!s.drives){
    s.drives = { ul:0, ab:0, na:0 }
  }

  let limits = getDriveLimits(s.klasse)

  document.getElementById("ulCount").textContent = s.drives.ul
  document.getElementById("abCount").textContent = s.drives.ab
  document.getElementById("naCount").textContent = s.drives.na

  document.getElementById("ulMax").textContent = "/ " + limits.ul
  document.getElementById("abMax").textContent = "/ " + limits.ab
  document.getElementById("naMax").textContent = "/ " + limits.na
}

function changeDrive(type, delta){

  if(currentStudentIndex === null) return

  let s = students[currentStudentIndex]

  if(!s.drives){
    s.drives = { ul:0, ab:0, na:0 }
  }

  let limits = getDriveLimits(s.klasse)

  s.drives[type] += delta

  if(s.drives[type] < 0) s.drives[type] = 0
  if(s.drives[type] > limits[type]) s.drives[type] = limits[type]

  localStorage.setItem("students", JSON.stringify(students))

  renderDrives()
}
