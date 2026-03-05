
let students = JSON.parse(localStorage.getItem("students")) || []
let activeStudent = null

const list = document.getElementById("studentList")
const search = document.getElementById("search")
const modal = document.getElementById("modal")

const addBtn = document.getElementById("addBtn")
const saveBtn = document.getElementById("saveBtn")
const cancelBtn = document.getElementById("cancelBtn")

const profile = document.getElementById("profile")
const backBtn = document.getElementById("backBtn")
const studentTitle = document.getElementById("studentTitle")

const layer = document.getElementById("checkboxLayer")

function save(){
localStorage.setItem("students",JSON.stringify(students))
}

function render(){

list.innerHTML=""

let q = search.value.toLowerCase()

students.forEach((s,i)=>{

let match =
s.name.toLowerCase().includes(q) ||
s.vorname.toLowerCase().includes(q) ||
s.telefon.toLowerCase().includes(q)

if(match){

let li=document.createElement("li")
li.innerText=s.name+" "+s.vorname+" ("+s.klasse+")"
li.onclick=()=>openStudent(i)

list.appendChild(li)

}

})

}

render()

search.addEventListener("input",render)

addBtn.onclick=()=>modal.classList.remove("hidden")
cancelBtn.onclick=()=>modal.classList.add("hidden")

saveBtn.onclick=()=>{

let s={
name:name.value,
vorname:vorname.value,
telefon:telefon.value,
klasse:klasse.value,
checkboxes:Array(235).fill(false)
}

students.push(s)
save()
modal.classList.add("hidden")
render()

}

function openStudent(i){

activeStudent=i

document.querySelector("header").style.display="none"
document.querySelector(".searchBox").style.display="none"
list.style.display="none"

profile.classList.remove("hidden")

studentTitle.innerText =
students[i].name+" "+students[i].vorname

buildDiagram()

}

