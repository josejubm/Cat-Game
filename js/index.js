function app() {
    var canvas = document.getElementById("Ejercicio01");
    canvas.width = '500';
    canvas.height = '500';
    var ctx = canvas.getContext("2d");
    canvas.style.backgroundColor = '#b2e2f2';
    const botonDeRegilla = document.getElementById('botonDeRegilla');

    let regillaMostrada = false;
    // Función para mostrar u ocultar la regilla
    function toggleRegilla() {
        regillaMostrada = !regillaMostrada;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        reiniciarJuego();

        botonDeRegilla.innerText = regillaMostrada ? 'Ocultar Regilla' : 'Mostrar Regilla';
    }
    botonDeRegilla.addEventListener("click", toggleRegilla);

    const images = {
        gato: new Image(),
        rata: new Image(),
    };
    images.gato.src = 'img/gato.jpg';
    images.rata.src = 'img/rata.jpg';

    const players = {
        jugador1: null,
        jugador2: null
    };
    players.jugador1 = document.getElementById('nombreJugador1').value;
    players.jugador2 = document.getElementById('nombreJugador2').value;

    const victoriasJugador1 = document.getElementById('vicjuagdor1');
    const victoriasJugador2 = document.getElementById('vicjuagdor2');
    const empatesElement = document.getElementById('empates');

    let victoriasPlayer1 = 0;
    let victoriasPlayer2 = 0;
    let empates = 0;

    function updateVictoryCounts() {
        victoriasJugador1.textContent = victoriasPlayer1;
        victoriasJugador2.textContent = victoriasPlayer2;
        empatesElement.textContent = empates;
    }

    const gato = {

        estados: [
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0]
        ],
        ancho: canvas.width = '500',
        alto: canvas.height = '500',

        turnoJugador: 1,

        regilla: function () {
            var regilla = 5;
            var TamañoCuadro = 100;

            for (var i = 1; i < regilla; i++) {
                var x = (i * TamañoCuadro);
                var y = (i * TamañoCuadro);

                ctx.setLineDash([5, 5]);

                // Verticales
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, canvas.height);
                ctx.lineWidth = 2;
                ctx.strokeStyle = 'dark';
                ctx.stroke();

                // Horizontales
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(canvas.width, y);
                ctx.stroke();
            }
        },

        escenario: function (backgroundColor) {
            ctx.beginPath();
            ctx.moveTo(200, 100);
            ctx.lineTo(200, 400);
            ctx.moveTo(300, 100);
            ctx.lineTo(300, 400);
            ctx.moveTo(100, 200);
            ctx.lineTo(400, 200);
            ctx.moveTo(100, 300);
            ctx.lineTo(400, 300);
            ctx.lineWidth = 4;
            ctx.setLineDash([]);
            ctx.strokeStyle = backgroundColor;
            ctx.stroke();
        },


        activarEstado: function (event) {
            var x = event.offsetX - 100;
            var y = event.offsetY - 100;
            var cuadroX = Math.floor(x / 100);
            var cuadroY = Math.floor(y / 100);

            // Verificar si el cuadro está vacío antes de guardar el estado
            if (event.type === 'mousedown' && this.estados[cuadroY][cuadroX] === 0) {
                this.estados[cuadroY][cuadroX] = this.turnoJugador; // Corregir la variable

                var img = this.turnoJugador === 1 ? images.gato : images.rata;
                ctx.drawImage(img, cuadroX * 100 + 105, cuadroY * 100 + 105, 90, 90);

                console.log(`Se ha guardado el estado ${this.turnoJugador} en la posición: ${cuadroX}, ${cuadroY}`);
                this.turnoJugador = this.turnoJugador === 1 ? 2 : 1;
                this.analizarJugador();
            }
        },

        seleccionar: function (event) {
            // No hacemos nada en esta función si no es un clic (mousedown)
            if (event.type !== 'mousedown') {
                return;
            }

            // Restaurar cuadro previamente resaltado
            if (this.cuadroResaltado) {
                const { x, y } = this.cuadroResaltado;
                ctx.clearRect(x * 100 + 105, y * 100 + 105, 90, 90);
                this.cuadroResaltado = null;
            }

            var x = event.offsetX - 100;
            var y = event.offsetY - 100;
            var cuadroX = Math.floor(x / 100);
            var cuadroY = Math.floor(y / 100);

            // Verificar si el cuadro está vacío y resaltarlo
            if (this.estados[cuadroY][cuadroX] === 0) {
                // Pintar el cuadro con la imagen del jugador actual
                var img = this.TurnoDJugador === 1 ? images.gato : images.rata;
                ctx.drawImage(img, cuadroX * 100 + 105, cuadroY * 100 + 105, 90, 90);

                // Actualizar el estado del cuadro con el jugador actual
                this.estados[cuadroY][cuadroX] = this.TurnoDJugador;

                // Cambiar turno después de dibujar el cuadro
                this.TurnoDJugador = this.TurnoDJugador === 1 ? 2 : 1;
                this.cuadroResaltado = { x: cuadroX, y: cuadroY };
            }
        },

        analizarJugador: function () {
            // Verificar filas
            for (let i = 0; i < 3; i++) {
                if (this.estados[i][0] !== 0 &&
                    this.estados[i][0] === this.estados[i][1] &&
                    this.estados[i][1] === this.estados[i][2]) {
                    this.mostrarGanador(this.estados[i][0], "fila", i);
                    return;
                }
            }

            // Verificar columnas
            for (let j = 0; j < 3; j++) {
                if (this.estados[0][j] !== 0 &&
                    this.estados[0][j] === this.estados[1][j] &&
                    this.estados[1][j] === this.estados[2][j]) {
                    this.mostrarGanador(this.estados[0][j], "columna", j);
                    return;
                }
            }

            // Verificar diagonales
            if (this.estados[0][0] !== 0 &&
                this.estados[0][0] === this.estados[1][1] &&
                this.estados[1][1] === this.estados[2][2]) {
                this.mostrarGanador(this.estados[0][0], "diagonal", 0);
                return;
            }
            if (this.estados[0][2] !== 0 &&
                this.estados[0][2] === this.estados[1][1] &&
                this.estados[1][1] === this.estados[2][0]) {
                this.mostrarGanador(this.estados[0][2], "diagonal", 1);
                return;
            }

            // Verificar empate
            if (this.estados.flat().every((estado) => estado !== 0)) {
                this.mostrarEmpate();
            }
        },

        mostrarGanador: function (jugador, tipo, indice) {
            var modal = new bootstrap.Modal(document.getElementById('modal_ganador'), {
                backdrop: 'static',
                keyboard: false
            });

            var modalMessage = document.getElementById('modal-title');
            var continuar = document.getElementById('continuar');

            var mensaje = `¡${jugador === 1 ? players.jugador1 : players.jugador2} ha ganado como Jugador ${jugador}!`;

            if (tipo === "fila") {
                this.trazarJugada(indice, 'fila', jugador);
                mensaje += ` en la fila ${indice + 1}`;
            } else if (tipo === "columna") {
                this.trazarJugada(indice, 'columna', jugador);
                mensaje += ` en la columna ${indice + 1}`;
            } else if (tipo === "diagonal") {
                this.trazarJugada(indice, 'diagonal', jugador);
                mensaje += ` en la diagonal ${indice === 0 ? "principal" : "secundaria"}`;
            }

            modalMessage.textContent = mensaje;
            modal.show();

            if (tipo === "fila" || tipo === "columna" || tipo === "diagonal") {
                // Incrementar las victorias del jugador ganador
                if (jugador === 1) {
                    victoriasPlayer1++;
                } else {
                    victoriasPlayer2++;
                }
                updateVictoryCounts();
            }

            continuar.addEventListener('click', function () {
                modal.hide();
                this.resetGame();
            }.bind(this));
        },




        mostrarEmpate: function () {
            var modal = new bootstrap.Modal(document.getElementById('modal_ganador'), {
                backdrop: 'static',
                keyboard: false
            });
            var modalMessage = document.getElementById('modal-title');
            var continuar = document.getElementById('continuar');
            var mensaje = `¡ EMPATE !`;
            modalMessage.textContent = mensaje;
            modal.show();

            ctx.beginPath();
            ctx.lineWidth = 5; // Grosor de la línea
            ctx.strokeStyle = 'gray'; // El color de la línea para el empate

            ctx.moveTo(100, 100);
            ctx.lineTo(400, 100);
            ctx.lineTo(400, 400);
            ctx.lineTo(100, 400);
            ctx.closePath();
            ctx.stroke();

            empates++;
            updateVictoryCounts();

            continuar.addEventListener('click', function () {
                modal.hide();
                this.resetGame();
            }.bind(this));

        },

        trazarJugada: function (indice, tipo, jugador) {
            ctx.beginPath();
            ctx.lineWidth = 5; // Grosor de la línea
            ctx.strokeStyle = jugador === 1 ? 'blue' : 'red';

            if (tipo === 'fila') {
                ctx.moveTo(100, indice * 100 + 150);
                ctx.lineTo(400, indice * 100 + 150);
            } else if (tipo === 'columna') {
                ctx.moveTo(indice * 100 + 150, 100);
                ctx.lineTo(indice * 100 + 150, 400);
            } else if (tipo === 'diagonal') {
                if (indice === 0) {
                    ctx.moveTo(100, 100);
                    ctx.lineTo(400, 400);
                } else {
                    ctx.moveTo(400, 100);
                    ctx.lineTo(100, 400);
                }
            }
            ctx.stroke();
        },



        play: function () {
            this.escenario();
            if (regillaMostrada) {
                this.regilla();
            }
        },
    };

    canvas.addEventListener('mousedown', function (event) {
        gato.activarEstado(event);
    });

    canvas.addEventListener('mousemove', function (event) {
        gato.seleccionar(event);
    });

    function nombres() {
        var name1 = document.getElementById("nombreJugador1").value;
        var name2 = document.getElementById("nombreJugador2").value;
        document.getElementById("name1").innerHTML = name1;
        document.getElementById("name2").innerHTML = name2;
    };

    nombres();

    function reiniciarJuego() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        gato.estados = [
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0]
        ];
        gato.turnoJugador = 1;

        gato.escenario("black");

        if (regillaMostrada) {
            gato.regilla();
        }
    }
    const botonReinicio = document.getElementById('Reinicio');
    botonReinicio.addEventListener('click', reiniciarJuego);

    const continuar = document.getElementById("Continuar");
    continuar.addEventListener('click', reiniciarJuego);

    const botonTerminar = document.getElementById('terminar');
    botonTerminar.addEventListener('click', function () {
        const modal = new bootstrap.Modal(document.getElementById('modal_ganador'), {
            backdrop: 'static',
            keyboard: false
        });
        modal.hide();
        location.reload();
    });

    gato.play();
}

window.onload = function () {
    app();
};
