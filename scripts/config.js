
var websocketURL;

if ( location.protocol == "https:" ) {

	websocketURL = "wss://demonicgateway.ddns.net/ws-dltech/";
}
else if ( location.host == "localhost" ) {

	websocketURL = "ws://localhost:9091"
}
else {
	
	websocketURL = "ws://demonicgateway.ddns.net:9091";
}

