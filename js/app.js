console.log("APP START")

document.addEventListener("DOMContentLoaded", () => {

  console.log("DOM READY")

  const addBtn = document.getElementById("addStudentBtn")
  const modal = document.getElementById("studentModal")
  const closeBtn = document.getElementById("closeBtn")

  // Öffnen
  addBtn.addEventListener("click", () => {
    console.log("OPEN MODAL")
    modal.style.display = "flex"
  })

  // Schließen Button
  closeBtn.addEventListener("click", () => {
    modal.style.display = "none"
  })

  // Klick außerhalb schließen
  modal.addEventListener("click", (e) => {
    if(e.target === modal){
      modal.style.display = "none"
    }
  })

})
