let students = JSON.parse(localStorage.getItem("students") || "[]")

if(!Array.isArray(students)) students=[]

let current=null
let editMode=false

let route=[]
let watchId=null
let startTime=null

let map=null
let routeLayer=null



function saveDB(){
localStorage.setItem("students",JSON.stringify(students))
}



/* LISTE */

function renderList(){

const list=document.getElementById("studentList")

list.innerHTML=""

students.forEach((s,i)=>{

let div=document.createElement("div")

div.className="studentCard"

let name=(s.name||"")+" "+(s.vorname||"")

div.innerHTML="<b>"+name+"</b>"

div.onclick=()=>openStudent(i)

list.appendChild(div)

})

}

renderList()



/* SCHÜLER */

function openStudent(i){

current=i

let s=students[i]

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

<button onclick="editStudent()">Bearbeiten</button>

`

renderDiagram()
loadDiagram()
updateProgress()
renderFahrten()
updateStats()

showTab("info")

}



/* TABS */

function showTab(tab){

document.querySelectorAll(".tab").forEach(t=>{
t.classList.add("hidden")
})

document.getElementById(tab).classList.remove("hidden")

}



/* DIAGRAMM */

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



/* LADEN */

function loadDiagram(){

const checkboxes=document.querySelectorAll("#diagramContainer input[type='checkbox']")

checkboxes.forEach(cb=>{

let field=cb.dataset.field

cb.checked=students[current].checkboxes[field]||false

})

}



/* FORTSCHRITT */

function updateProgress(){

const checkboxes=document.querySelectorAll("#diagramContainer input[type='checkbox']")

let total=checkboxes.length
let done=0

checkboxes.forEach(cb=>{
if(cb.checked) done++
})

document.getElementById("progress").innerText="Ausbildungsfelder: "+done+" / "+total

}



/* GPS */

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

if(watchId) navigator.geolocation.clearWatch(watchId)

}



/* DISTANZ */

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



/* FAHRT */

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
updateStats()

}



/* ROUTE */

function showRoute(route){

if(!route.length) return

let coords=route.map(p=>[p.lat,p.lng])

if(!map){

map=L.map("map").setView(coords[0],13)

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{
maxZoom:19
}).addTo(map)

}

if(routeLayer) map.removeLayer(routeLayer)

routeLayer=L.polyline(coords,{color:"blue"}).addTo(map)

map.fitBounds(routeLayer.getBounds())

}



/* FAHRTEN */

function renderFahrten(){

let s=students[current]

const container=document.getElementById("fahrtenListe")

container.innerHTML=""

s.fahrten.forEach(f=>{

let div=document.createElement("div")

div.innerHTML=`
<b>${f.datum}</b> ${f.titel}<br>
${f.strecke} km | ${f.dauer} min<br>
<button onclick='showRoute(${JSON.stringify(f.route)})'>Route anzeigen</button>
`

container.appendChild(div)

})

}



/* STATISTIK */

function updateStats(){

let s=students[current]

let totalTime=0
let totalKm=0

s.fahrten.forEach(f=>{

totalTime+=f.dauer
totalKm+=parseFloat(f.strecke)

})

let hours=Math.floor(totalTime/60)
let minutes=totalTime%60

document.getElementById("stats").innerHTML=`
Fahrten: ${s.fahrten.length}<br>
Zeit: ${hours}h ${minutes}min<br>
Strecke: ${totalKm.toFixed(1)} km
`

}



/* PDF */

function exportPDF(){

let s=students[current]

const { jsPDF } = window.jspdf

let doc=new jsPDF()

doc.text("Ausbildungsbericht",20,20)

doc.text("Name: "+s.name+" "+s.vorname,20,30)

let y=50

s.fahrten.forEach(f=>{

doc.text(f.datum+" "+f.titel+" "+f.strecke+"km "+f.dauer+"min",20,y)

y+=10

})

doc.save("Ausbildung_"+s.name+".pdf")

}



/* BACKUP */

function exportBackup(){

let data=JSON.stringify(students)

let blob=new Blob([data],{type:"application/json"})

let url=URL.createObjectURL(blob)

let a=document.createElement("a")

a.href=url
a.download="fahrschueler_backup.json"

a.click()

}
