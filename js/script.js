//ALTERNAR ENTRE MODO OSCURO Y MODO CLARO
var icon = document.getElementById("icon");


if(localStorage.getItem("theme") == null ) {
    localStorage.setItem("theme", "light");
}



let localData = localStorage.getItem("theme");

if(localData == "light"){
    icon.classList.replace("fa-sun", "fa-moon")
    document.body.classList.remove("dark-theme")
} else if (localData == "dark") {
    icon.classList.replace("fa-sun", "fa-sun")
    document.body.classList.add("dark-theme")
}

icon.onclick = function() {

    document.body.classList.toggle("dark-theme")
    //produce el cambio de ícono
    icon.classList.toggle("icon-change")
    if(document.body.classList.contains("dark-theme")){
        localStorage.setItem("theme", "dark");
        icon.classList.replace("fa-sun", "fa-moon")
        
    }
    else {
        icon.classList.replace("fa-sun", "fa-moon")
        localStorage.setItem("theme", "light");
        icon.classList.replace("fa-moon", "fa-sun")
    }
}



