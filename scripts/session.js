
var logoutTimeout = 0;
var logoutTimeoutTime = 5 * 1000;// 5 seconds

function logout() {

    setCookie("token", "");
    displayLoadingMessage("Cerrando sesión");

    logoutTimeout = setTimeout(function () {

        displayLoginForm();

    }, logoutTimeoutTime);

    ws.onclose = function () {

        clearTimeout(logoutTimeout);
        displayLoginForm();
    }
    ws.close();
}

function session() {

    var user = $("#user");
    var pass = $("#pass");

    if ( user.val() == "" ) {

        alert(dictionary.ENTER_YOUR_USERNAME);
    }
    else if ( pass.val() == "" ) {

        alert(dictionary.ENTER_YOUR_PASSWORD);
    }
    else {

        displayLoadingMessage(dictionary.LOGIN_MESSAGE);

		$.ajax({

			url : webserviceURL + "login.php",
			type : 'POST',
            data : {
                user : user.val(),
                pass : pass.val()
            },
			success : function(data) {

                parseSessionData(data);
			},
            error : function () {

                displayDialogMessage(dictionary.LOGIN_CONNECTION_ERROR_TITLE, dictionary.LOGIN_CONNECTION_ERROR_MESSAGE);
            }
		});

        pass.val("");
    }

	return false;
}

function sessioncheck() {

    token = getCookie("token");

    if (token != "") {

        displayLoadingMessage(dictionary.VALIDATING_SESSION_MESSAGE);

		$.ajax({

			url : webserviceURL + 'validate.php',
			type : 'POST',
            data : {

                data : token
            },
			success : function(data) {

                parseSessionData(data);
			},
            error : function () {

                displayDialogMessage(dictionary.LOGIN_CONNECTION_ERROR_TITLE, dictionary.LOGIN_CONNECTION_ERROR_MESSAGE);
            }
		});
    }
    else {

        displayLoginForm();
    }
}

function parseSessionData(data) {

    data = data.split(",");

    switch ( data[0] ) {

        case "success":

            setUserName( atob(data[2]) );
            setCookie("token", data[3] + "|" + data[1] );
            startWebsocket();
            break;

        case "error":

            alert(dictionary.DISPLAY_ERROR + data[1]);
            setCookie("token", "");
            displayLoginForm();
            break;

        default:

            alert(dictionary.UNHANDLED_ERROR + data[1]);
            setCookie("token", "");
            displayLoginForm();
    }
}
