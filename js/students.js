

function renderList(){

const list=document.getElementById("studentList")
list.innerHTML=""

students.forEach((s,i)=>{

let div=document.createElement("div")

div.innerHTML=`
<b>${s.name || ""} ${s.vorname || ""}</b><br>
Klasse: ${s.klasse || "-"}
`

div.onclick=()=>openStudent(i)

list.appendChild(div)

})

}

renderList()

function openAdd(){

editMode=false
document.getElementById("addPanel").classList.remove("hidden")

}

function editStudent(){

let s=students[current]

editMode=true
document.getElementById("addPanel").classList.remove("hidden")

document.getElementById("name").value=s.name||""
document.getElementById("vorname").value=s.vorname||""
document.getElementById("klasse").value=s.klasse||"B"

document.getElementById("telefon").value=s.telefon||""
document.getElementById("adresse").value=s.adresse||""
document.getElementById("vorbesitz").value=s.vorbesitz||""

document.getElementById("startAusbildung").value=s.startAusbildung||""
document.getElementById("pruefungTheorie").value=s.pruefungTheorie||""
document.getElementById("pruefungPraxis").value=s.pruefungPraxis||""

}

function closeAdd(){
document.getElementById("addPanel").classList.add("hidden")
}

function saveStudent(){

let data={

name:document.getElementById("name").value,
vorname:document.getElementById("vorname").value,
klasse:document.getElementById("klasse").value,

telefon:document.getElementById("telefon").value,
adresse:document.getElementById("adresse").value,
vorbesitz:document.getElementById("vorbesitz").value,

startAusbildung:document.getElementById("startAusbildung").value,
pruefungTheorie:document.getElementById("pruefungTheorie").value,
pruefungPraxis:document.getElementById("pruefungPraxis").value

}

if(editMode){

students[current]={...students[current],...data}

}else{

students.push({
...data,
sonderfahrten:{ul:0,ab:0,na:0},
fahrten:[]
})

}

saveDB()

closeAdd()

renderList()

}
