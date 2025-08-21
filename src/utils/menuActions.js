export const menuActions ={
    estadistica: ({navigate})=>{
        navigate("/estadistica")
    },
    ventas: ({navigate})=>{
        navigate("/ventas");
    },
    ventasRealizadas: ({navigate})=>{
        navigate("/facturas");
    },
    proformas: ({navigate})=>{
        navigate("/proformas");
    },
    reportes: ({navigate})=>{
        navigate("/reportes");
    },
    cliente: ({navigate})=>{
        navigate("/cliente");
    },
    producto: ({navigate})=>{
        navigate("/producto");
    },
    configuracion: ({navigate})=>{
        navigate("/configuracion");
    },
    ayuda: ({navigate})=>{
        navigate("/ayuda");
    },
};