let posicionar = "";
let inicio;
let filas = 7;
let columnas = 7;
let fin;

let tablero = [];


$(document).ready(() => {

    reiniciarTablero();
    $("#obstaculo").on("click", (event) => {
        posicionar = "obstaculo";
        $("#obstaculo").addClass("btn-selected");
        $("#inicio").removeClass("btn-selected");
        $("#fin").removeClass("btn-selected");

    });

    $("#reiniciar").on("click", (event) => {
        reiniciarTablero();
        inicio = undefined;
        final = undefined;
        for (let i = 0; i < filas; ++i) {
            for (let j = 0; j < columnas; ++j) {
                $("#" + i + "_" + j).empty().removeClass("celdaMarcada");
            }
        }
    });

    $("#inicio").on("click", (event) => {
        posicionar = "inicio";
        $("#obstaculo").removeClass("btn-selected");
        $("#inicio").addClass("btn-selected");
        $("#fin").removeClass("btn-selected");
    });

    $("#fin").on("click", (event) => {
        posicionar = "fin";
        $("#obstaculo").removeClass("btn-selected");
        $("#inicio").removeClass("btn-selected");
        $("#fin").addClass("btn-selected");
    });

    $("#empezar").on("click", (event) => {
        if (inicio && fin) {
            reiniciarDatosTablero();
            limpiarCaminos();
            marcarCaminos();
            let auxInicio = { fila: inicio.fila, columna: inicio.columna };
            algoritmoAEstrella(auxInicio, fin, {});
            pintarCaminos(tablero[fin.fila][fin.columna].padre);
            console.log(tablero);
        } else {
            alert("No has marcado un inicio y un final");
        }
    });

    $("#tablero").on("click", "td", (event) => {
        let celda = $(event.target);
        if (posicionar === "obstaculo") {
            if (celda.data("fila") !== undefined) {
                celda.append($("<img>").prop("src", "imagenes/obstaculo.png").addClass("imagen"));
                celda.css("padding", "16px");
                tablero[celda.data("fila")][celda.data("columna")].obstaculo = true;
            }
        } else if (posicionar === "inicio") {
            if (inicio) {
                $("#" + inicio.fila + "_" + inicio.columna).children().eq(0).remove();
            }
            celda.append($("<img>").prop("src", "imagenes/inicio.png").addClass("imagen"));
            celda.css("padding", "16px");
            inicio = { fila: celda.data("fila"), columna: celda.data("columna") };
        } else if (posicionar === "fin") {
            if (fin) {
                $("#" + fin.fila + "_" + fin.columna).children().eq(0).remove();
            }
            celda.append($("<img>").prop("src", "imagenes/fin.png").addClass("imagen"));
            celda.css("padding", "16px");
            fin = { fila: celda.data("fila"), columna: celda.data("columna") };

        }
    });



    $("#tablero").on("click", "img", (event) => {
        let celda = $(event.target).parent();
        if (tablero[celda.data("fila")][celda.data("columna")].obstaculo) {
            tablero[celda.data("fila")][celda.data("columna")].obstaculo = false
            $("#" + celda.data("fila") + "_" + celda.data("columna")).children().eq(0).remove();
        }

    });






});

function marcarCaminos() {
    for (let i = 0; i < filas; ++i) {
        for (let j = 0; j < columnas; ++j) {
            tablero[i][j].caminos = [];
            comprobarCaminos(i, j);
            tablero[i][j].valor = Math.sqrt(((i - fin.fila) * (i - fin.fila)) + ((j - fin.columna) * (j - fin.columna)));
        }
    }
    console.log(tablero);
}

function comprobarCaminos(i, j) {
    for (let auxi = i - 1; auxi <= i + 1; ++auxi) {
        for (let auxj = j - 1; auxj <= j + 1; ++auxj) {
            if (auxi >= 0 && auxi < filas && auxj >= 0 && auxj < columnas && (auxi != i || auxj != j)) {
                if (!tablero[auxi][auxj].obstaculo) {
                    tablero[i][j].caminos.push({ fila: auxi, columna: auxj });
                    if (i === auxi || j === auxj) {
                        tablero[i][j].caminos[tablero[i][j].caminos.length - 1].distancia = 1;
                    } else {
                        tablero[i][j].caminos[tablero[i][j].caminos.length - 1].distancia = Math.sqrt(2);
                    }
                }
            }
        }
    }
}

