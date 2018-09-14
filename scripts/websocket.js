var ws;
var registredLabels;

function startWebsocket() {

    displayLoadingMessage(dictionary.CONNECTING_TO_PREDICTION_SERVICE);

    ws = new WebSocket(websocketURL);
    ws.onmessage = onmessage;
    ws.onclose = onclose;
};

var onmessage = function(e) {

	var message = e.data.split(";");

	if ( message[0] == "alert" ) {

		alert( message[1] );
	}
	else if ( message[0] == "status" ) {

        clearTimeout(predictorTimeout);

		switch ( message[1] ) {

			case "ready":

                predictorStatus = message[1];
				resetContent();
				displayContent();
				break;

			case "waiting":

                predictorStatus = message[1];
				displayLoadingMessage(dictionary.WAITING_FOR_PREDICTOR_TO_BE_READY);
				break;

			case "shutdown":

				displayLoadingMessage(dictionary.TRYING_TO_RECONNECT);
				break;

			case "canceled":

                alert(dictionary.PREDICTOR_CANCELED_REQUEST);
				resetContent();
				displayContent();
				break;

			case "preparing":

				displayLoadingMessage(dictionary.PREDICTOR_IS_PREPARING_REQUEST);
				break;

			case "procesing":

				displayLoadingMessage(dictionary.PREDICTOR_IS_PROCESING_REQUEST);
				break;

			default:

				alert(dictionary.UNHANDLED_ERROR + message[1]);
				displayLoadingMessage(dictionary.LOADING);
		}
	}
	else if ( message[0] == "result" ) {

		displayLoadingMessage(dictionary.PROCESSING_PREDICTOR_RESPONSE);

		var index;
		var value;
		var status;
		var resultados = message[1].split(",");

		$("#count-new").text(0);
		$("#count-total").text(alreadyRequested);

		for (var i=0; i<resultados.length; i++) {

			status = resultados[i].split(":");

			index = parseInt(status[0])
			value = parseFloat(status[1]);

			clase = $("#clase-" + (index));
            clase.text( status[2] );

            if ( registredLabels[ status[2] ] ) {

                registredLabels[ status[2] ]++;
            }
            else {

                registredLabels[ status[2] ] = 1;
            }

			status = $("#status-" + (index));
			status.text(Math.floor(value*1000)/1000 + "%")

			if ( value < 20 ) {

				status.parent().parent().css("background-color", "#27b937b2");
			}
			else if ( value < 40 ) {

				status.parent().parent().css("background-color", "#40ba00b2");
			}
			else if ( value < 50 ) {

				status.parent().parent().css("background-color", "#cbf874b2");
			}
			else if ( value < 80 ) {

				status.parent().parent().css("background-color", "#ff410bb2");
			}
			else {

				status.parent().parent().css("background-color", "#ff0000b2");
			}
		}

        counterstrike = 0;
		uploadContainer = new JSZip();
        alreadyRequested += resultados.length;

        var etiquetas = $("#etiquetas");

        etiquetas.empty();

        var div;

        for (var key in registredLabels) {

            div = $("<div></div>").appendTo(etiquetas);

            $("<span class=\"count-name\">" + key + ":</span>").appendTo(div);
		    $("<span class=\"count-value\">" + registredLabels[key] + "</span>").appendTo(div);
        }

		displayContent();
	}
	else {

		console.log("A message was received but it was ignored: " + message);
	}
};

var onclose = function(){

	displayDialogMessage(dictionary.NO_CONNECTION_TITLE, dictionary.NO_CONNECTION_MESSAGE)
};
