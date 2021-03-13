import io from "socket.io-client";
import Cookies from 'js-cookie';

export default class MySocket
{
	constructor()
	{
		this.personalSocket = io("gamescore.gcc.edu:5000");
		//this.personalSocket = io("localhost:5000");
		this.personalSocket.emit("join",Cookies.get('credHash'),Cookies.get('username'))
		console.log("SOcket Started")

		this.personalSocket.on('connect_error', function() {
		    console.log('Socket could not connect to server.  Refresh the page to retry Socket connection.');
		});
	}

	get getMySocket()
	{
		return this.personalSocket;
	}

}

