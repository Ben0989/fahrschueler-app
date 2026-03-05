
let students = JSON.parse(localStorage.getItem("students")||"[]")
let current = null

const list = document.getElementById("studentList")

function saveDB(){
localStorage.setItem("students",JSON.stringify(students))
}

function renderList(){

list.innerHTML=""

students.forEach((s,i)=>{

let li=document.createElement("li")
li.textContent=s.name+" "+s.vorname+" ("+s.telefon+")"

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
sehJa:sehJa.checked,
sehNein:sehNein.checked,
beginn:beginn.value,
pruefung:pruefung.value,

checkboxes:[],

sonder:{
ue:0,
ab:0,
nacht:0
}

}

students.push(s)

saveDB()

location.reload()

}

function openStudent(i){

current=i

let s=students[i]

document.getElementById("studentView").classList.remove("hidden")
document.getElementById("listView").classList.add("hidden")

document.getElementById("info").innerHTML=`

<h2>${s.name} ${s.vorname}</h2>

<p>${s.anschrift}</p>

<p>${s.telefon}</p>

<p>Klasse ${s.klasse}</p>

<p>Beginn ${s.beginn}</p>

`

}

document.querySelectorAll(".tabs button").forEach(b=>{

b.onclick=()=>{

document.querySelectorAll(".tab").forEach(t=>t.classList.add("hidden"))

document.getElementById(b.dataset.tab).classList.remove("hidden")

}

})

document.querySelectorAll(".plus").forEach(btn=>{

btn.onclick=()=>{

let t=btn.dataset.type

students[current].sonder[t]++

document.getElementById(t).textContent=students[current].sonder[t]

saveDB()

}

})

document.querySelectorAll(".minus").forEach(btn=>{

btn.onclick=()=>{

let t=btn.dataset.type

students[current].sonder[t]--

if(students[current].sonder[t]<0)students[current].sonder[t]=0

document.getElementById(t).textContent=students[current].sonder[t]

saveDB()

}

})

document.getElementById("saveDiagramm").onclick=()=>{

let c=[...document.querySelectorAll(".cb")].map(x=>x.checked)

students[current].checkboxes=c

saveDB()

alert("Diagramm gespeichert")

}

function updateStatus(){

let total=document.querySelectorAll(".cb").length

let done=[...document.querySelectorAll(".cb")].filter(x=>x.checked).length

document.getElementById("status").innerHTML=`

<h2>Ausbildungsstand</h2>

<p>${done} / ${total} Aufgaben erledigt</p>

`

}

document.querySelectorAll(".cb").forEach(c=>{

c.onchange=updateStatus

})

