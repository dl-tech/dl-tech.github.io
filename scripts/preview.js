var enableImageResize = true;

function previewNextImage(previewIndex, startAt) {

	displayProgressBar(dictionary.LOADING_PREVIEW, ((previewIndex-startAt)*100)/(lastpull.length-startAt));

	if ( previewIndex < lastpull.length ) {

		// more info about select files to upload limit on windows chrome at:
		// https://stackoverflow.com/questions/15851751/what-is-the-max-number-of-files-to-select-in-an-html5-multiple-file-input

		var b = new FileReader();

        //TODO don't declare functions in a bucle

		b.onload = function(e) {

		    var gallery = document.getElementById("gallery");
		    var previewNode = document.createElement("div");

		    previewNode.setAttribute("class", "sample");

		    var image = previewNode.appendChild(document.createElement("img"));

		    previewNode.appendChild(document.createElement("div"));

		    var filename = previewNode.lastChild.appendChild(document.createElement("span"));
		    var percent = previewNode.lastChild.appendChild(document.createElement("span"));
		    var labelname = previewNode.lastChild.appendChild(document.createElement("span"));

            image.onload = function () {

				if ( enableImageResize && (this.width > 50 || this.height > 50) ) {

					uploadContainer.file("files/"+previewIndex+".jpg", resize(this), {base64: true});
				}
				else {

					uploadContainer.file("files/"+previewIndex+".jpg", lastpull[previewIndex]);
				}

				previewNextImage( previewIndex + 1, startAt );
            }
			image.setAttribute("src", e.target.result);

			filename.innerHTML = lastpull[previewIndex].name;
			percent.setAttribute("id", "status-" + (alreadyRequested+previewIndex));
			labelname.setAttribute("id", "clase-" + (alreadyRequested+previewIndex));

			gallery.appendChild(n);
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

