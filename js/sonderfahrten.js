
function changeDrive(type,val){

let s=students[current]

if(!s.sonderfahrten) s.sonderfahrten={ul:0,ab:0,na:0}

s.sonderfahrten[type]+=val

if(s.sonderfahrten[type]<0) s.sonderfahrten[type]=0

saveDB()

updateProgress()

}

function updateProgress(){

let s=students[current]

document.getElementById("ueberlandCount").innerText=s.sonderfahrten.ul
document.getElementById("autobahnCount").innerText=s.sonderfahrten.ab
document.getElementById("nachtCount").innerText=s.sonderfahrten.na

}
