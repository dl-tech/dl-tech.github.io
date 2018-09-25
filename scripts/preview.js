var enableImageResize = true;

var current = null;
var left = null;
var right = null;

var moveLeft = function (e) {

    e.stopPropagation();

            if ( left === null ) {

                var fakeLeft = document.getElementById("gallery").lastChild;
                current.onclick(e);
                fakeLeft.onclick(e);
            }
            else {

                var previousLeft = left;
                current.onclick(e);
                previousLeft.onclick(e);
            }
}

var moveRight = function (e) {

    e.stopPropagation();

            if ( right === null ) {

                var fakeRight = document.getElementById("gallery").firstChild;
                current.onclick(e);
                fakeRight.onclick(e);
            }
            else {

                var previousRight = right;
                current.onclick(e);
                previousRight.onclick(e);
            }
}

window.onkeypress = function (e) {

    if ( current != null ) {

        if ( e.keyCode === 37 ) {

            moveLeft(e);
        }
        else if ( e.keyCode === 39 ) {

            moveRight(e);
        }
    }
    else {

        console.log("nothing should happend");
    }
}

function previewNextImage(previewIndex) {

	displayProgressBar(dictionary.LOADING_PREVIEW, ((previewIndex)*100)/(lastpull.length));

	if ( previewIndex < lastpull.length ) {

		// more info about select files to upload limit on windows chrome at:
		// https://stackoverflow.com/questions/15851751/what-is-the-max-number-of-files-to-select-in-an-html5-multiple-file-input

		var b = new FileReader();

        //TODO don't declare functions in a bucle

		b.onload = function(e) {

		    var gallery = document.getElementById("gallery");

		    var sample = document.createElement("div");
		    sample.setAttribute("class", "sample");

            sample.onclick = function () {
 
                window.left = this.previousSibling;
                window.right = this.nextSibling;

                var usurpador = this.cloneNode(true);

                usurpador.onclick = function (e) {

                    //e.stopPropagation();
                };

                usurpador.style.width = "auto";
                usurpador.style.height = "auto";

                usurpador.style.margin = "0px";

                usurpador.firstChild.style.width = "300px";
                usurpador.firstChild.style.height = "300px";

                usurpador.lastChild.style.fontSize = "26px";
                usurpador.lastChild.style.width = "300px";
                usurpador.lastChild.style.height = "200px";

                createDialogBox(usurpador);
            }

		    var image = sample.appendChild( document.createElement("img") );

            image.onload = function () {

				if ( enableImageResize && (this.width > 50 || this.height > 50) ) {

					uploadContainer.file("files/"+(alreadyRequested + counterstrike + previewIndex)+".jpg", resize(this), {base64: true});
				}
				else {

					uploadContainer.file("files/"+(alreadyRequested + counterstrike + previewIndex)+".jpg", lastpull[previewIndex]);
				}

				previewNextImage( previewIndex + 1 );
            }
			image.setAttribute("src", e.target.result);

		    var details = sample.appendChild(document.createElement("div"));
		    details.setAttribute("class", "details");

		    var filename = details.appendChild(document.createElement("span"));
			filename.innerHTML = lastpull[previewIndex].name;

		    var percent = details.appendChild(document.createElement("span"));
			percent.setAttribute("id", "status-" + (alreadyRequested + counterstrike + previewIndex));
            percent.innerHTML = "";

		    var labelname = details.appendChild(document.createElement("span"));
			labelname.setAttribute("id", "clase-" + (alreadyRequested + counterstrike + previewIndex));
            labelname.innerHTML = "";

			gallery.appendChild(sample);
		}

		b.readAsDataURL( lastpull[previewIndex] );
	}
	else {

        counterstrike += lastpull.length;

		/* Tricky */
		$("#star-platinum").trigger("reset");

		$("#button-predict").prop("disabled", false);
		$("#button-reset").prop("disabled", false);
		displayContent();
	}
}

