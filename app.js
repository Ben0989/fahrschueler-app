// ================================
// Daten laden / speichern
// ================================
let students = JSON.parse(localStorage.getItem("students") || "[]")
let current = null

function saveDB(){
  localStorage.setItem("students", JSON.stringify(students))
}


// ================================
// Liste der Fahrschüler anzeigen
// ================================
function renderList(){

  const list = document.getElementById("studentList")
  list.innerHTML = ""

  students.forEach((s,i)=>{

    let div = document.createElement("div")
    div.innerText = s.name + " " + s.vorname

    // Klick öffnet Schüler
    div.onclick = () => openStudent(i)

    list.appendChild(div)

  })

}

renderList()


// ================================
// Schüler öffnen
// ================================
function openStudent(i){

  current = i
  let s = students[i]

  document.getElementById("studentPanel").classList.remove("hidden")

  document.getElementById("studentTitle").innerText =
  s.name + " " + s.vorname

  document.getElementById("info").innerHTML =
  "<p>Anschrift: " + s.anschrift + "</p>" +
  "<p>Telefon: " + s.telefon + "</p>" +
  "<p>Klasse: " + s.klasse + "</p>"

  renderDiagram()
  loadDiagram()
  updateProgress()

}


// ================================
// Tabs
// ================================
function showTab(tab){

  document.querySelectorAll(".tab").forEach(t=>{
    t.classList.add("hidden")
  })

  document.getElementById(tab).classList.remove("hidden")

}


// ================================
// Diagramm aus diagrammData.js
// ================================
function renderDiagram(){

  const container = document.getElementById("diagramContainer")
  container.innerHTML = ""

  Object.keys(DIAGRAMM).forEach(section => {

    let box = document.createElement("div")
    box.className = "diagramBox"

    let title = document.createElement("h3")
    title.innerText = section
    box.appendChild(title)

    DIAGRAMM[section].forEach(field => {

      let label = document.createElement("label")

      let cb = document.createElement("input")
      cb.type = "checkbox"
      cb.dataset.field = field

      label.appendChild(cb)
      label.append(" " + field)

      box.appendChild(label)
      box.appendChild(document.createElement("br"))

    })

    container.appendChild(box)

  })

}


// ================================
// Diagramm speichern
// ================================
function saveDiagram(){

  const checkboxes =
  document.querySelectorAll("#diagramContainer input[type='checkbox']")

  checkboxes.forEach(cb=>{

    let field = cb.dataset.field
    students[current].checkboxes[field] = cb.checked

  })

  saveDB()
  updateProgress()

}


// ================================
// Diagramm laden
// ================================
function loadDiagram(){

  const checkboxes =
  document.querySelectorAll("#diagramContainer input[type='checkbox']")

  checkboxes.forEach(cb=>{

    let field = cb.dataset.field

    cb.checked =
    students[current].checkboxes[field] || false

  })

}


// ================================
// Ausbildungsstand berechnen
// ================================
function updateProgress(){

  const checkboxes =
  document.querySelectorAll("#diagramContainer input[type='checkbox']")

  let total = checkboxes.length
  let done = 0

  checkboxes.forEach(cb=>{
    if(cb.checked) done++
  })

  document.getElementById("progress").innerText =
  "Ausbildungsfelder: " + done + " / " + total


  // =============================
  // Sonderfahrten zählen
  // =============================
  let ueberland = 0
  let autobahn = 0
  let nacht = 0

  checkboxes.forEach(cb=>{

    let field = (cb.dataset.field || "").toLowerCase()

    if(cb.checked){

      if(field.includes("überland")) ueberland++

      if(field.includes("autobahn")) autobahn++

      if(field.includes("dunkel")) nacht++

    }

  })

  document.getElementById("ueberlandCount").innerText = ueberland
  document.getElementById("autobahnCount").innerText = autobahn
  document.getElementById("nachtCount").innerText = nacht


  // =============================
  // Klasse berücksichtigen
  // =============================
  let klasse = students[current].klasse

  let maxUL = 5
  let maxAB = 4
  let maxN = 3

  if(klasse === "BE"){

    maxUL = 3
    maxAB = 1
    maxN = 1

  }

  document.getElementById("ueberlandMax").innerText = maxUL
  document.getElementById("autobahnMax").innerText = maxAB
  document.getElementById("nachtMax").innerText = maxN


  // =============================
  // Prüfungsreife
  // =============================
  if(
    ueberland >= maxUL &&
    autobahn >= maxAB &&
    nacht >= maxN
  ){

    document.getElementById("pruefungsreife").innerText =
    "PRÜFUNGSREIF ✔"

    document.getElementById("pruefungsreife").style.color = "green"

  }
  else{

    document.getElementById("pruefungsreife").innerText =
    "Nicht prüfungsreif"

    document.getElementById("pruefungsreife").style.color = "red"

  }

}


// ================================
// Fenster Schüler anlegen
// ================================
document.getElementById("addStudentBtn").onclick = function(){

  document.getElementById("addPanel").classList.remove("hidden")

}

function closeAdd(){

  document.getElementById("addPanel").classList.add("hidden")

}


// ================================
// Schüler speichern
// ================================
function saveStudent(){

  let s = {

    name: name.value,
    vorname: vorname.value,
    anschrift: anschrift.value,
    geburt: geburt.value,
    telefon: telefon.value,
    vorbesitz: vorbesitz.value,
    klasse: klasse.value,
    sehJa: sehJa.checked,
    sehNein: sehNein.checked,
    beginn: beginn.value,
    pruefung: pruefung.value,

    checkboxes:{}

  }

  students.push(s)

  saveDB()

  closeAdd()

  renderList()

}
