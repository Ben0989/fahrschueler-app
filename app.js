
let students = JSON.parse(localStorage.getItem("fahrschuelerDB")) || []
let current=null

function saveDB(){
localStorage.setItem("fahrschuelerDB",JSON.stringify(students))
}

function renderList(){

let list=document.getElementById("studentList")
list.innerHTML=""

students.forEach((s,i)=>{

let d=document.createElement("div")
d.innerText=s.name+" "+s.vorname
d.onclick=()=>openStudent(i)

list.appendChild(d)

})

}

document.getElementById("addBtn").onclick=()=>{
document.getElementById("formModal").classList.remove("hidden")
}

document.getElementById("cancel").onclick=()=>{
document.getElementById("formModal").classList.add("hidden")
}

document.getElementById("saveStudent").onclick=()=>{

let s={

name:name.value,
vorname:vorname.value,
anschrift:anschrift.value,
telefon:telefon.value,
klasse:klasse.value,

checkboxes:Array(235).fill(false),

sonder:{ue:0,ab:0,nacht:0}

}

students.push(s)

saveDB()

document.getElementById("formModal").classList.add("hidden")

renderList()

}

function openStudent(i){

current=i

document.getElementById("profile").classList.remove("hidden")

showTab("infos")

renderInfos()
renderCounters()

document.querySelectorAll("input[type=checkbox]").forEach(cb=>{

let id=cb.dataset.id

if(id){

cb.checked=students[current].checkboxes[id]

cb.onchange=()=>{

students[current].checkboxes[id]=cb.checked

saveDB()

}

}

})

}

function renderInfos(){

let s=students[current]

document.getElementById("infos").innerHTML=`
<h3>${s.name} ${s.vorname}</h3>
<p>${s.anschrift}</p>
<p>Klasse: ${s.klasse}</p>
`

}

function showTab(t){

document.querySelectorAll(".tab").forEach(x=>x.style.display="none")

document.getElementById(t).style.display="block"

}

function change(type,val){

let s=students[current]

let max={B:{ue:5,ab:4,nacht:3},BE:{ue:3,ab:1,nacht:1},L:{ue:0,ab:0,nacht:0}}

let limit=max[s.klasse][type]

s.sonder[type]+=val

if(s.sonder[type]<0)s.sonder[type]=0
if(s.sonder[type]>limit)s.sonder[type]=limit

saveDB()

renderCounters()

}

function renderCounters(){

let s=students[current]

document.getElementById("ue").innerText=s.sonder.ue
document.getElementById("ab").innerText=s.sonder.ab
document.getElementById("nacht").innerText=s.sonder.nacht

}

renderList()
