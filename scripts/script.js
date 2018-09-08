
var selectedFiles;
var haveLoadedAtLeastOnce;
var alreadyRequested;
var uploadContainer;
var previewNode;
var previewGallery;
var previewNextImage;
var totalReactivos = 0;

function login() {

	$("#main").hide();
	$("#login").show();
	$("#dialog").hide();
	$("#loading").hide();
}

function logout() {

    token = "";
    setCookie("token", "");

    login();
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
        ws.send("login;" + user.val() + ";" + pass.val());
        pass.val("");
    }
}

function sessioncheck(status) {

    token = getCookie("token");

    if ( token == "" ) {

        login(status);
    }
    else {

       load("Validando Sesión...");
       ws.send("validate;" + token);
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

	//$("#gallery").empty();
}

function predict() {

	if ( selectedFiles.length > 0 ) {

		load(dictionary.UPLOADING_FILES);
		uploadContainer.generateAsync({ type : "blob" }).then(function (blob) {

			ws.send(blob);

			/*var formData = new FormData();
			formData.append('userfile', blob, "files.zip");

			$.ajax({

				url : webserviceURL + 'submit.php',
				type : 'POST',
				data : formData,
				processData : false,
				contentType : false,
				success : function(data) {

					var message = data.split(",");

					if ( message[0] === "success" ) {

						load(dictionary.WAITING_FOR_PREDICTION);
						ws.send("predict;" + message[1] + ";" + Object.keys(uploadContainer.files).length/3);
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
			});*/
		});
	}
	else {

		alert(dictionary.NO_FILES_SELECTED);
	}
}

previewNode = document.createElement("div");
previewNode.setAttribute("class", "sample");
previewNode.appendChild(document.createElement("img"));
previewNode.appendChild(document.createElement("div"));
previewNode.lastChild.appendChild(document.createElement("span"));
previewNode.lastChild.appendChild(document.createElement("span"));

previewGallery = document.getElementById("gallery");

previewNextImage = function (previewIndex, startAt) {

	process(dictionary.LOADING_PREVIEW, ((previewIndex-startAt)*100)/(selectedFiles.length-startAt));

	if ( previewIndex < selectedFiles.length ) {

		b = new FileReader();
console.log("ewe");
		//uploadContainer.file("files/"+previewIndex+".jpg", selectedFiles[previewIndex]);

		if ( previewIndex < 256 || (previewIndex%10) !== 0 ) {

			b.onload = function(e) {
console.log("im doing my best");
				previewNode = previewNode.cloneNode(true);
                previewNode.firstChild.onload = function () {

                    uploadContainer.file("files/"+previewIndex+".jpg", resize(this), {base64: true});
                }
				previewNode.firstChild.setAttribute("src", e.target.result);
				previewNode.lastChild.firstChild.innerHTML = selectedFiles[previewIndex].name;
				previewNode.lastChild.lastChild.setAttribute("id", "status-" + (alreadyRequested+previewIndex));
				previewNode.lastChild.lastChild.innerHTML = '0%';
				previewGallery.appendChild(previewNode);

				previewNextImage( previewIndex + 1, startAt );
			}

			b.readAsDataURL( selectedFiles[previewIndex] );

		}
		else {

			b.onload = function(e) {

				previewNode = previewNode.cloneNode(true);
                previewNode.firstChild.onload = function () {

                    uploadContainer.file("files/"+previewIndex+".jpg", resize(this), {base64: true});
                }
				previewNode.firstChild.setAttribute("src", e.target.result);
				previewNode.lastChild.firstChild.innerHTML = selectedFiles[previewIndex].name;
				previewNode.lastChild.lastChild.setAttribute("id", "status-" + (alreadyRequested+previewIndex));
				previewNode.lastChild.lastChild.innerHTML = '';
				previewGallery.appendChild(previewNode);

				previewNextImage( previewIndex + 1, startAt );
			}

			b.readAsDataURL( selectedFiles[previewIndex] );
		}
	}
	else {

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

