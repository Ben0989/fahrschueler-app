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

document.addEventListener("DOMContentLoaded", () => {

console.log("DOM READY")

const addBtn = document.getElementById("addStudentBtn")

if(addBtn){
addBtn.addEventListener("click", openAdd)
}

renderList()

})

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

alert("openAdd läuft")

const modal = document.getElementById("studentModal")

if(!modal){
alert("Modal NICHT gefunden")
return
}

// ALLES überschreiben
modal.className = "modal"

modal.style.display = "flex"
modal.style.position = "fixed"
modal.style.top = "0"
modal.style.left = "0"
modal.style.width = "100%"
modal.style.height = "100%"
modal.style.background = "rgba(0,0,0,0.7)"
modal.style.zIndex = "999999"

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
