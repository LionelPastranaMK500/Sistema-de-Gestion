import { addLocale, locale } from "primereact/api";

export function configCalendar() {
  addLocale("es", {
    firstDayOfWeek: 1,
    dayNames: ["domingo","lunes","martes","miércoles","jueves","viernes","sábado"],
    dayNamesShort: ["dom","lun","mar","mié","jue","vie","sáb"],
    dayNamesMin: ["D","L","M","X","J","V","S"],
    monthNames: [
      "Enero ","Febrero ","Marzo ","Abril","Mayo","Junio",
      "Julio ","Agosto ","Septiembre ","Octubre ","Noviembre ","Diciembre "
    ],
    monthNamesShort: [
      "ene","feb","mar","abr","may","jun",
      "jul","ago","sep","oct","nov","dic"
    ],
    today: "Hoy",
    clear: "Limpiar"
  });
  locale("es"); 
}
