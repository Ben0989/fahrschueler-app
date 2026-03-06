let students = JSON.parse(localStorage.getItem("students") || "[]")

function renderList(){

const list = document.getElementById("studentList")
list.innerHTML = ""

students.forEach((s,i)=>{

let div = document.createElement("div")
div.innerText = s.name + " " + s.vorname

list.appendChild(div)

})

}

renderList()

// + Button öffnet Fenster
document.getElementById("addStudentBtn").onclick = function(){

document.getElementById("addPanel").classList.remove("hidden")

}

// Fenster schließen
function closeAdd(){

document.getElementById("addPanel").classList.add("hidden")

}

// Schüler speichern
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

localStorage.setItem("students", JSON.stringify(students))

closeAdd()

renderList()

}
