
let students = JSON.parse(localStorage.getItem("students")||"[]")
let current=null

function saveDB(){
localStorage.setItem("students",JSON.stringify(students))
}

function renderList(){
const list=document.getElementById("list")
list.innerHTML=""
students.forEach((s,i)=>{
let div=document.createElement("div")
div.className="box"
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
document.getElementById("student").classList.remove("hidden")
document.getElementById("studentName").innerText=s.name+" "+s.vorname
renderDiagram()
}

function renderDiagram(){
const container=document.getElementById("diagramm")
container.innerHTML=""

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
}

label.appendChild(cb)
label.append(" "+field)

box.appendChild(label)
box.appendChild(document.createElement("br"))

})

container.appendChild(box)

})
}
