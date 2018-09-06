
var ws;

var onmessage = function(e) {

	var message = e.data.split(";");

	if ( message[0] == "alert" ) {

		alert( message[1] );
	}
	else if ( message[0] == "status" ) {

		switch ( message[1] ) {

			case "ready":

				reset();
				unload();
				break;

			case "canceled":

				alert(dictionary.PREDICTOR_CANCELED_THE_REQUEST);
				unload();
				break;

			case "procesing":

				load(dictionary.PREDICTOR_IS_PROCESING_REQUEST);
				break;

			case "waiting":

				load(dictionary.WAITING_FOR_PREDICTOR_TO_BE_READY);
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

/*var onclose = function(){

	if ( haveLoadedAtLeastOnce ) {

		load(dictionary.TRYING_TO_RECONNECT);
	}

	setTimeout(reconnect, 1000);
};

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
//ws.onclose = onclose;
//ws.onopen = onopen;
ws.onmessage = onmessage;
