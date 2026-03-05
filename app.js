
let students = JSON.parse(localStorage.getItem("students")||"[]")
let current=null

function saveDB(){
localStorage.setItem("students",JSON.stringify(students))
}

function renderList(){
const list=document.getElementById("studentList")
list.innerHTML=""
students.forEach((s,i)=>{
let li=document.createElement("li")
li.textContent=s.name+" "+s.vorname
li.onclick=()=>openStudent(i)
list.appendChild(li)
})
}
renderList()

document.getElementById("addBtn").onclick=()=>{
document.getElementById("formView").classList.remove("hidden")
}

document.getElementById("saveStudent").onclick=()=>{
let s={
name:name.value,
vorname:vorname.value,
anschrift:anschrift.value,
geburt:geburt.value,
telefon:telefon.value,
vorbesitz:vorbesitz.value,
klasse:klasse.value,
checkboxes:[]
}
students.push(s)
saveDB()
location.reload()
}

function openStudent(i){
current=i
document.getElementById("studentView").classList.remove("hidden")
renderDiagramm()
}

function renderDiagramm(){
const container=document.getElementById("diagramm")
container.innerHTML=""

Object.keys(DIAGRAMM).forEach(section=>{

let box=document.createElement("div")
box.className="box"

let title=document.createElement("h3")
title.textContent=section
box.appendChild(title)

DIAGRAMM[section].forEach(text=>{

let label=document.createElement("label")
let cb=document.createElement("input")
cb.type="checkbox"
cb.className="cb"

label.appendChild(cb)
label.append(" "+text)

box.appendChild(label)
box.appendChild(document.createElement("br"))

})

container.appendChild(box)

})
updateStatus()
}

function updateStatus(){

let total=document.querySelectorAll(".cb").length
let done=document.querySelectorAll(".cb:checked").length

document.getElementById("status").innerHTML=
"<h2>Ausbildungsstand</h2>"+done+" / "+total

}

document.addEventListener("change",e=>{
if(e.target.classList.contains("cb")){
updateStatus()
}
})
