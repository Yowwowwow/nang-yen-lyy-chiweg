var box = document.getElementById("box");
function TurnBox(){
    box.classList.toggle("fixed");
    box.classList.toggle("turned");
    localStorage.setItem("orientation", box.classList.contains("turned")?"turned":"fixed");
}
if(localStorage.getItem("orientation") === "turned")TurnBox();
//Because when the page loads, the box is fixed by default.