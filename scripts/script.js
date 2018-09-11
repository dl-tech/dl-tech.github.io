
var selectedFiles;
var alreadyRequested;
var uploadContainer;

var previewNextImage;
var totalReactivos = 0;

var token = "";

var predictorStatus = "disconnected";
var predictorTimeout = 0;// no cambiar
var predictorTimeoutTime = 2 * 60 * 1000;// 2 minutos

window.onload = function () {

    sessioncheck();
}

function login() {

	$("#main").hide();
	$("#login").show();
	$("#dialog").hide();
	$("#loading").hide();
}

function logout() {

    load("Cerrando sesión");

    ws.onclose = function () {

        token = "";
        setCookie("token", "");

        login();
    }
    ws.close();
}

function session() {

    var user = $("#user");
    var pass = $("#pass");

    if ( user.val() == "" ) {

        alert("Ingrese un usuario");
    }
    else if ( pass.val() == "" ) {

        alert("Ingrese su clave");
    }
    else {

        load("Iniciando sesión...");

		$.ajax({

			url : webserviceURL + 'login.php?user=' + user.val() + "&pass=" + pass.val(),
			type : 'GET',
			success : function(data) {

				data = data.split(",");

                if ( data[0] == "success" ) {

                    token = data[3] + "|" + data[1];
                    setCookie("token", token);
                    $("#username").text(atob(data[2]));
                    startWebsocket();
                }
                else if ( data[0] == "error" ) {

                    alert("Error: " + data[1]);
                    token = "";
                    setCookie("token", token);
                    login();
                }
                else {

                    alert("Unhandled error: " + data[1]);
                }
			},
            error : function () {

                dialog("Error de conexión", "Parece que el sistema de identificación no se encuentra disponible<br>Vuelva a intentar mas tarde.");
            }
		});

        pass.val("");
    }

	return false;
}

function sessioncheck() {

    token = getCookie("token");

    if (token != "") {

        load("Validando Sesión...");

		$.ajax({

			url : webserviceURL + 'validate.php?token=' + token,
			type : 'GET',
			success : function(data) {

				data = data.split(",");

                if ( data[0] == "success" ) {

                    token = data[3] + "|" + data[1];
                    setCookie("token", token);
                    $("#username").text(atob(data[2]));
                    startWebsocket();
                    return;
                }
                else if ( data[0] == "error" ) {

                    alert("Error: " + data[1]);
                }
                else {

                    alert("Unhandled error: " + data[1]);
                }

                token = "";
                login();
			},
            error : function () {

                dialog("Error de conexión", "Parece que el sistema de identificación no se encuentra disponible<br>Vuelva a intentar mas tarde.");
            }
		});
    }
    else {

        login();
    }
}

function dialog( message, submessage ) {

	$("#main").hide();
	$("#login").hide();
	$("#dialog").show();
	$("#loading").hide();

	$("#dialog-message").text(message);
	$("#dialog-sub-message").html(submessage);
}

function load( message ) {

	$("#main").hide();
	$("#login").hide();
	$("#dialog").hide();
	$("#loading").show();

	$("#load-message").text(message);
}

function process(message, progress) {

	$("#main").show();
	$("#login").hide();
	$("#dialog").hide();
	$("#loading").hide();

	$("#content").hide();
	$("#process").show();

	$("#upload-message").text(message);
	$("#progress-val").text(Math.floor(progress) + "%");
	$("#progress-in").css("width", progress + "%");
}

function unload() {

	$("#main").show();
	$("#login").hide();
	$("#dialog").hide();
	$("#loading").hide();

	$("#content").show();
	$("#process").hide();
}

function reset() {

	selectedFiles = new Array();
	uploadContainer = new JSZip();
	alreadyRequested = 0;
	totalReactivos = 0;

	$("#count-new").text(0);
	$("#count-total").text(0);
	$("#count-reactivo").text(0);
	$("#count-noreactivo").text(0);

	$("#button-predict").prop("disabled", true);
	$("#button-reset").prop("disabled", true);

	/* Tricky */
	$("#star-platinum").trigger("reset");
	$("#gallery").empty();
}

