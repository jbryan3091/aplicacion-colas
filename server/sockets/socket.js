const { io } = require('../server');
const { TicketControl } = require('../classes/ticket-control');


const ticketControl = new TicketControl();

io.on('connection', (client) => {

    client.on('siguienteTicket', (data, callback) => {

        ;
        let siguiente = ticketControl.siguiente();

        console.log(siguiente);
        callback(siguiente);
    });

    // emitir evento 'estadoActual'

    client.emit('estadoActual', {
        actual: ticketControl.getUltimoTicket(),
        ultimos4: ticketControl.getUtlimos4()
    });

    client.on('atenderTicket', (data, callback) => {
        if (!data.escritorio) {
            return callback({
                err: true,
                mensaje: 'El Escritorio es necesario'
            });
        }

        let atenderTicket = ticketControl.atenderTicket(data.escritorio);

        callback(atenderTicket);

        // actualizar / notificar cambios en los ultimos 

        client.broadcast.emit('ultimos4', {
                ultimos4: ticketControl.getUtlimos4()
            })
            // emitir los 'ultimos 4'

    });

});