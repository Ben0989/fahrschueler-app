
let students = JSON.parse(localStorage.getItem("students") || "[]")

if(!Array.isArray(students)) students=[]

let current=null

function saveDB(){
localStorage.setItem("students",JSON.stringify(students))
}

function showTab(tab){

document.querySelectorAll(".tab").forEach(t=>t.classList.add("hidden"))

document.getElementById(tab).classList.remove("hidden")

}

function openStudent(i){

current=i
let s=students[i]

if(!s.sonderfahrten) s.sonderfahrten={ul:0,ab:0,na:0}
if(!s.fahrten) s.fahrten=[]

document.getElementById("studentPanel").classList.remove("hidden")

document.getElementById("studentTitle").innerText=s.name+" "+s.vorname

updateProgress()

}