function algoritmoAEstrella(nodoActual, nodoFinal, abierta) {
    tablero[nodoActual.fila][nodoActual.columna].cerrada = true;
    //Expandimos el nodo actual y lo guardamos en abierta
    if (nodoFinal.fila !== nodoActual.fila || nodoFinal.columna !== nodoActual.columna) {
        tablero[nodoActual.fila][nodoActual.columna].caminos.forEach(camino => {
            let f = tablero[nodoActual.fila][nodoActual.columna].padre.fila;
            let c = tablero[nodoActual.fila][nodoActual.columna].padre.columna;
            let cerrada = tablero[camino.fila][camino.columna].cerrada;
            if (((camino.fila !== f || camino.columna !== c) && !cerrada && (abierta["" + (camino.fila * columnas + camino.columna)] && tablero[nodoActual.fila][nodoActual.columna].valorAcum + camino.distancia < tablero[camino.fila][camino.columna].valorAcum)) || ((camino.fila !== f || camino.columna !== c) && !cerrada && !(abierta["" + (camino.fila * columnas + camino.columna)]))) {
                tablero[camino.fila][camino.columna].valorAcum = tablero[nodoActual.fila][nodoActual.columna].valorAcum + camino.distancia;
                abierta["" + (camino.fila * columnas + camino.columna)] = tablero[camino.fila][camino.columna].valorAcum + tablero[camino.fila][camino.columna].valor;
                tablero[camino.fila][camino.columna].padre.fila = nodoActual.fila;
                tablero[camino.fila][camino.columna].padre.columna = nodoActual.columna;
            }
        });

    }

    let nodosAbierta = Object.keys(abierta);
    let minimo = Number.POSITIVE_INFINITY;
    let nodoMinimo;
    if (nodosAbierta.length !== 0) {
        nodosAbierta.forEach(nodo => {
            if (abierta[nodo] < minimo) {
                minimo = abierta[nodo];
                nodoMinimo = nodo;
            }
        });
        delete abierta[nodoMinimo];
        nodoMinimo = Number(nodoMinimo);
        nodoActual.fila = Math.floor(nodoMinimo / columnas);
        nodoActual.columna = nodoMinimo % columnas;
        algoritmoAEstrella(nodoActual, fin, abierta);
    }
}

function pintarCaminos(celda) {
    if (celda.fila === undefined) {
        alert("Es imposible llegar al destino");
        return;
    }
    if (celda.fila !== inicio.fila || celda.columna !== inicio.columna) {
        $("#" + celda.fila + "_" + celda.columna).addClass("celdaMarcada");
        pintarCaminos(tablero[celda.fila][celda.columna].padre);
    }
}

function limpiarCaminos() {
    for (let i = 0; i < filas; ++i) {
        for (let j = 0; j < columnas; ++j) {
            $("#" + i + "_" + j).removeClass("celdaMarcada");
        }
    }
}

function reiniciarTablero() {
    tablero = [];
    for (let i = 0; i < filas; ++i) {
        tablero[i] = [];
        for (let j = 0; j < columnas; ++j) {
            tablero[i].push({
                fila: i,
                columna: j,
                caminos: [],
                padre: { fila: undefined, columna: undefined },
                obstaculo: false,
                valor: 0,
                cerrada: false,
                valorAcum: 0
            });
        }
    }
}

function reiniciarDatosTablero() {
    for (let i = 0; i < filas; ++i) {
        for (let j = 0; j < columnas; ++j) {
            tablero[i][j].padre.fila = undefined;
            tablero[i][j].padre.fila = undefined;
            tablero[i][j].valor = 0;
            tablero[i][j].cerrada = false;
            tablero[i][j].valorAcum = 0;
        }
    }
}