
let students = JSON.parse(localStorage.getItem("students")) || []
let activeStudent=null

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

let match=
s.name.toLowerCase().includes(filter)||
s.vorname.toLowerCase().includes(filter)||
s.telefon.toLowerCase().includes(filter)

if(match){

let li=document.createElement("li")
li.innerHTML=`${s.name} ${s.vorname} (${s.klasse})`
li.onclick=()=>openProfile(i)

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
telefon:telefon.value,
klasse:klasse.value,
beginn:beginn.value,

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
studentList.style.display="none"
profile.classList.remove("hidden")

infos.innerHTML=`
<b>${students[i].name} ${students[i].vorname}</b><br>
Telefon: ${students[i].telefon}<br>
Klasse: ${students[i].klasse}
`

buildCheckboxes()

}

function buildCheckboxes(){

let sections=[
"grundstufe",
"aufbaustufe",
"leistungsstufe",
"grundaufgaben",
"situativ"
]

let index=0

sections.forEach(sec=>{

let container=document.getElementById(sec)
container.innerHTML=""

for(let i=0;i<20;i++){

let c=document.createElement("input")
c.type="checkbox"
c.checked=students[activeStudent].checkboxes[index]

c.onchange=()=>{

students[activeStudent].checkboxes[index]=c.checked
save()

}

container.appendChild(c)
index++

}

})

ue.innerText=students[activeStudent].ue
ab.innerText=students[activeStudent].ab
na.innerText=students[activeStudent].na

}

function change(type,val){

let s=students[activeStudent]

let max={ue:5,ab:4,na:3}

if(s.klasse=="BE"){
max={ue:3,ab:1,na:1}
}

if(type=="ue") s.ue=Math.min(max.ue,Math.max(0,s.ue+val))
if(type=="ab") s.ab=Math.min(max.ab,Math.max(0,s.ab+val))
if(type=="na") s.na=Math.min(max.na,Math.max(0,s.na+val))

save()

ue.innerText=s.ue
ab.innerText=s.ab
na.innerText=s.na

}

function exportPDF(){

const { jsPDF } = window.jspdf

let s=students[activeStudent]

let pdf=new jsPDF()

pdf.text("BVF Ausbildungsdiagrammkarte",20,20)

pdf.text("Name: "+s.name+" "+s.vorname,20,40)
pdf.text("Telefon: "+s.telefon,20,50)
pdf.text("Klasse: "+s.klasse,20,60)

pdf.text("Überland: "+s.ue,20,80)
pdf.text("Autobahn: "+s.ab,20,90)
pdf.text("Nacht: "+s.na,20,100)

pdf.text("Erledigte Aufgaben: "+s.checkboxes.filter(x=>x).length+"/235",20,120)

pdf.save("diagrammkarte.pdf")

}

backBtn.onclick=()=>{

profile.classList.add("hidden")
studentList.style.display="block"

}

document.querySelectorAll(".tabBtn").forEach(b=>{

b.onclick=()=>{

document.querySelectorAll(".tab").forEach(t=>t.classList.add("hidden"))
document.getElementById(b.dataset.tab).classList.remove("hidden")

}

})
