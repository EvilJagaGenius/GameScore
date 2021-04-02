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
    case 1:
        return Programmer
    case 2:
        return Astronaut
    case 3:
        return Lawyer
    case 4:
        return BusinessMan
    case 5:
        return Woman
    default:
        return BusinessMan
    }
}