function randomChoice(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function randomDate(start, end) {
    const startMs = start.getTime();
    const endMs = end.getTime();
    const randomMs = startMs + Math.random() * (endMs - startMs);
    const fecha = new Date(randomMs);
    fecha.setHours(Math.floor(Math.random() * 24));
    fecha.setMinutes(Math.floor(Math.random() * 60));
    fecha.setSeconds(Math.floor(Math.random() * 60));
    return fecha;
}

function randomRuc() {
    const prefijo = Math.random() < 0.5 ? "10" : "20";
    const resto = Math.floor(Math.random() * 1_000_000_000)
        .toString()
        .padStart(9, "0");
    return prefijo + resto;
}

function randomItems() {
    const catalogo = [
        { codigo: "001", descripcion: "Filtro de aire", precio: 50 },
        { codigo: "002", descripcion: "Aceite Shell Helix 10W40", precio: 12 },
        { codigo: "4003", descripcion: "Pastillas de freno", precio: 20 },
        { codigo: "004", descripcion: "Neumático Michelin 16''", precio: 35 },
        { codigo: "7005", descripcion: "Batería Bosch 12V", precio: 48 },
        { codigo: "006", descripcion: "Kit de embrague Toyota Hilux", precio: 125 },
        { codigo: "007", descripcion: "Aceite Castrol Magnatec 5W30 4L", precio: 15 },
        { codigo: "008", descripcion: "Filtro de aceite", precio: 8 },
        { codigo: "009", descripcion: "Amortiguador delantero Toyota Corolla", precio: 42 },
        { codigo: "010", descripcion: "Radiador Nissan Sentra", precio: 68 },
        { codigo: "011", descripcion: "Disco de freno Hyundai Accent", precio: 30 },
        { codigo: "1012", descripcion: "Alternador Chevrolet Aveo", precio: 95 },
        { codigo: "013", descripcion: "Correa de distribución Kia Rio", precio: 27 },
        { codigo: "014", descripcion: "Luz LED H4 alta/baja", precio: 9 },
        { codigo: "015", descripcion: "Espejo retrovisor lateral derecho", precio: 18 },
        { codigo: "016", descripcion: "Parachoques delantero Toyota Yaris", precio: 75 },
        { codigo: "4017", descripcion: "Juego de bujías NGK x4", precio: 14 },
        { codigo: "018", descripcion: "Sensor de oxígeno Honda Civic", precio: 35 },
        { codigo: "019", descripcion: "Aceite Valvoline SynPower 5W40 4L", precio: 16 },
        { codigo: "6020", descripcion: "Balatas traseras Nissan Versa", precio: 22 }
    ];

    const cantidad = Math.floor(Math.random() * 2) + 1;
    const items = [];
    for (let i = 0; i < cantidad; i++) {
        const prod = catalogo[Math.floor(Math.random() * catalogo.length)];
        const cant = 1;
        items.push({ ...prod, cantidad: cant, unidad: "UND" });
    }

    return items;
}

function calcularMonto(tDocumento, totalItems) {
    switch (tDocumento) {
        case "Factura Electronica":
        case "Boleta de Venta Electronica":
            return totalItems;
        case "Nota de Credito":
            return -Math.round(totalItems * 0.5);
        case "Nota de Debito":
            return totalItems;
        case "Proforma":
            return totalItems;
        case "Guia de Remision":
            return 0;
        default:
            return totalItems;
    }
}

export function generarDataFalsa(cantidad = 50) {
    const tipos = [
        "Factura Electronica",
        "Boleta de Venta Electronica",
        "Nota de Credito",
        "Nota de Debito",
        "Proforma",
        "Guia de Remision"
    ];

    const clientes = [
        { razonSocial: "NORSET SL", direccion: "Av. Los Olivos 12453, Lima" },
        { razonSocial: "Talleres Pérez E.I.R.L.", direccion: "Calle San Martín 45, Lima" },
        { razonSocial: "Auto Partes García S.A.", direccion: "Jr. Arequipa 567, Lima" },
        { razonSocial: "Servicios de Transporte Torres S.A.C.", direccion: "Av. Javier Prado 890, Lima" },
        { razonSocial: "Lubricantes Fernández S.A.", direccion: "Calle Bolívar 234, Lima" },
        { razonSocial: "Distribuciones Díaz E.I.R.L.", direccion: "Av. La Marina 678, Lima" },
        { razonSocial: "Motors Ramírez S.A.", direccion: "Jr. Tacna 101, Lima" },
        { razonSocial: "MISDUS SL", direccion: "Av. Grau 345, Lima" },
        { razonSocial: "WESIZE SA", direccion: "Calle Pardo 22, Lima" },
        { razonSocial: "Jorge Herrera S.A.C.", direccion: "Av. Arequipa 19, Lima" }
    ];

    const data = [];
    const fechas = [];

    for (let i = 0; i < cantidad; i++) {
        let fecha;

        if (fechas.length > 0 && fechas.length < 10 && Math.random() < 0.7) {
            const idx = Math.floor(Math.random() * fechas.length);
            fecha = fechas[idx];
        } else {
            fecha = randomDate(new Date(2025, 5, 21), new Date(2025, 8, 31));
            fechas.push(fecha);
        }

        const tDocumento = randomChoice(tipos);
        const items = randomItems();
        const totalItems = items.reduce((acc, it) => acc + it.precio * it.cantidad, 0);
        const monto = calcularMonto(tDocumento, totalItems);

        const clienteElegido = randomChoice(clientes);
        const tipoOperacion = Math.random() < 0.5 ? "venta" : "compra";

        data.push({
            id: i + 1,
            serie: tDocumento.split(" ")[0].substring(0, 2).toUpperCase() + "001",
            numero: (1000 + i + 1).toString(),
            cliente: clienteElegido.razonSocial,
            ruc: randomRuc(),
            fecha: fecha.toISOString(),
            direccion: clienteElegido.direccion,
            monto,
            tDocumento,
            state: "ACEPTADO",
            items,
            tipoOperacion
        });
    }

    return data;
}
