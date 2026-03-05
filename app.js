
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
checkboxes:Array(100).fill(false)
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

document.querySelectorAll("input[type=checkbox]").forEach(cb=>{

let id=cb.dataset.id

cb.checked = students[i].checkboxes[id]

cb.onchange=()=>{

students[i].checkboxes[id]=cb.checked
save()

}

})

}

backBtn.onclick=()=>{

profile.classList.add("hidden")

document.querySelector("header").style.display="flex"
document.querySelector(".searchBox").style.display="block"
list.style.display="block"

}
