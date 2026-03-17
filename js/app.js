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

// =============================
// MODAL ÖFFNEN
// =============================
function openAdd(){
  const modal = document.getElementById("studentModal")

  if(!modal){
    console.error("Modal nicht gefunden")
    return
  }

  modal.style.display = "flex"
}

// =============================
// MODAL SCHLIESSEN
// =============================
function closeAdd(){
  const modal = document.getElementById("studentModal")

  if(!modal) return

  modal.style.display = "none"
}

// =============================
// BUTTON EVENT
// =============================
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("addStudentBtn")

  if(btn){
    btn.addEventListener("click", openAdd)
  }
})

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
