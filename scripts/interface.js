var counterstrike;
var lastpull;
var current;

function createDialogBox(node) {

    current = document.createElement("div");
    current.setAttribute("class", "boxing");

    current.onclick = function (e) {

        e.stopPropagation();

        current = null;

        window.left = null;
        window.right = null;

        this.parentNode.removeChild(this);
    };

    current.appendChild( document.createElement("div") );
    current.lastChild.setAttribute("class", "valign");

    current.appendChild( document.createElement("div") );
    current.lastChild.setAttribute("class", "arrow left");
    current.lastChild.onclick = moveLeft;

    current.appendChild( document.createElement("div") );
    current.lastChild.setAttribute("class", "venter");

    current.lastChild.style.backgroundColor = "white";
    current.lastChild.appendChild(node);

    current.appendChild( document.createElement("div") );
    current.lastChild.setAttribute("class", "arrow right");
    current.lastChild.onclick = moveRight;

    document.body.appendChild(current);

}

function selectFilesFrom(input) {

    lastpull = input.files;

	$("#button-predict").prop("disabled", true);
	$("#button-reset").prop("disabled", true);

	displayLoadingMessage(dictionary.LOADING);

	$("#count-new").text(counterstrike + lastpull.length);
	$("#count-total").text(alreadyRequested);

	previewNextImage(0);
}

function setUserName(username) {

    $("#username").text(username);
}

function displayLoginForm() {

	$("#main").hide();
	$("#login").show();
	$("#dialog").hide();
	$("#loading").hide();
}

function displayDialogMessage( message, submessage ) {

	$("#main").hide();
	$("#login").hide();
	$("#dialog").show();
	$("#loading").hide();

	$("#dialog-message").text(message);
	$("#dialog-sub-message").html(submessage);
}

function displayLoadingMessage( message ) {

	$("#main").hide();
	$("#login").hide();
	$("#dialog").hide();
	$("#loading").show();

	$("#load-message").text(message);
}

function displayProgressBar(message, progress) {

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

function displayContent() {

	$("#main").show();
	$("#login").hide();
	$("#dialog").hide();
	$("#loading").hide();

	$("#content").show();
	$("#process").hide();
}

function resetContent() {

	selectedFiles = new Array();
	uploadContainer = new JSZip();
	alreadyRequested = 0;
    counterstrike = 0;
    registredLabels = {};

	$("#count-new").text(0);
	$("#count-total").text(0);
	$("#count-reactivo").text(0);
	$("#count-noreactivo").text(0);

	$("#button-predict").prop("disabled", true);
	$("#button-reset").prop("disabled", true);

	/* Tricky */
	$("#star-platinum").trigger("reset");
	$("#gallery").empty();
    $("#etiquetas").empty();
}

