
var selectedFiles;
var alreadyRequested;
var uploadContainer;

var totalReactivos = 0;

var predictorStatus = "disconnected";
var predictorTimeout = 0;
var predictorTimeoutTime = 2 * 60 * 1000;// 2 minutes

function predict() {

	if ( predictorStatus != "ready" ) {

		displayLoadingMessage(dictionary.WAITING_FOR_PREDICTOR_TO_BE_READY);
		predictorTimeout = setTimeout(function () {

			displayDialogMessage(dictionary.PREDICTOR_TIMEOUT_TITLE, dictionary.PREDICTOR_TIMEOUT_MESSAGE);
			
		}, predictorTimeoutTime);
		return;
	}

	if ( counterstrike > 0 ) {

		displayLoadingMessage(dictionary.UPLOADING_FILES);

		uploadContainer.generateAsync({ type : "blob" }).then(function (blob) {

			var formData = new FormData();
			formData.append('upload', blob, "DWlV4UHdhUXVwV2tpVX");

			$.ajax({

				url : webserviceURL + 'upload.php',
				type : 'POST',
				data : formData,
				processData : false,
				contentType : false,
				success : function(data) {

					var message = data.split(",");

					if ( message[0] === "success" ) {

						displayLoadingMessage(dictionary.WAITING_FOR_PREDICTION);
						ws.send("predict;" + message[1]);
					}
					else if ( message[0] === "error" ) {

						displayContent();
						alert(dictionary.DISPLAY_ERROR + message[1]);
					}
					else {
						displayContent();
						alert(dictionary.UNHANDLED_ERROR + message[1]);
					}
				}
			});
		});
	}
	else {

		alert(dictionary.NO_FILES_SELECTED);
	}
}


