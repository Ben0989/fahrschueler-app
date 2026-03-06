
let students = JSON.parse(localStorage.getItem("students")||"[]")
let current=null

function saveDB(){
localStorage.setItem("students",JSON.stringify(students))
}

function renderList(){
const list=document.getElementById("list")
list.innerHTML=""
students.forEach((s,i)=>{
let d=document.createElement("div")
d.innerText=s.name+" "+s.vorname
d.onclick=()=>openStudent(i)
list.appendChild(d)
})
}

renderList()

function showAdd(){
document.getElementById("addPanel").classList.remove("hidden")
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
sehja:sehja.checked,
sehnein:sehnein.checked,
beginn:beginn.value,
pruefung:pruefung.value,
checkboxes:{}
}

students.push(s)
saveDB()
location.reload()

}

function openStudent(i){

current=i
let s=students[i]

document.getElementById("studentPanel").classList.remove("hidden")
document.getElementById("studentTitle").innerText=s.name+" "+s.vorname

document.getElementById("info").innerHTML=`
<p>${s.anschrift}</p>
<p>${s.telefon}</p>
<p>Klasse ${s.klasse}</p>
`

renderDiagram()

}

function showTab(t){

document.querySelectorAll(".tab").forEach(x=>x.classList.add("hidden"))
document.getElementById(t).classList.remove("hidden")

}

function renderDiagram(){

let container=document.getElementById("diagramContainer")
container.innerHTML=""

Object.keys(DIAGRAMM).forEach((section,index)=>{

let box=document.createElement("div")
box.className="box"

if(index==0)box.classList.add("grund")
if(index==1)box.classList.add("aufbau")
if(index==2)box.classList.add("leistung")
if(index==3)box.classList.add("grundaufgaben")

let h=document.createElement("h3")
h.innerText=section
box.appendChild(h)

DIAGRAMM[section].forEach(field=>{

let label=document.createElement("label")
let cb=document.createElement("input")
cb.type="checkbox"

cb.checked = students[current].checkboxes[field] || false

cb.onchange=()=>{
students[current].checkboxes[field]=cb.checked
updateProgress()
}

label.appendChild(cb)
label.append(" "+field)

if(cb.checked)label.classList.add("done")

box.appendChild(label)
box.appendChild(document.createElement("br"))

})

container.appendChild(box)

})

updateProgress()

}

function saveDiagram(){

saveDB()
alert("Diagramm gespeichert")

}

function updateProgress(){

let total=0
let done=0

Object.keys(DIAGRAMM).forEach(s=>{
DIAGRAMM[s].forEach(f=>{
total++
if(students[current].checkboxes[f])done++
})
})

document.getElementById("progress").innerText="Ausbildungsfelder: "+done+" / "+total

}
