console.log("APP STARTET")

let students = JSON.parse(localStorage.getItem("students") || "[]")

if(!Array.isArray(students)){
students = []
}

let current = null
let editMode = false

let route=[]
let watchId=null
let startTime=null


function saveDB(){
localStorage.setItem("students",JSON.stringify(students))
}
function getStudent(){
if(current===null) return null
return students[current]
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

document.addEventListener("DOMContentLoaded", () => {

console.log("DOM geladen")

// 🔥 NEUER BUTTON
const addBtnNew = document.getElementById("addStudentBtnNew")

if(addBtnNew){
addBtnNew.addEventListener("click", function(){

console.log("NEUER BUTTON GEKLICKT")

openAdd()

})
}

// Suche initialisieren
const searchInput = document.getElementById("search")

if(searchInput){
searchInput.addEventListener("input", e=>{

let q=e.target.value.toLowerCase()

const studentsDom=document.querySelectorAll("#studentList div")

studentsDom.forEach(d=>{
d.style.display=d.innerText.toLowerCase().includes(q) ? "block":"none"
})

})
}

// Liste initial rendern
renderList()

})

/* =============================
   SCHÜLER ÖFFNEN
============================= */

function openStudent(i){

if(i===undefined || !students[i]) return
   
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

if(current===null) return
   
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

if(current===null) return
   
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

if(current===null) return
   
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

if(current===null) return
   
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

let s = getStudent()
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

let s = getStudent()
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

let lastSave=0

watchId=navigator.geolocation.watchPosition(pos=>{

let now=Date.now()

if(now-lastSave<5000) return
lastSave=now

let point={
lat:pos.coords.latitude,
lng:pos.coords.longitude,
speed:pos.coords.speed || 0,
time:now
}

if(route.length>0){

let last=route[route.length-1]
let dist=Math.abs(point.lat-last.lat)+Math.abs(point.lng-last.lng)

if(dist<0.00005) return
}

route.push(point)

},{
enableHighAccuracy:false,
maximumAge:3000,
timeout:5000
})

}

function stopTracking(){

if(watchId!==null){
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

let s = getStudent()
if(!s) return

let endTime=Date.now()

let duration=Math.round((endTime-startTime)/60000)
let distance = route.length>1 ? calcDistance(route).toFixed(2) : 0

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

stopTracking()
   
route=[]
}

/* =============================
   FAHRTEN ANZEIGEN
============================= */

function renderFahrten(){

let s = getStudent()
if(!s) return
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

if(f.route && f.route.length>1){

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

let s = getStudent()
if(!s) return

let data={
datum:document.getElementById("b_datum").value,
dauer:document.getElementById("b_dauer").value,
partner:document.getElementById("b_partner").value,
klasse:document.getElementById("b_klasse").value,
bem:document.getElementById("b_bem").value
}

s.boegen.beratung.push(data)

saveDB()
renderBoegen()
alert("Beratung gespeichert")

}

function saveTheorie(){

let s = getStudent()
if(!s) return

if(!s.boegen) s.boegen={beratung:[],theorie:[],praxis:[]}

function radio(name){
let el=document.querySelector("input[name='"+name+"']:checked")
return el ? el.value : ""
}

let data={

datum:document.getElementById("t_datum").value,
uhrzeit:document.getElementById("t_time").value,
anzahlFS:document.getElementById("t_fs").value,
thema:document.getElementById("t_thema").value,

grundstoff:document.getElementById("t_grundstoff").checked,
zusatzstoff:document.getElementById("t_zusatzstoff").checked,

fahrlehrer:{

umgangston:radio("ton"),
lautstaerke:radio("laut"),
stimme:radio("stimme"),
sprechtempo:radio("tempo"),
sprache:radio("sprache"),
gestik:radio("gestik"),
blickkontakt:radio("blick"),
mimik:radio("mimik")

},

bemerkungen:{

ton:document.getElementById("ton_bem").value,
laut:document.getElementById("laut_bem").value,
stimme:document.getElementById("stimme_bem").value,
tempo:document.getElementById("tempo_bem").value,
sprache:document.getElementById("sprache_bem").value,
gestik:document.getElementById("gestik_bem").value,
blick:document.getElementById("blick_bem").value,
mimik:document.getElementById("mimik_bem").value

},

methoden:{

frontal:document.getElementById("m_frontal").checked,
lehrgespraech:document.getElementById("m_lehrgespraech").checked,
gruppe:document.getElementById("m_gruppe").checked,
fragen:document.getElementById("m_fragen").checked,
diskussion:document.getElementById("m_diskussion").checked,
erklaerung:document.getElementById("m_erklaerung").checked,
zuruf:document.getElementById("m_zuruf").checked

},

medien:{

lehrbuch:document.getElementById("med_lehrbuch").checked,
arbeitsblatt:document.getElementById("med_arbeitsblatt").checked,
flipchart:document.getElementById("med_flipchart").checked,
tafel:document.getElementById("med_tafel").checked,
beamer:document.getElementById("med_beamer").checked,
smartboard:document.getElementById("med_smartboard").checked,
handy:document.getElementById("med_handy").checked

},

redeanteilFL:document.getElementById("rede_fl").value,
redeanteilFS:document.getElementById("rede_fs").value,

stimmung:document.getElementById("t_stimmung").value,
reaktion:document.getElementById("t_reaktion").value,

extraMethoden:document.getElementById("t_methoden_extra").value,
extraMedien:document.getElementById("t_medien_extra").value,

schwerpunkte:document.getElementById("t_schwerpunkte").value

}

s.boegen.theorie.push(data)

saveDB()
renderBoegen()
alert("Theoriebeobachtung gespeichert")

}

function savePraxis(){

let s = getStudent()
if(!s) return

if(!s.boegen) s.boegen={beratung:[],theorie:[],praxis:[]}

let data={

datum:document.getElementById("p_datum").value,
dauer:document.getElementById("p_dauer").value,
art:document.getElementById("p_art").value,
bisherigeFS:document.getElementById("p_fsanzahl").value,
schwerpunkt:document.getElementById("p_schwerpunkt").value,

wirkung:{

ruhig:document.getElementById("w_ruhig").checked,
konzentriert:document.getElementById("w_konzentriert").checked,
nervoes:document.getElementById("w_nervoes").checked,
aufgeregt:document.getElementById("w_aufgeregt").checked,
unsicher:document.getElementById("w_unsicher").checked,
uebermuetig:document.getElementById("w_uebermuetig").checked,
aengstlich:document.getElementById("w_aengstlich").checked,
unaufmerksam:document.getElementById("w_unaufmerksam").checked

},

ablauf:{

begruessung:document.getElementById("d_begruessung").checked,
anknuepfung:document.getElementById("d_anknuepfung").checked,
ziele:document.getElementById("d_ziele").checked,
wuensche:document.getElementById("d_wuensche").checked,
hinweiseVor:document.getElementById("d_hinweise_vor").checked,
hinweiseNach:document.getElementById("d_hinweise_nach").checked,
wiederholung:document.getElementById("d_wiederholung").checked,
nachbesprechung:document.getElementById("d_nachbesprechung").checked,
ausblick:document.getElementById("d_ausblick").checked,
aufgaben:document.getElementById("d_aufgaben").checked

},

aufgabe:document.getElementById("p_aufgabe").value,
notizen:document.getElementById("p_notizen").value,

einleitung:document.getElementById("p_einleitung").value,
abschluss:document.getElementById("p_abschluss").value,

vorgespraech:document.getElementById("p_vorgespräch").value,
nachgespraech:document.getElementById("p_nachgespräch").value,

dokumentation:document.getElementById("p_dokumentation").value,

route:route

}

s.boegen.praxis.push(data)

saveDB()
renderBoegen()
alert("Praxisbeobachtung gespeichert")

}

/* =============================
   BEOBACHTUNGSBÖGEN LISTE
============================= */

function renderBoegen(){

let s = getStudent()
if(!s) return

const container = document.getElementById("boegenListe")

if(!container || !s || !s.boegen) return

container.innerHTML=""

let list=[]

s.boegen.beratung.forEach(b=>{
list.push({
typ:"Beratung",
datum:b.datum || "-"
})
})

s.boegen.theorie.forEach(b=>{
list.push({
typ:"Theorieunterricht",
datum:b.datum || "-"
})
})

s.boegen.praxis.forEach(b=>{
list.push({
typ:"Praxisbeobachtung",
datum:b.datum || "-"
})
})

list.sort((a,b)=> new Date(b.datum) - new Date(a.datum))

list.forEach(e=>{

let div=document.createElement("div")

div.className="bogenEintrag"

div.innerHTML=`
<b>${e.typ}</b><br>
Datum: ${e.datum}
`

container.appendChild(div)

})

}

/* =============================
   FORMULAR
============================= */

function openAdd(){

editMode = false
current = null

document.getElementById("studentModal").classList.remove("hidden")

// Felder leeren
document.getElementById("name").value=""
document.getElementById("vorname").value=""
document.getElementById("klasse").value="B"

document.getElementById("telefon").value=""
document.getElementById("adresse").value=""
document.getElementById("vorbesitz").value=""

document.getElementById("startAusbildung").value=""
document.getElementById("pruefungTheorie").value=""
document.getElementById("pruefungPraxis").value=""

}
function editStudent(){

let s=getStudent()
if(!s) return
editMode=true

document.getElementById("studentModal").classList.remove("hidden")

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

document.getElementById("studentModal").classList.add("hidden")

}

function saveStudent(){

let data = {

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

/* Pflichtfelder */

if(!data.name || !data.vorname){
alert("Bitte Name und Vorname eingeben")
return
}

/* NEU oder EDIT */

if(editMode && current !== null){

// Bearbeiten
students[current] = {
...students[current],
...data
}

}else{

// NEU anlegen
students.push({
...data,
sonderfahrten:{ul:0,ab:0,na:0},
checkboxes:{},
fahrten:[],
boegen:{beratung:[],theorie:[],praxis:[]}
})

// 👉 WICHTIG: neuen Index setzen
current = students.length - 1

}

saveDB()
renderList()
closeAdd()

}
