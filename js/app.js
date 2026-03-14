let students = JSON.parse(localStorage.getItem("students") || "[]")
if(!Array.isArray(students)) students=[]

let current=null
let editMode=false

function saveDB(){
localStorage.setItem("students",JSON.stringify(students))
}

/* =============================
   LISTE
============================= */

function renderList(){

const list=document.getElementById("studentList")
list.innerHTML=""

students.forEach((s,i)=>{

let div=document.createElement("div")

div.innerHTML=`
<b>${s.name || ""} ${s.vorname || ""}</b><br>
Klasse: ${s.klasse || "-"}
`

div.onclick=()=>openStudent(i)

list.appendChild(div)

})

}

renderList()

/* =============================
   SCHÜLER ÖFFNEN
============================= */

function openStudent(i){

current=i
let s=students[i]

if(!s.checkboxes) s.checkboxes={}
if(!s.sonderfahrten) s.sonderfahrten={ul:0,ab:0,na:0}

document.getElementById("studentPanel").classList.remove("hidden")

document.getElementById("studentTitle").innerText=s.name+" "+s.vorname

document.getElementById("info").innerHTML=`
<p><b>Name:</b> ${s.name} ${s.vorname}</p>
<p><b>Telefon:</b> ${s.telefon || "-"}</p>
<p><b>Adresse:</b> ${s.adresse || "-"}</p>
<p><b>Vorbesitz:</b> ${s.vorbesitz || "-"}</p>
<p><b>Start Ausbildung:</b> ${s.startAusbildung || "-"}</p>
<p><b>Theorieprüfung:</b> ${s.pruefungTheorie || "-"}</p>
<p><b>Praxisprüfung:</b> ${s.pruefungPraxis || "-"}</p>
<button onclick="editStudent()">Bearbeiten</button>
`

renderDiagram()
loadDiagram()
updateProgress()
renderProgress()

showTab("info")

}

/* =============================
   TABS
============================= */

function showTab(tab){

document.querySelectorAll(".tab").forEach(t=>{
t.classList.add("hidden")
})

document.getElementById(tab).classList.remove("hidden")

}

/* =============================
   DIAGRAMM
============================= */

function renderDiagram(){

const container=document.getElementById("diagramContainer")
if(!container) return

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

cb.addEventListener("change",()=>{

if(!students[current].checkboxes)
students[current].checkboxes={}

students[current].checkboxes[field]=cb.checked

saveDB()

renderProgress()

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
cb.checked=students[current].checkboxes?.[field] || false

})

}

/* =============================
   FORTSCHRITT BERECHNEN
============================= */

function renderProgress(){

let s=students[current]

const container=document.getElementById("progressContainer")

if(!container) return

container.innerHTML=""

Object.keys(DIAGRAMM).forEach(section=>{

let fields=DIAGRAMM[section]

let done=0

fields.forEach(f=>{
if(s.checkboxes && s.checkboxes[f]) done++
})

let percent=Math.round((done/fields.length)*100)

let block=document.createElement("div")
block.className="progressBlock"

block.innerHTML=`
<div class="progressTitle">
${section} (${done}/${fields.length})
</div>

<div class="progressBar">
<div class="progressFill" style="width:${percent}%"></div>
</div>
`

container.appendChild(block)

})

}

/* =============================
   SONDERFAHRTEN
============================= */

function changeDrive(type,val){

let s=students[current]

s.sonderfahrten[type]+=val

if(s.sonderfahrten[type]<0) s.sonderfahrten[type]=0

saveDB()

updateProgress()

}

function updateProgress(){

let s=students[current]

if(!s) return

document.getElementById("ueberlandCount").innerText=s.sonderfahrten.ul
document.getElementById("autobahnCount").innerText=s.sonderfahrten.ab
document.getElementById("nachtCount").innerText=s.sonderfahrten.na

}

/* =============================
   FORMULAR
============================= */

function openAdd(){

editMode=false
document.getElementById("addPanel").classList.remove("hidden")

}

function editStudent(){

let s=students[current]

editMode=true

document.getElementById("addPanel").classList.remove("hidden")

document.getElementById("name").value=s.name || ""
document.getElementById("vorname").value=s.vorname || ""
document.getElementById("klasse").value=s.klasse || "B"

document.getElementById("telefon").value=s.telefon || ""
document.getElementById("adresse").value=s.adresse || ""
document.getElementById("vorbesitz").value=s.vorbesitz || ""

document.getElementById("startAusbildung").value=s.startAusbildung || ""
document.getElementById("pruefungTheorie").value=s.pruefungTheorie || ""
document.getElementById("pruefungPraxis").value=s.pruefungPraxis || ""

}

function closeAdd(){

document.getElementById("addPanel").classList.add("hidden")

}

function saveStudent(){

let data={

name:document.getElementById("name").value,
vorname:document.getElementById("vorname").value,
klasse:document.getElementById("klasse").value,

telefon:document.getElementById("telefon").value,
adresse:document.getElementById("adresse").value,
vorbesitz:document.getElementById("vorbesitz").value,

startAusbildung:document.getElementById("startAusbildung").value,
pruefungTheorie:document.getElementById("pruefungTheorie").value,
pruefungPraxis:document.getElementById("pruefungPraxis").value

}

if(editMode){

students[current]={...students[current],...data}

}else{

students.push({
...data,
sonderfahrten:{ul:0,ab:0,na:0},
checkboxes:{}
})

}

saveDB()
closeAdd()
renderList()

}
