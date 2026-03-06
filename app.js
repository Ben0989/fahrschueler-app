let students = JSON.parse(localStorage.getItem("students") || "[]")

if(!Array.isArray(students)) students=[]

let current = null
let editMode = false

let route = []
let watchId = null
let startTime = null



function saveDB(){
localStorage.setItem("students",JSON.stringify(students))
}



/* =============================
   STARTLISTE
============================= */

function renderList(){

const list = document.getElementById("studentList")
list.innerHTML=""

students.forEach((s,i)=>{

let div=document.createElement("div")
div.className="studentCard"

let name=(s.name||"")+" "+(s.vorname||"")
let klasse=s.klasse||"-"
let pruefung=s.pruefung||"-"

let progress=0
let total=0

if(s.checkboxes){

total=Object.keys(s.checkboxes).length

Object.values(s.checkboxes).forEach(v=>{
if(v) progress++
})

}

div.innerHTML=`
<b>${name}</b><br>
Klasse: ${klasse}<br>
Prüfung: ${pruefung}<br>
Fortschritt: ${progress}/${total}
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
if(!s.fahrten) s.fahrten=[]

document.getElementById("studentPanel").classList.remove("hidden")

document.getElementById("studentTitle").innerText=
(s.name||"")+" "+(s.vorname||"")

document.getElementById("info").innerHTML=`

<p><b>Anschrift:</b> ${s.anschrift||""}</p>
<p><b>Telefon:</b> ${s.telefon||""}</p>
<p><b>Klasse:</b> ${s.klasse||""}</p>
<p><b>Beginn:</b> ${s.beginn||""}</p>
<p><b>Prüfung:</b> ${s.pruefung||""}</p>

<button onclick="editStudent()">Bearbeiten</button>

`

renderDiagram()
loadDiagram()
updateProgress()
renderFahrten()

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



/* =============================
   DIAGRAMM LADEN
============================= */

function loadDiagram(){

const checkboxes=document.querySelectorAll("#diagramContainer input[type='checkbox']")

checkboxes.forEach(cb=>{

let field=cb.dataset.field

cb.checked=students[current].checkboxes[field]||false

})

}



/* =============================
   FORTSCHRITT + PRÜFUNGSREIFE
============================= */

function updateProgress(){

const checkboxes=document.querySelectorAll("#diagramContainer input[type='checkbox']")

let total=checkboxes.length
let done=0

checkboxes.forEach(cb=>{
if(cb.checked) done++
})

document.getElementById("progress").innerText=
"Ausbildungsfelder: "+done+" / "+total


let s = students[current]

let klasse = s.klasse

let maxUL = 5
let maxAB = 4
let maxN = 3

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



let sonderfahrtenOK =
s.sonderfahrten.ul>=maxUL &&
s.sonderfahrten.ab>=maxAB &&
s.sonderfahrten.na>=maxN

let reifeOK=true

if(DIAGRAMM["Reife-, Teststufe"]){

DIAGRAMM["Reife-, Teststufe"].forEach(field=>{
if(!s.checkboxes[field]) reifeOK=false
})

}

if(sonderfahrtenOK && reifeOK){

document.getElementById("pruefungsreife").innerText="PRÜFUNGSREIF ✔"
document.getElementById("pruefungsreife").style.color="green"

}else{

document.getElementById("pruefungsreife").innerText="Nicht prüfungsreif"
document.getElementById("pruefungsreife").style.color="red"

}

}



/* =============================
   SONDERFAHRTEN
============================= */

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

let max={ul:maxUL,ab:maxAB,na:maxN}

s.sonderfahrten[type]+=val

if(s.sonderfahrten[type]<0) s.sonderfahrten[type]=0
if(s.sonderfahrten[type]>max[type]) s.sonderfahrten[type]=max[type]

saveDB()
updateProgress()

}



/* =============================
   GPS TRACKING
============================= */

function startTracking(){

route=[]
startTime=Date.now()

watchId=navigator.geolocation.watchPosition(pos=>{

route.push({
lat:pos.coords.latitude,
lng:pos.coords.longitude
})

},{enableHighAccuracy:true})

}



function stopTracking(){

if(watchId){
navigator.geolocation.clearWatch(watchId)
}

}



/* =============================
   STRECKE BERECHNEN
============================= */

function calcDistance(route){

let distance=0

for(let i=1;i<route.length;i++){

let a=route[i-1]
let b=route[i]

let R=6371

let dLat=(b.lat-a.lat)*Math.PI/180
let dLon=(b.lng-a.lng)*Math.PI/180

let lat1=a.lat*Math.PI/180
let lat2=b.lat*Math.PI/180

let x=
Math.sin(dLat/2)*Math.sin(dLat/2)+
Math.sin(dLon/2)*Math.sin(dLon/2)*
Math.cos(lat1)*Math.cos(lat2)

let c=2*Math.atan2(Math.sqrt(x),Math.sqrt(1-x))

distance+=R*c

}

return distance

}



/* =============================
   FAHRT SPEICHERN
============================= */

function saveFahrt(){

let s=students[current]

let endTime=Date.now()

let duration=Math.round((endTime-startTime)/60000)

let distance=calcDistance(route).toFixed(2)

let fahrt={

datum:new Date().toISOString().split("T")[0],
titel:document.getElementById("fahrtTitel").value,
notiz:document.getElementById("fahrtNotiz").value,

dauer:duration,
strecke:distance,

route:route

}

s.fahrten.push(fahrt)

saveDB()

renderFahrten()

}



/* =============================
   FAHRTEN AUSBILDUNGSÜBERSICHT
============================= */

function renderFahrten(){

let s=students[current]

const container=document.getElementById("fahrtenListe")

if(!container) return

container.innerHTML=""

s.fahrten
.sort((a,b)=>new Date(b.datum)-new Date(a.datum))
.forEach(f=>{

let div=document.createElement("div")
div.className="fahrtEintrag"

div.innerHTML=`
<b>${f.datum}</b> ${f.titel}<br>
Dauer: ${f.dauer} min<br>
Strecke: ${f.strecke} km<br>
${f.notiz}
`

container.appendChild(div)

})

}



/* =============================
   BEARBEITEN
============================= */

function editStudent(){

let s=students[current]

editMode=true

document.getElementById("addPanel").classList.remove("hidden")

document.getElementById("name").value=s.name||""
document.getElementById("vorname").value=s.vorname||""
document.getElementById("anschrift").value=s.anschrift||""
document.getElementById("geburt").value=s.geburt||""
document.getElementById("telefon").value=s.telefon||""
document.getElementById("vorbesitz").value=s.vorbesitz||""
document.getElementById("klasse").value=s.klasse||"B"

document.getElementById("sehJa").checked=s.sehJa||false
document.getElementById("sehNein").checked=s.sehNein||false

document.getElementById("beginn").value=s.beginn||""
document.getElementById("pruefung").value=s.pruefung||""

}



/* =============================
   SCHÜLER ANLEGEN / SPEICHERN
============================= */

document.getElementById("addStudentBtn").onclick=function(){

editMode=false

document.getElementById("addPanel").classList.remove("hidden")

}



function closeAdd(){

document.getElementById("addPanel").classList.add("hidden")

}



function saveStudent(){

let nameField=document.getElementById("name")
let vornameField=document.getElementById("vorname")
let anschriftField=document.getElementById("anschrift")
let geburtField=document.getElementById("geburt")
let telefonField=document.getElementById("telefon")
let vorbesitzField=document.getElementById("vorbesitz")
let klasseField=document.getElementById("klasse")

let sehJaField=document.getElementById("sehJa")
let sehNeinField=document.getElementById("sehNein")

let beginnField=document.getElementById("beginn")
let pruefungField=document.getElementById("pruefung")

if(editMode){

let s=students[current]

s.name=nameField.value
s.vorname=vornameField.value
s.anschrift=anschriftField.value
s.geburt=geburtField.value
s.telefon=telefonField.value
s.vorbesitz=vorbesitzField.value
s.klasse=klasseField.value
s.sehJa=sehJaField.checked
s.sehNein=sehNeinField.checked
s.beginn=beginnField.value
s.pruefung=pruefungField.value

}else{

let s={

name:nameField.value,
vorname:vornameField.value,
anschrift:anschriftField.value,
geburt:geburtField.value,
telefon:telefonField.value,
vorbesitz:vorbesitzField.value,
klasse:klasseField.value,
sehJa:sehJaField.checked,
sehNein:sehNeinField.checked,
beginn:beginnField.value,
pruefung:pruefungField.value,

sonderfahrten:{ul:0,ab:0,na:0},
fahrten:[],
checkboxes:{}

}

students.push(s)

}

saveDB()

closeAdd()

renderList()

}
