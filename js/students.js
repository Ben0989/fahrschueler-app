
function renderList(){

const list=document.getElementById("studentList")

list.innerHTML=""

students.forEach((s,i)=>{

let div=document.createElement("div")

div.innerHTML="<b>"+s.name+" "+s.vorname+"</b>"

div.onclick=()=>openStudent(i)

list.appendChild(div)

})

}

renderList()

function openAdd(){

document.getElementById("addPanel").classList.remove("hidden")

}

function closeAdd(){

document.getElementById("addPanel").classList.add("hidden")

}

function saveStudent(){

let name=document.getElementById("name").value
let vorname=document.getElementById("vorname").value
let klasse=document.getElementById("klasse").value

students.push({
name,
vorname,
klasse,
sonderfahrten:{ul:0,ab:0,na:0},
fahrten:[]
})

saveDB()

closeAdd()

renderList()

}
