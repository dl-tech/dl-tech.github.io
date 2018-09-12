
function previewNextImage(previewIndex, startAt) {

	displayProgressBar(dictionary.LOADING_PREVIEW, ((previewIndex-startAt)*100)/(lastpull.length-startAt));

	if ( previewIndex < lastpull.length ) {

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

					uploadContainer.file("files/"+previewIndex+".jpg", lastpull[previewIndex], {base64: true});
				}

				previewNextImage( previewIndex + 1, startAt );
            }
			n.firstChild.setAttribute("src", e.target.result);
			n.lastChild.firstChild.innerHTML = lastpull[previewIndex].name;
			n.lastChild.firstChild.nextSibling.setAttribute("id", "status-" + (alreadyRequested+previewIndex));
			n.lastChild.lastChild.setAttribute("id", "clase-" + (alreadyRequested+previewIndex));

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

