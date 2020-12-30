// const matematica = require('./matematica');

// console.log(matematica.resta(10,4));

// console.log(matematica.suma(9,30));

// console.log(matematica.multi(7,93));

// console.log(matematica.divi(10,81));

// const os = require('os');

// console.log(os.arch());

// const http = require('http');

// const server = http.createServer((req,res)=>{
//     res.writeHead(200, {'content-type':'text/plain'});
//     res.write('Hola Mundo Cruel');
//     res.end();
// })

// server.listen(8080,()=>{
//     console.log('Escuchando por el puerto 8080...')
// })

const express = require('express');
	
	//crea el servidor y configuralo
    const app = express();
    
    //configuramos la ruta raiz de nuestra app
	app.get('/',(req,res)=>{
		res.send();

	});


	app.listen(8080),()=> {
	console.log('Escuchando');
	})