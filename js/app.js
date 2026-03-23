console.log("APP START")

let students = JSON.parse(localStorage.getItem("students") || "[]")

if(!Array.isArray(students)){
  students = []
}

let currentStudentIndex = null

// 🔥 GPS VARIABLEN
let watchId = null
let route = []
let startTime = null
let totalDistance = 0

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

  // 🔥 GPS ELEMENTE
  const startTrackingBtn = document.getElementById("startTrackingBtn")
  const stopTrackingBtn = document.getElementById("stopTrackingBtn")
  const distanceEl = document.getElementById("distance")
  const durationEl = document.getElementById("duration")
  const speedEl = document.getElementById("speed")

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

  // =========================
  // GPS START
  // =========================
  if(startTrackingBtn){
    startTrackingBtn.onclick = () => {

      if(!navigator.geolocation){
        alert("GPS nicht verfügbar")
        return
      }

      route = []
      totalDistance = 0
      startTime = Date.now()

      watchId = navigator.geolocation.watchPosition(pos => {

        let lat = pos.coords.latitude
        let lng = pos.coords.longitude
        let speed = pos.coords.speed || 0

        let point = { lat, lng, time: Date.now() }
        route.push(point)

        if(route.length > 1){
          let prev = route[route.length - 2]
          totalDistance += getDistance(prev, point)
        }

        if(distanceEl) distanceEl.textContent = (totalDistance / 1000).toFixed(2)

        let duration = (Date.now() - startTime) / 60000
        if(durationEl) durationEl.textContent = duration.toFixed(1)

        if(speedEl) speedEl.textContent = (speed * 3.6).toFixed(1)

      }, err => console.error(err), {
        enableHighAccuracy:true
      })
    }
  }

  // =========================
  // GPS STOP
  // =========================
  if(stopTrackingBtn){
    stopTrackingBtn.onclick = () => {
      if(watchId !== null){
        navigator.geolocation.clearWatch(watchId)
        watchId = null
      }
    }
  }

  addFahrtBtn.onclick = () => {

    if(currentStudentIndex === null) return

    let titel = fahrtTitel.value
    let notiz = fahrtNotiz.value

    if(!titel) return

    let fahrt = {
      titel,
      notiz,
      datum: new Date().toLocaleDateString(),

      // 🔥 GPS DATEN
      distance: totalDistance,
      duration: startTime ? (Date.now() - startTime) : 0,
      route: route
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
        ${f.notiz || ""}<br>
        Strecke: ${(f.distance/1000 || 0).toFixed(2)} km<br>
        Dauer: ${((f.duration||0)/60000).toFixed(1)} min
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
// Haversine
// =========================
function getDistance(a, b){

  const R = 6371000

  const dLat = (b.lat - a.lat) * Math.PI / 180
  const dLon = (b.lng - a.lng) * Math.PI / 180

  const lat1 = a.lat * Math.PI / 180
  const lat2 = b.lat * Math.PI / 180

  const x = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.sin(dLon/2) * Math.sin(dLon/2) *
            Math.cos(lat1) * Math.cos(lat2)

  const y = 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1-x))

  return R * y
}
