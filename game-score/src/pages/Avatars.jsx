import io from "socket.io-client";
import Cookies from 'js-cookie';
import Hacker from '../images/avatarIcons/hacker.png';
import Programmer from '../images/avatarIcons/programmer.png';
import Astronaut from '../images/avatarIcons/astronaut.png';
import Lawyer from '../images/avatarIcons/lawyer.png';
import BusinessMan from '../images/avatarIcons/business-man.png';
import Woman from '../images/avatarIcons/woman.png';

export default function getAvatar(avatarID){
switch(avatarID){
    case 0:
        return Hacker
        break;
    case 1:
       return Programmer
        break;
    case 2:
        return Astronaut
        break;
    case 3:
        return Lawyer
        break;
    case 4:
       return BusinessMan
        break;
    case 5:
        return Woman
        break;
    default:
      return BusinessMan
        break;
  
}

}

