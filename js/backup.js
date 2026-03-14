
function backupData(){

let data=JSON.stringify(students,null,2)

let blob=new Blob([data],{type:"application/json"})

let a=document.createElement("a")

a.href=URL.createObjectURL(blob)
a.download="fahrschueler_backup.json"

a.click()

}
