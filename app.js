let students = JSON.parse(localStorage.getItem("students") || "[]")

let current = null



function saveDB(){

localStorage.setItem("students", JSON.stringify(students))

}



function renderList(){

const list = document.getElementById("studentList")

list.innerHTML=""

students.forEach((s,i)=>{

let div=document.createElement("div")

div.innerText=s.name+" "+s.vorname

div.onclick=()=>openStudent(i)

list.appendChild(div)

})

}

renderList()



function openStudent(i){

current=i

let s=students[i]

if(!s.checkboxes) s.checkboxes={}

document.getElementById("studentPanel").classList.remove("hidden")

document.getElementById("studentTitle").innerText=s.name+" "+s.vorname

document.getElementById("info").innerHTML=`

<p><b>Anschrift:</b> ${s.anschrift}</p>

<p><b>Telefon:</b> ${s.telefon}</p>

<p><b>Klasse:</b> ${s.klasse}</p>

<p><b>Beginn:</b> ${s.beginn}</p>

<p><b>Prüfung:</b> ${s.pruefung}</p>

`

renderDiagram()

loadDiagram()

updateProgress()

showTab("info")

}



function showTab(tab){

document.querySelectorAll(".tab").forEach(t=>{

t.classList.add("hidden")

})

document.getElementById(tab).classList.remove("hidden")

}



function renderDiagram(){

const container=document.getElementById("diagramContainer")
container.innerHTML=""

Object.keys(DIAGRAMM).forEach(section=>{

let box=document.createElement("div")
box.className="diagramBox"

let title=document.createElement("h3")
title.innerText=section
box.appendChild(title)

DIAGRAMM[section].forEach(field=>{

let label=document.createElement("label")

let text=document.createElement("span")
text.innerText=field

let cb=document.createElement("input")
cb.type="checkbox"
cb.dataset.field=field

cb.addEventListener("change",function(){

students[current].checkboxes[field]=cb.checked
saveDB()
updateProgress()

})

label.appendChild(text)
label.appendChild(cb)

box.appendChild(label)

})

container.appendChild(box)

})

}


function loadDiagram(){

const checkboxes=document.querySelectorAll("#diagramContainer input[type='checkbox']")

checkboxes.forEach(cb=>{

let field=cb.dataset.field

cb.checked=students[current].checkboxes[field]||false

})

}



function updateProgress(){

const checkboxes=document.querySelectorAll("#diagramContainer input[type='checkbox']")

let total=checkboxes.length

let done=0

checkboxes.forEach(cb=>{

if(cb.checked) done++

})

document.getElementById("progress").innerText="Ausbildungsfelder: "+done+" / "+total

}



document.getElementById("addStudentBtn").onclick=function(){

document.getElementById("addPanel").classList.remove("hidden")

}



function closeAdd(){

document.getElementById("addPanel").classList.add("hidden")

}



function saveStudent(){

let s={

name:name.value,

vorname:vorname.value,

anschrift:anschrift.value,

geburt:geburt.value,

telefon:telefon.value,

vorbesitz:vorbesitz.value,

klasse:klasse.value,

sehJa:sehJa.checked,

sehNein:sehNein.checked,

beginn:beginn.value,

pruefung:pruefung.value,

checkboxes:{}

}



students.push(s)

saveDB()

closeAdd()

renderList()

}
