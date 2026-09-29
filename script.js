const casillas = document.querySelectorAll(".casilla");
const mensaje = document.getElementById("mensaje");
const puntosX = document.getElementById("puntosX");
const puntosO = document.getElementById("puntosO");
const marcadorX = document.getElementById("marcadorX");
const marcadorO = document.getElementById("marcadorO");

const combinacionesGanadoras = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

let tablero = ["", "", "", "", "", "", "", "", ""];
let turno = "X";
let fichasColocadas = { X: 0, O: 0 };
let seleccionada = null;
let juegoTerminado = false;
let puntos = { X: 0, O: 0 };

// casillas vecinas (incluye diagonales)
function obtenerVecinas(pos) {
    const fila = Math.floor(pos / 3);
    const col = pos % 3;
    let vecinas = [];

    for (let f = fila - 1; f <= fila + 1; f++) {
        for (let c = col - 1; c <= col + 1; c++) {
            if (f >= 0 && f < 3 && c >= 0 && c < 3 && !(f === fila && c === col)) {
                vecinas.push(f * 3 + c);
            }
        }
    }
    return vecinas;
}

function faseMover() {
    return fichasColocadas.X === 3 && fichasColocadas.O === 3;
}

function clickCasilla(e) {
    if (juegoTerminado) return;

    const pos = parseInt(e.target.dataset.pos);

    if (!faseMover()) {
        if (tablero[pos] !== "") return;

        tablero[pos] = turno;
        fichasColocadas[turno]++;
        dibujar();

        if (!revisarGanador()) cambiarTurno();
        return;
    }

    // fase de mover fichas
    if (tablero[pos] === turno) {
        seleccionada = seleccionada === pos ? null : pos;
        dibujar();
        return;
    }

    if (seleccionada !== null && tablero[pos] === "" && obtenerVecinas(seleccionada).includes(pos)) {
        tablero[pos] = turno;
        tablero[seleccionada] = "";
        seleccionada = null;
        dibujar();

        if (!revisarGanador()) cambiarTurno();
    }
}

function cambiarTurno() {
    turno = turno === "X" ? "O" : "X";
    actualizarMensaje();
}

function actualizarMensaje() {
    if (faseMover()) {
        mensaje.textContent = "Turno de " + turno + " - mové una ficha";
    } else {
        mensaje.textContent = "Turno de " + turno + " - colocá una ficha";
    }

    marcadorX.classList.toggle("activo", turno === "X");
    marcadorO.classList.toggle("activo", turno === "O");
}

function revisarGanador() {
    for (let combinacion of combinacionesGanadoras) {
        const [a, b, c] = combinacion;

        if (tablero[a] !== "" && tablero[a] === tablero[b] && tablero[a] === tablero[c]) {
            juegoTerminado = true;
            puntos[turno]++;
            puntosX.textContent = puntos.X;
            puntosO.textContent = puntos.O;
            mensaje.textContent = "¡Ganó " + turno + "!";

            combinacion.forEach(i => casillas[i].classList.add("ganadora"));
            return true;
        }
    }
    return false;
}

function dibujar() {
    casillas.forEach((casilla, i) => {
        casilla.textContent = tablero[i];
        casilla.classList.remove("x", "o", "seleccionada", "posible");

        if (tablero[i] === "X") casilla.classList.add("x");
        if (tablero[i] === "O") casilla.classList.add("o");
    });

    if (seleccionada !== null) {
        casillas[seleccionada].classList.add("seleccionada");

        obtenerVecinas(seleccionada).forEach(v => {
            if (tablero[v] === "") casillas[v].classList.add("posible");
        });
    }
}

function nuevaPartida() {
    tablero = ["", "", "", "", "", "", "", "", ""];
    turno = "X";
    fichasColocadas = { X: 0, O: 0 };
    seleccionada = null;
    juegoTerminado = false;

    casillas.forEach(c => c.classList.remove("ganadora"));
    dibujar();
    actualizarMensaje();
}

function resetearMarcador() {
    puntos = { X: 0, O: 0 };
    puntosX.textContent = 0;
    puntosO.textContent = 0;
    nuevaPartida();
}

casillas.forEach(casilla => casilla.addEventListener("click", clickCasilla));
document.getElementById("btnReiniciar").addEventListener("click", nuevaPartida);
document.getElementById("btnResetear").addEventListener("click", resetearMarcador);

actualizarMensaje();
