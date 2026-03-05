
let students = JSON.parse(localStorage.getItem("students")) || []

const list=document.getElementById("studentList")
const modal=document.getElementById("modal")
const searchBox=document.getElementById("searchBox")

function save(){
localStorage.setItem("students",JSON.stringify(students))
}

function renderList(){

list.innerHTML=""

let filter=searchBox.value.toLowerCase()

students.forEach((s,i)=>{

let match = 
s.name.toLowerCase().includes(filter) ||
s.vorname.toLowerCase().includes(filter) ||
s.telefon.toLowerCase().includes(filter) ||
s.anschrift.toLowerCase().includes(filter) ||
s.klasse.toLowerCase().includes(filter)

if(match){

let li=document.createElement("li")

li.innerHTML=`
<b>${s.name} ${s.vorname}</b><br>
Telefon: ${s.telefon}<br>
Klasse ${s.klasse}
`

list.appendChild(li)

}

})

}

renderList()

searchBox.addEventListener("input",renderList)

addBtn.onclick=()=>modal.classList.remove("hidden")
cancelBtn.onclick=()=>modal.classList.add("hidden")

saveBtn.onclick=()=>{

let s={
name:name.value,
vorname:vorname.value,
anschrift:anschrift.value,
telefon:telefon.value,
klasse:klasse.value,
sehhilfe:sehhilfe.value,
beginn:beginn.value,
pruefung:pruefung.value
}

students.push(s)

save()

modal.classList.add("hidden")

renderList()

}
