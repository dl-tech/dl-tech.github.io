var token = "";
var ws;

var onmessage = function(e) {

	var message = e.data.split(";");

	if ( message[0] == "alert" ) {

		alert( message[1] );
	}
	else if ( message[0] == "session" ) {

        if ( message[1] == "success" ) {

		    token = message[2];
            setCookie("token", token);

		    reset();
		    unload();
        }
        else {

            login();
            alert("Wrong user/password combination");
        }
	}
    else if ( message[0] == "validate" ) {

        if ( message[1] == token ) {

            if ( message[2] == "waiting" ) {

		        load(dictionary.WAITING_FOR_PREDICTOR_TO_BE_READY);
            }
            else {

		        reset();
		        unload();
            }
        }
        else {
 
            token = "";
            login();
        }
    }
	else if ( message[0] == "status" ) {

        if ( message[1] == "start" || message[1] == "waiting" ) {

            sessioncheck(message[1]);
            return;
        }
        else if ( token == "" ) {

            //FIXME ignore message due being loged out
            login();
            return;
        }

		switch ( message[1] ) {

			case "ready":

				reset();
				unload();
				break;

			case "uploading":

				load("Procesando archivos...");
				break;

			case "canceled":

				alert(dictionary.PREDICTOR_CANCELED_THE_REQUEST);
				unload();
				break;

			case "preparing":

				load(dictionary.PREDICTOR_IS_PREPARING_REQUEST);
				break;

			case "procesing":

				load(dictionary.PREDICTOR_IS_PROCESING_REQUEST);
				break;

			case "shutdown":

				load(dictionary.WAITING_FOR_PREDICTOR_RECONECTION);
				break;
			default:

				alert(dictionary.UNHANDLED_ERROR + message[1]);
				load(dictionary.LOADING);
		}
	}
	else if ( message[0] == "result" ) {

        if ( token == "" ) {

            //FIXME ignore message due being loged out
            login();
            return;
        }

		load(dictionary.PROCESSING_PREDICTOR_RESPONSE);

		var index;
		var value;
		var status;
		var resultados = message[1].split(",");

		selectedFiles = new Array();
		uploadContainer = new JSZip();

		var previousCount = alreadyRequested;

		alreadyRequested += resultados.length;

		$("#count-new").text(0);
		$("#count-total").text(alreadyRequested);

		for (var i=0; i<resultados.length; i++) {

			status = resultados[i].split(":");

			index = parseInt(status[0])
			value = parseFloat(status[1]);

			status = $("#status-" + (previousCount+index));
			status.text(Math.floor(value*1000)/1000 + "%")

			if ( value < 25 ) {

				status.css("background-color", "red");
			}
			else if ( value < 50 ) {

				status.css("background-color", "orangered");
			}
			else if ( value < 80 ) {

				status.css("background-color", "orange");
			}
			else {
				totalReactivos++;
				status.css("background-color", "green");
			}
		}

		$("#count-reactivo").text(totalReactivos);
		$("#count-noreactivo").text(alreadyRequested-totalReactivos);

		unload();
	}
	else {
		//FIXME
		console.log("A message was received but it was ignored: " + message);
	}
};

var onclose = function(){

	var submessage = "Puede que se perdiera la conexion a internet";
	submessage += "<br>o que el servicio de prediccion no este disponible.";
	submessage += "<br>Vuelva a intentarlo mas tarde.";

	dialog("No hay conexión con el servidor.", submessage)
};

/*
var reconnectCount = 1;

var reconnect = function () {

	ws = new WebSocket(websocketURL);
	ws.onopen = onopen;
	ws.onmessage = onmessage;
	ws.onclose = onclose;

	console.log("Intentando reconectar... try: " + reconnectCount++);
}


var onopen = function () {

	haveLoadedAtLeastOnce = true;
};*/

ws = new WebSocket(websocketURL);

ws.onclose = onclose;
//ws.onopen = onopen;
ws.onmessage = onmessage;
