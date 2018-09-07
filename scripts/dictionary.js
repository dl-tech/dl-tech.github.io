
var dictionary = {

	LOADING : "Cargando...",
	DISPLAY_ERROR : "Error: ",
	UPLOADING_FILES : "Enviando consulta...",
	LOADING_PREVIEW : "Cargando vista previa...",
	UNHANDLED_ERROR : "Ocurrio un error inesperado: ",
	NO_FILES_SELECTED : "No se han seleccionado archivos",
	TRYING_TO_RECONNECT : "Intentando reconectar...",
	WAITING_FOR_PREDICTION : "Esperando predicción...",
	PROCESSING_PREDICTOR_RESPONSE : "Procesando resultado...",
	WAITING_FOR_PREDICTOR_TO_BE_READY : "Esperando que el predictor inicie...", 
	WAITING_FOR_PREDICTOR_RECONECTION : "Esperando reconexion del predictor...",
	PREDICTOR_CANCELED_THE_REQUEST : "El predictor ha cancelado la consulta",
	PREDICTOR_IS_PROCESING_REQUEST : "Preparando predicción...",
	PREDICTOR_IS_PROCESING_REQUEST : "Realizando predicción..."
}


function getCookie(cname) {

    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function setCookie(cname, cvalue, exdays) {

    exdays = 365;

    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

