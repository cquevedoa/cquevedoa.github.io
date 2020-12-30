window.addEventListener("load", function(){
    resaltador();
})

function saludar() {
    

    let popUp = document.querySelector("#modal");
    popUp.style.display = "block";
    // popUp.classList.toggle("popUp");

}


function cerrar() {
    let popUp = document.querySelector("#modal");
    popUp.style.display = "none";
}


function obtenerMail() {
    //Obtener elementos del DOM
    let inputMail = document.querySelector("#correo");

    //obtener el valor del mail
    alert(`El correo ${inputMail.value} se suscribió al Newsletter exitosamente`);
    

}
// Elemento al que queremos vincular un evento
    let btnSuscribir = document.querySelector("#btn-suscribir");

// Especificar dos parametros: el tipo de evento y la función
// la funcion sin paréntesis para queno se ejecute de forma automática
    btnSuscribir.addEventListener("click", obtenerMail);


    //VARIOS ELEMENTOS

    let parrafos = document.querySelectorAll("p");

  for (let i = 0; i < parrafos.length; i++) {
      parrafos[i].addEventListener("mouseover", function(){
        //   this.style.backgroundColor = "yellow";
        this.classList.toggle("resaltar");
      })
      
  }
