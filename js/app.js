console.log("APP START")

/* =============================
   STATE
============================= */

let students = JSON.parse(localStorage.getItem("students") || "[]")

if(!Array.isArray(students)){
students = []
}

/* =============================
   INIT
============================= */
function openAdd(){

// DEBUG
alert("openAdd läuft")

// Modal holen
const modal = document.getElementById("studentModal")

if(!modal){
alert("Modal NICHT gefunden")
return
}

// ALLE möglichen Blockaden entfernen
modal.classList.remove("hidden")

// zusätzlich absichern (iPad / CSS Bugs)
modal.style.display = "flex"
modal.style.visibility = "visible"
modal.style.opacity = "1"

// Z-Index erzwingen (falls überdeckt)
modal.style.zIndex = "9999"

}

/* =============================
   LISTE RENDERN
============================= */

function renderList(){

const list = document.getElementById("studentList")

if(!list) return

list.innerHTML = ""

students.forEach((s,i)=>{

let div = document.createElement("div")

div.innerHTML = `
<b>${s.name}</b> ${s.vorname}
`

list.appendChild(div)

})

}

/* =============================
   MODAL ÖFFNEN
============================= */

function openAdd(){
alert("BUTTON FUNKTIONIERT")
}

/* =============================
   MODAL SCHLIESSEN
============================= */

function closeAdd(){

document.getElementById("studentModal").classList.add("hidden")

}

/* =============================
   SPEICHERN
============================= */

function saveStudent(){

let name = document.getElementById("name").value
let vorname = document.getElementById("vorname").value

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
closeAdd()

}
