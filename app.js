
let students = JSON.parse(localStorage.getItem("students")||"[]")
let current=null

function saveDB(){localStorage.setItem("students",JSON.stringify(students))}

function renderList(){
const list=document.getElementById("list")
list.innerHTML=""
students.forEach((s,i)=>{
let div=document.createElement("div")
div.className="card"
div.innerText=s.name+" "+s.vorname
div.onclick=()=>openStudent(i)
list.appendChild(div)
})
}
renderList()

function showAdd(){
document.getElementById("add").classList.remove("hidden")
}

function saveStudent(){
let s={name:name.value,vorname:vorname.value,telefon:telefon.value,checkboxes:{}}
students.push(s)
saveDB()
location.reload()
}

function openStudent(i){
current=i
let s=students[i]
document.getElementById("studentPanel").classList.remove("hidden")
document.getElementById("studentTitle").innerText=s.name+" "+s.vorname
renderDiagram()
}

function renderDiagram(){
const container=document.getElementById("diagramm")
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

label.appendChild(cb)
label.append(" "+field)

box.appendChild(label)
box.appendChild(document.createElement("br"))

})

container.appendChild(box)

})

updateProgress()
}

document.getElementById("saveDiagramBtn").onclick=function(){

document.querySelectorAll("#diagramm input[type=checkbox]").forEach(cb=>{
let text=cb.parentElement.innerText.trim()
students[current].checkboxes[text]=cb.checked
})

saveDB()
alert("Diagramm gespeichert")
updateProgress()

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