function buildDiagram(){

layer.innerHTML=""

let data=students[activeStudent].checkboxes
let positions=[{'x': 2, 'y': 2}, {'x': 10, 'y': 2}, {'x': 18, 'y': 2}, {'x': 26, 'y': 2}, {'x': 34, 'y': 2}, {'x': 42, 'y': 2}, {'x': 50, 'y': 2}, {'x': 58, 'y': 2}, {'x': 66, 'y': 2}, {'x': 74, 'y': 2}, {'x': 82, 'y': 2}, {'x': 90, 'y': 2}, {'x': 2, 'y': 6}, {'x': 10, 'y': 6}, {'x': 18, 'y': 6}, {'x': 26, 'y': 6}, {'x': 34, 'y': 6}, {'x': 42, 'y': 6}, {'x': 50, 'y': 6}, {'x': 58, 'y': 6}, {'x': 66, 'y': 6}, {'x': 74, 'y': 6}, {'x': 82, 'y': 6}, {'x': 90, 'y': 6}, {'x': 2, 'y': 10}, {'x': 10, 'y': 10}, {'x': 18, 'y': 10}, {'x': 26, 'y': 10}, {'x': 34, 'y': 10}, {'x': 42, 'y': 10}, {'x': 50, 'y': 10}, {'x': 58, 'y': 10}, {'x': 66, 'y': 10}, {'x': 74, 'y': 10}, {'x': 82, 'y': 10}, {'x': 90, 'y': 10}, {'x': 2, 'y': 14}, {'x': 10, 'y': 14}, {'x': 18, 'y': 14}, {'x': 26, 'y': 14}, {'x': 34, 'y': 14}, {'x': 42, 'y': 14}, {'x': 50, 'y': 14}, {'x': 58, 'y': 14}, {'x': 66, 'y': 14}, {'x': 74, 'y': 14}, {'x': 82, 'y': 14}, {'x': 90, 'y': 14}, {'x': 2, 'y': 18}, {'x': 10, 'y': 18}, {'x': 18, 'y': 18}, {'x': 26, 'y': 18}, {'x': 34, 'y': 18}, {'x': 42, 'y': 18}, {'x': 50, 'y': 18}, {'x': 58, 'y': 18}, {'x': 66, 'y': 18}, {'x': 74, 'y': 18}, {'x': 82, 'y': 18}, {'x': 90, 'y': 18}, {'x': 2, 'y': 22}, {'x': 10, 'y': 22}, {'x': 18, 'y': 22}, {'x': 26, 'y': 22}, {'x': 34, 'y': 22}, {'x': 42, 'y': 22}, {'x': 50, 'y': 22}, {'x': 58, 'y': 22}, {'x': 66, 'y': 22}, {'x': 74, 'y': 22}, {'x': 82, 'y': 22}, {'x': 90, 'y': 22}, {'x': 2, 'y': 26}, {'x': 10, 'y': 26}, {'x': 18, 'y': 26}, {'x': 26, 'y': 26}, {'x': 34, 'y': 26}, {'x': 42, 'y': 26}, {'x': 50, 'y': 26}, {'x': 58, 'y': 26}, {'x': 66, 'y': 26}, {'x': 74, 'y': 26}, {'x': 82, 'y': 26}, {'x': 90, 'y': 26}, {'x': 2, 'y': 30}, {'x': 10, 'y': 30}, {'x': 18, 'y': 30}, {'x': 26, 'y': 30}, {'x': 34, 'y': 30}, {'x': 42, 'y': 30}, {'x': 50, 'y': 30}, {'x': 58, 'y': 30}, {'x': 66, 'y': 30}, {'x': 74, 'y': 30}, {'x': 82, 'y': 30}, {'x': 90, 'y': 30}, {'x': 2, 'y': 34}, {'x': 10, 'y': 34}, {'x': 18, 'y': 34}, {'x': 26, 'y': 34}, {'x': 34, 'y': 34}, {'x': 42, 'y': 34}, {'x': 50, 'y': 34}, {'x': 58, 'y': 34}, {'x': 66, 'y': 34}, {'x': 74, 'y': 34}, {'x': 82, 'y': 34}, {'x': 90, 'y': 34}, {'x': 2, 'y': 38}, {'x': 10, 'y': 38}, {'x': 18, 'y': 38}, {'x': 26, 'y': 38}, {'x': 34, 'y': 38}, {'x': 42, 'y': 38}, {'x': 50, 'y': 38}, {'x': 58, 'y': 38}, {'x': 66, 'y': 38}, {'x': 74, 'y': 38}, {'x': 82, 'y': 38}, {'x': 90, 'y': 38}, {'x': 2, 'y': 42}, {'x': 10, 'y': 42}, {'x': 18, 'y': 42}, {'x': 26, 'y': 42}, {'x': 34, 'y': 42}, {'x': 42, 'y': 42}, {'x': 50, 'y': 42}, {'x': 58, 'y': 42}, {'x': 66, 'y': 42}, {'x': 74, 'y': 42}, {'x': 82, 'y': 42}, {'x': 90, 'y': 42}, {'x': 2, 'y': 46}, {'x': 10, 'y': 46}, {'x': 18, 'y': 46}, {'x': 26, 'y': 46}, {'x': 34, 'y': 46}, {'x': 42, 'y': 46}, {'x': 50, 'y': 46}, {'x': 58, 'y': 46}, {'x': 66, 'y': 46}, {'x': 74, 'y': 46}, {'x': 82, 'y': 46}, {'x': 90, 'y': 46}, {'x': 2, 'y': 50}, {'x': 10, 'y': 50}, {'x': 18, 'y': 50}, {'x': 26, 'y': 50}, {'x': 34, 'y': 50}, {'x': 42, 'y': 50}, {'x': 50, 'y': 50}, {'x': 58, 'y': 50}, {'x': 66, 'y': 50}, {'x': 74, 'y': 50}, {'x': 82, 'y': 50}, {'x': 90, 'y': 50}, {'x': 2, 'y': 54}, {'x': 10, 'y': 54}, {'x': 18, 'y': 54}, {'x': 26, 'y': 54}, {'x': 34, 'y': 54}, {'x': 42, 'y': 54}, {'x': 50, 'y': 54}, {'x': 58, 'y': 54}, {'x': 66, 'y': 54}, {'x': 74, 'y': 54}, {'x': 82, 'y': 54}, {'x': 90, 'y': 54}, {'x': 2, 'y': 58}, {'x': 10, 'y': 58}, {'x': 18, 'y': 58}, {'x': 26, 'y': 58}, {'x': 34, 'y': 58}, {'x': 42, 'y': 58}, {'x': 50, 'y': 58}, {'x': 58, 'y': 58}, {'x': 66, 'y': 58}, {'x': 74, 'y': 58}, {'x': 82, 'y': 58}, {'x': 90, 'y': 58}, {'x': 2, 'y': 62}, {'x': 10, 'y': 62}, {'x': 18, 'y': 62}, {'x': 26, 'y': 62}, {'x': 34, 'y': 62}, {'x': 42, 'y': 62}, {'x': 50, 'y': 62}, {'x': 58, 'y': 62}, {'x': 66, 'y': 62}, {'x': 74, 'y': 62}, {'x': 82, 'y': 62}, {'x': 90, 'y': 62}, {'x': 2, 'y': 66}, {'x': 10, 'y': 66}, {'x': 18, 'y': 66}, {'x': 26, 'y': 66}, {'x': 34, 'y': 66}, {'x': 42, 'y': 66}, {'x': 50, 'y': 66}, {'x': 58, 'y': 66}, {'x': 66, 'y': 66}, {'x': 74, 'y': 66}, {'x': 82, 'y': 66}, {'x': 90, 'y': 66}, {'x': 2, 'y': 70}, {'x': 10, 'y': 70}, {'x': 18, 'y': 70}, {'x': 26, 'y': 70}, {'x': 34, 'y': 70}, {'x': 42, 'y': 70}, {'x': 50, 'y': 70}, {'x': 58, 'y': 70}, {'x': 66, 'y': 70}, {'x': 74, 'y': 70}, {'x': 82, 'y': 70}, {'x': 90, 'y': 70}, {'x': 2, 'y': 74}, {'x': 10, 'y': 74}, {'x': 18, 'y': 74}, {'x': 26, 'y': 74}, {'x': 34, 'y': 74}, {'x': 42, 'y': 74}, {'x': 50, 'y': 74}, {'x': 58, 'y': 74}, {'x': 66, 'y': 74}, {'x': 74, 'y': 74}, {'x': 82, 'y': 74}, {'x': 90, 'y': 74}, {'x': 2, 'y': 78}, {'x': 10, 'y': 78}, {'x': 18, 'y': 78}, {'x': 26, 'y': 78}, {'x': 34, 'y': 78}, {'x': 42, 'y': 78}, {'x': 50, 'y': 78}]

positions.forEach((p,i)=>{

let cb=document.createElement("input")
cb.type="checkbox"
cb.className="cb"
cb.style.left=p.x+"%"
cb.style.top=p.y+"%"
cb.checked=data[i]

cb.onchange=()=>{
data[i]=cb.checked
save()
}

layer.appendChild(cb)

})

}

backBtn.onclick=()=>{

profile.classList.add("hidden")

document.querySelector("header").style.display="flex"
document.querySelector(".searchBox").style.display="block"
list.style.display="block"

}
