let students = JSON.parse(localStorage.getItem("students") || "[]")

if(!Array.isArray(students)) students=[]

let current = null



function saveDB(){
localStorage.setItem("students", JSON.stringify(students))
}



/* =========================
   FAHRSCHÜLER LISTE
========================= */

function renderList(){

const list = document.getElementById("studentList")

list.innerHTML=""

students.forEach((s,i)=>{

let div=document.createElement("div")

div.className="studentItem"

div.innerText=(s.name||"")+" "+(s.vorname||"")

div.onclick=()=>openStudent(i)

list.appendChild(div)

})

}

renderList()



/* =========================
   SCHÜLER ÖFFNEN
========================= */

function openStudent(i){

let s=students[i]

if(!s) return

current=i

if(!s.checkboxes) s.checkboxes={}
if(!s.sonderfahrten) s.sonderfahrten={ul:0,ab:0,na:0}
if(!s.fahrten) s.fahrten=[]

document.getElementById("studentPanel").classList.remove("hidden")

document.getElementById("studentTitle").innerText=(s.name||"")+" "+(s.vorname||"")

document.getElementById("info").innerHTML=`

<p><b>Anschrift:</b> ${s.anschrift||""}</p>
<p><b>Telefon:</b> ${s.telefon||""}</p>
<p><b>Klasse:</b> ${s.klasse||""}</p>
<p><b>Beginn:</b> ${s.beginn||""}</p>
<p><b>Prüfung:</b> ${s.pruefung||""}</p>

`

renderDiagram()

loadDiagram()

updateProgress()

renderFahrten()

showTab("info")

}



/* =========================
   TABS
========================= */

function showTab(tab){

document.querySelectorAll(".tab").forEach(t=>{
t.classList.add("hidden")
})

document.getElementById(tab).classList.remove("hidden")

}



/* =========================
   DIAGRAMMKARTE ERZEUGEN
========================= */

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



/* =========================
   CHECKBOXEN LADEN
========================= */

function loadDiagram(){

const checkboxes=document.querySelectorAll("#diagramContainer input[type='checkbox']")

checkboxes.forEach(cb=>{

let field=cb.dataset.field

cb.checked=students[current].checkboxes[field]||false

})

}



/* =========================
   FORTSCHRITT
========================= */

function updateProgress(){

const checkboxes=document.querySelectorAll("#diagramContainer input[type='checkbox']")

let total=checkboxes.length
let done=0

checkboxes.forEach(cb=>{
if(cb.checked) done++
})

document.getElementById("progress").innerText="Ausbildungsfelder: "+done+" / "+total



let s=students[current]

let klasse=s.klasse

let maxUL=5
let maxAB=4
let maxN=3

if(klasse==="BE"){

maxUL=3
maxAB=1
maxN=1

}

document.getElementById("ueberlandMax").innerText=maxUL
document.getElementById("autobahnMax").innerText=maxAB
document.getElementById("nachtMax").innerText=maxN

document.getElementById("ueberlandCount").innerText=s.sonderfahrten.ul
document.getElementById("autobahnCount").innerText=s.sonderfahrten.ab
document.getElementById("nachtCount").innerText=s.sonderfahrten.na



if(
s.sonderfahrten.ul>=maxUL &&
s.sonderfahrten.ab>=maxAB &&
s.sonderfahrten.na>=maxN
){

document.getElementById("pruefungsreife").innerText="PRÜFUNGSREIF ✔"
document.getElementById("pruefungsreife").style.color="green"

}else{

document.getElementById("pruefungsreife").innerText="Nicht prüfungsreif"
document.getElementById("pruefungsreife").style.color="red"

}

}



/* =========================
   SONDERFAHRTEN
========================= */

function changeDrive(type,val){

let s=students[current]

let klasse=s.klasse

let maxUL=5
let maxAB=4
let maxN=3

if(klasse==="BE"){

maxUL=3
maxAB=1
maxN=1

}

let max={
ul:maxUL,
ab:maxAB,
na:maxN
}

s.sonderfahrten[type]+=val

if(s.sonderfahrten[type]<0) s.sonderfahrten[type]=0

if(s.sonderfahrten[type]>max[type]) s.sonderfahrten[type]=max[type]

saveDB()

updateProgress()

}



/* =========================
   FAHRT PROTOKOLL
========================= */

function addFahrt(){

let s=students[current]

let datum=document.getElementById("fahrtDatum").value
let text=document.getElementById("fahrtNotiz").value

if(!datum || !text) return

s.fahrten.push({
datum:datum,
text:text
})

saveDB()

renderFahrten()

document.getElementById("fahrtNotiz").value=""

}



function renderFahrten(){

let s=students[current]

const container=document.getElementById("fahrtenListe")

container.innerHTML=""

s.fahrten.forEach(f=>{

let div=document.createElement("div")

div.className="fahrtEintrag"

div.innerHTML="<b>"+f.datum+"</b> - "+f.text

container.appendChild(div)

})

}



/* =========================
   SCHÜLER ANLEGEN
========================= */

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

sonderfahrten:{
ul:0,
ab:0,
na:0
},

fahrten:[],

checkboxes:{}

}

students.push(s)

saveDB()

closeAdd()

renderList()

}



/* =========================
   SUCHFELD
========================= */

document.getElementById("search").addEventListener("input",function(){

let q=this.value.toLowerCase()

const list=document.getElementById("studentList")

list.innerHTML=""

students.forEach((s,i)=>{

let text=(s.name+" "+s.vorname+" "+s.telefon).toLowerCase()

if(text.includes(q)){

let div=document.createElement("div")

div.innerText=(s.name||"")+" "+(s.vorname||"")

div.onclick=()=>openStudent(i)

list.appendChild(div)

}

})

})