function predict() {

	if ( predictorStatus != "ready" ) {

		load(dictionary.WAITING_FOR_PREDICTOR_TO_BE_READY);
		predictorTimeout = setTimeout(function () {

			dialog("El predictor no se encuentra listo.", "Intente nuevamente mas tarde.<br>Si el problema persiste contacte a soporte al cliente.");
			
		}, predictorTimeoutTime);
		return;
	}

	if ( selectedFiles.length > 0 ) {

		load(dictionary.UPLOADING_FILES);

		uploadContainer.generateAsync({ type : "blob" }).then(function (blob) {

			var formData = new FormData();
			formData.append('upload', blob, "skCZUxPwaQupWkiUzK");

			$.ajax({

				url : webserviceURL + 'upload.php',
				type : 'POST',
				data : formData,
				processData : false,
				contentType : false,
				success : function(data) {

					var message = data.split(",");

					if ( message[0] === "success" ) {

						load(dictionary.WAITING_FOR_PREDICTION);
						ws.send("predict;" + message[1]);
					}
					else if ( message[0] === "error" ) {

						unload();
						alert(dictionary.DISPLAY_ERROR + message[1]);
					}
					else {
						unload();
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

previewNextImage = function (previewIndex, startAt) {

	process(dictionary.LOADING_PREVIEW, ((previewIndex-startAt)*100)/(selectedFiles.length-startAt));

	if ( previewIndex < selectedFiles.length ) {

		// more info about select files to upload limit on windows chrome at:
		// https://stackoverflow.com/questions/15851751/what-is-the-max-number-of-files-to-select-in-an-html5-multiple-file-input
	
		var previewNode = document.createElement("div");
		previewNode.setAttribute("class", "sample");
		previewNode.appendChild(document.createElement("img"));
		previewNode.appendChild(document.createElement("div"));
		previewNode.lastChild.appendChild(document.createElement("span"));
		previewNode.lastChild.appendChild(document.createElement("span"));
		previewNode.lastChild.appendChild(document.createElement("span"));

		var gallery = document.getElementById("gallery");

		var b = new FileReader();

		b.onload = function(e) {

			var n = previewNode.cloneNode(true);
            n.firstChild.onload = function () {

				if ( this.width > 50 || this.height > 50 ) {

					uploadContainer.file("files/"+previewIndex+".jpg", resize(this), {base64: true});
				}
				else {

					uploadContainer.file("files/"+previewIndex+".jpg", selectedFiles[previewIndex], {base64: true});
				}

				previewNextImage( previewIndex + 1, startAt );
            }
			n.firstChild.setAttribute("src", e.target.result);
			n.lastChild.firstChild.innerHTML = selectedFiles[previewIndex].name;
			n.lastChild.firstChild.nextSibling.setAttribute("id", "status-" + (alreadyRequested+previewIndex));
			n.lastChild.lastChild.setAttribute("id", "clase-" + (alreadyRequested+previewIndex));

			gallery.appendChild(n);
		}

		b.readAsDataURL( selectedFiles[previewIndex] );
	}
	else {

		/* Tricky */
		$("#star-platinum").trigger("reset");

		$("#button-predict").prop("disabled", false);
		$("#button-reset").prop("disabled", false);
		unload();
	}
}

//$("#file").on('change', function(e) {
function kiwi(input) {

	$("#button-predict").prop("disabled", true);
	$("#button-reset").prop("disabled", true);

	load(dictionary.LOADING);

	var startAt = selectedFiles.length;
	//var newImages = e.target.files ? e.target.files : e.originalEvent.dataTransfer.files;

	var newImages = input.files;
	
	for (var i=0; i<newImages.length; i++) {

		selectedFiles.push( newImages[i] );
	}

	$("#count-new").text(selectedFiles.length);
	$("#count-total").text(alreadyRequested);

	previewNextImage( startAt, startAt );
}
//});

