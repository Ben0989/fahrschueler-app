let students = JSON.parse(localStorage.getItem("students") || "[]")
if(!Array.isArray(students)) students=[]

let current=null
let editMode=false

let route=[]
let watchId=null
let startTime=null

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
if(!s.fahrten) s.fahrten=[]
if(!s.boegen) s.boegen={beratung:[],theorie:[],praxis:[]}

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
renderGesamtProgress()
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
   SUB TABS (BEOBACHTUNGSBÖGEN)
============================= */

function showSubTab(tab){

document.querySelectorAll(".subtab").forEach(t=>{
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
renderGesamtProgress()

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
   STUFENFORTSCHRITT
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
   GESAMTFORTSCHRITT + AMPEL
============================= */

function renderGesamtProgress(){

let s=students[current]
if(!s) return

let total=0
let done=0

Object.keys(DIAGRAMM).forEach(section=>{
let fields=DIAGRAMM[section]

fields.forEach(f=>{
total++
if(s.checkboxes && s.checkboxes[f]) done++
})

})

let percent=Math.round((done/total)*100)

document.getElementById("gesamtProgress").innerText =
"Ausbildung abgeschlossen: " + percent + "%"

/* =============================
   AUSBILDUNGS AMPEL
============================= */

let ampel = document.getElementById("ausbildungsAmpel")

if(ampel){

if(percent < 40){

ampel.innerText = "🔴 Ausbildung am Anfang"
ampel.style.color = "#d32f2f"

}

else if(percent < 80){

ampel.innerText = "🟡 Ausbildung fortgeschritten"
ampel.style.color = "#f9a825"

}

else{

ampel.innerText = "🟢 Ausbildung weit fortgeschritten"
ampel.style.color = "#2e7d32"

}

}

/* PRÜFUNGSREIFE */

let klasse=s.klasse || "B"

let maxUL=5
let maxAB=4
let maxNA=3

if(klasse==="BE"){
maxUL=3
maxAB=1
maxNA=1
}

let sonderOK=
s.sonderfahrten.ul>=maxUL &&
s.sonderfahrten.ab>=maxAB &&
s.sonderfahrten.na>=maxNA

let reifeOK=true

if(DIAGRAMM["Reife-, Teststufe"]){

DIAGRAMM["Reife-, Teststufe"].forEach(field=>{
if(!s.checkboxes || !s.checkboxes[field])
reifeOK=false
})

}

let el=document.getElementById("pruefungsreifeStatus")

if(sonderOK && reifeOK){
el.innerText="PRÜFUNGSREIF ✔"
}else{
el.innerText="Noch nicht prüfungsreif"
}

}

/* =============================
   SONDERFAHRTEN
============================= */

function changeDrive(type,val){

let s=students[current]
if(!s) return

let klasse=s.klasse || "B"

let maxUL=5
let maxAB=4
let maxNA=3

if(klasse==="BE"){
maxUL=3
maxAB=1
maxNA=1
}

let max={ul:maxUL,ab:maxAB,na:maxNA}

let newValue=(s.sonderfahrten[type] || 0)+val

if(newValue<0) newValue=0
if(newValue>max[type]) newValue=max[type]

s.sonderfahrten[type]=newValue

saveDB()

updateProgress()
renderGesamtProgress()

}

function updateProgress(){

let s=students[current]
if(!s) return

document.getElementById("ueberlandCount").innerText=s.sonderfahrten.ul
document.getElementById("autobahnCount").innerText=s.sonderfahrten.ab
document.getElementById("nachtCount").innerText=s.sonderfahrten.na

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
watchId=null
}

}

/* =============================
   DISTANZ
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
Math.sin(dLat/2)**2+
Math.sin(dLon/2)**2*Math.cos(lat1)*Math.cos(lat2)

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
if(!s) return

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
   FAHRTEN ANZEIGEN
============================= */

function renderFahrten(){

let s=students[current]
const container=document.getElementById("fahrtenListe")

if(!container) return

container.innerHTML=""

s.fahrten
.sort((a,b)=>new Date(b.datum)-new Date(a.datum))
.forEach((f,i)=>{

let div=document.createElement("div")

div.innerHTML=`
<b>${f.datum}</b> ${f.titel}<br>
Dauer: ${f.dauer} min<br>
Strecke: ${f.strecke} km<br>
${f.notiz}
<div id="map${i}" style="height:200px;margin-top:10px"></div>
`

container.appendChild(div)

if(f.route && f.route.length>0){

let map=L.map("map"+i).setView([f.route[0].lat,f.route[0].lng],13)

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19}).addTo(map)

let latlngs=f.route.map(p=>[p.lat,p.lng])

L.polyline(latlngs,{color:'blue'}).addTo(map)

}

})

}

/* =============================
   BEOBACHTUNGSBÖGEN
============================= */

function saveBeratung(){

let s=students[current]

let data={
datum:document.getElementById("b_datum").value,
dauer:document.getElementById("b_dauer").value,
partner:document.getElementById("b_partner").value,
klasse:document.getElementById("b_klasse").value,
bem:document.getElementById("b_bem").value
}

s.boegen.beratung.push(data)

saveDB()

alert("Beratung gespeichert")

}

function saveTheorie(){

let s=students[current]

let data={
datum:document.getElementById("t_datum").value,
zeit:document.getElementById("t_time").value,
thema:document.getElementById("t_thema").value,
bem:document.getElementById("t_bem").value
}

s.boegen.theorie.push(data)

saveDB()

alert("Theorie gespeichert")

}

function savePraxis(){

let s=students[current]

let data={
datum:document.getElementById("p_datum").value,
dauer:document.getElementById("p_dauer").value,
art:document.getElementById("p_art").value,
schwerpunkt:document.getElementById("p_schwerpunkt").value,
notizen:document.getElementById("p_notizen").value
}

s.boegen.praxis.push(data)

saveDB()

alert("Praxis gespeichert")

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
checkboxes:{},
fahrten:[],
boegen:{beratung:[],theorie:[],praxis:[]}
})

}

saveDB()
closeAdd()
renderList()

}
