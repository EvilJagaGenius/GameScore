import io from "socket.io-client";
import Cookies from 'js-cookie';

export const Socket = io("http://gamescore.gcc.edu:5000");
Socket.emit("join",Cookies.get('credHash'),Cookies.get('username'))
