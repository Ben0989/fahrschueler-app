
let students = JSON.parse(localStorage.getItem("students")||"[]")
let current=null

function saveDB(){localStorage.setItem("students",JSON.stringify(students))}

function renderList(){
const list=document.getElementById("list")
list.innerHTML=""
students.forEach((s,i)=>{
let div=document.createElement("div")
div.className="card"
div.innerText=s.name+" "+s.vorname+" ("+s.telefon+")"
div.onclick=()=>openStudent(i)
list.appendChild(div)
})
}
renderList()

function showAdd(){
document.getElementById("add").classList.remove("hidden")
}

function saveStudent(){
let s={
name:name.value,
vorname:vorname.value,
telefon:telefon.value,
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
renderDiagram()
}

function renderDiagram(){
const container=document.getElementById("diagramm")
container.innerHTML=""
container.className="grid"

Object.keys(DIAGRAMM).forEach(section=>{

let box=document.createElement("div")
box.className="box"

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
saveDB()
updateProgress()
if(cb.checked){label.classList.add("done")}else{label.classList.remove("done")}
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
