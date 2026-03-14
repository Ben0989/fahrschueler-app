
function saveFahrt(){

let s=students[current]

let fahrt={
datum:new Date().toISOString().split("T")[0],
titel:document.getElementById("fahrtTitel").value,
notiz:document.getElementById("fahrtNotiz").value
}

s.fahrten.push(fahrt)

saveDB()

}
