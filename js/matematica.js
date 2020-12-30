const math = {};

function suma(num1, num2) {
    return num1 + num2;
}

function resta(num1, num2){
    return num1 - num2;
}

function divi(num1, num2){
    return num1 / num2;
}

function multi(num1, num2){
    return num1 * num2;
}


math.suma = suma;
math.resta = resta;
math.multi = multi;
math.divi = divi;


module.exports = math;