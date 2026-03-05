
let students = JSON.parse(localStorage.getItem("fahrschuelerDB")) || [];

let current = null;

function saveDB(){
localStorage.setItem("fahrschuelerDB", JSON.stringify(students));
}

function renderList(){

let list = document.getElementById("studentList");
list.innerHTML = "";

students.forEach((s,i)=>{

let div = document.createElement("div");
div.innerText = s.name+" "+s.vorname;

div.onclick=()=>openStudent(i);

list.appendChild(div);

});

}

document.getElementById("addBtn").onclick=()=>{

document.getElementById("formModal").classList.remove("hidden");

};

document.getElementById("cancel").onclick=()=>{

document.getElementById("formModal").classList.add("hidden");

};

document.getElementById("saveStudent").onclick=()=>{

let student={

name:document.getElementById("name").value,
vorname:document.getElementById("vorname").value,
anschrift:document.getElementById("anschrift").value,
geburt:document.getElementById("geburt").value,
telefon:document.getElementById("telefon").value,
vorbesitz:document.getElementById("vorbesitz").value,
klasse:document.getElementById("klasse").value,
seh:document.getElementById("sehJa").checked?"ja":"nein",
beginn:document.getElementById("beginn").value,
pruefung:document.getElementById("pruefung").value,

checkboxes:Array(235).fill(false),

sonder:{ue:0,ab:0,nacht:0}

};

students.push(student);

saveDB();

document.getElementById("formModal").classList.add("hidden");

renderList();

};

function openStudent(i){

current=i;

document.getElementById("profile").classList.remove("hidden");

showTab("infos");

renderInfos();

renderCounters();

}

function renderInfos(){

let s = students[current];

document.getElementById("infos").innerHTML = `
<h3>${s.name} ${s.vorname}</h3>
<p>${s.anschrift}</p>
<p>${s.telefon}</p>
<p>Klasse: ${s.klasse}</p>
`;

}

function showTab(t){

document.querySelectorAll(".tab").forEach(x=>x.style.display="none");

document.getElementById(t).style.display="block";

}

function change(type,val){

let s = students[current];

let max={B:{ue:5,ab:4,nacht:3},BE:{ue:3,ab:1,nacht:1},L:{ue:0,ab:0,nacht:0}};

let limit=max[s.klasse][type];

s.sonder[type]+=val;

if(s.sonder[type]<0)s.sonder[type]=0;
if(s.sonder[type]>limit)s.sonder[type]=limit;

saveDB();

renderCounters();

}

function renderCounters(){

let s=students[current];

document.getElementById("ue").innerText=s.sonder.ue;
document.getElementById("ab").innerText=s.sonder.ab;
document.getElementById("nacht").innerText=s.sonder.nacht;

}

renderList();
