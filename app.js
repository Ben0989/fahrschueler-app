
let students = JSON.parse(localStorage.getItem("students")) || []
let activeStudent = null

const list = document.getElementById("studentList")
const modal = document.getElementById("modal")
const profile = document.getElementById("profile")

function save(){
localStorage.setItem("students",JSON.stringify(students))
}

function renderList(){
list.innerHTML=""
students.forEach((s,i)=>{

let li=document.createElement("li")
li.innerHTML=s.name+" "+s.vorname+" ("+s.klasse+")"
li.onclick=()=>openProfile(i)

list.appendChild(li)

})
}

renderList()

document.getElementById("addBtn").onclick=()=>{
modal.classList.remove("hidden")
}

document.getElementById("cancelBtn").onclick=()=>{
modal.classList.add("hidden")
}

document.getElementById("saveBtn").onclick=()=>{

let s={

name:name.value,
vorname:vorname.value,
anschrift:anschrift.value,
telefon:telefon.value,
klasse:klasse.value,
sehhilfe:sehhilfe.value,
beginn:beginn.value,
pruefung:pruefung.value,

checkboxes:Array(235).fill(false),
ue:0,
ab:0,
na:0

}

students.push(s)
save()
modal.classList.add("hidden")
renderList()

}

function openProfile(i){

activeStudent=i

list.style.display="none"
profile.classList.remove("hidden")

loadInfos()
loadCheckboxes()

}

function loadInfos(){

let s=students[activeStudent]

infos.innerHTML=`
Name: ${s.name}<br>
Vorname: ${s.vorname}<br>
Telefon: ${s.telefon}<br>
Klasse: ${s.klasse}<br>
Beginn: ${s.beginn}<br>
Prüfung: ${s.pruefung}
`

}

function loadCheckboxes(){

let s=students[activeStudent]

checkboxContainer.innerHTML=""

for(let i=0;i<235;i++){

let c=document.createElement("input")
c.type="checkbox"
c.checked=s.checkboxes[i]

c.onchange=()=>{

s.checkboxes[i]=c.checked
save()

}

checkboxContainer.appendChild(c)

}

ue.innerText=s.ue
ab.innerText=s.ab
na.innerText=s.na

}

function change(type,val){

let s=students[activeStudent]

if(type=="ue"){ s.ue=Math.max(0,s.ue+val) }
if(type=="ab"){ s.ab=Math.max(0,s.ab+val) }
if(type=="na"){ s.na=Math.max(0,s.na+val) }

save()
loadCheckboxes()

}

document.getElementById("backBtn").onclick=()=>{

profile.classList.add("hidden")
list.style.display="block"

}

document.querySelectorAll(".tabBtn").forEach(b=>{

b.onclick=()=>{

document.querySelectorAll(".tab").forEach(t=>t.classList.add("hidden"))
document.getElementById(b.dataset.tab).classList.remove("hidden")

}

})

if("serviceWorker" in navigator){
navigator.serviceWorker.register("service-worker.js")
}
