import Hacker from '../../images/avatarIcons/hacker.png';
import Programmer from '../../images/avatarIcons/programmer.png';
import Astronaut from '../../images/avatarIcons/astronaut.png'
import Lawyer from '../../images/avatarIcons/lawyer.png';
import BusinessMan from '../../images/avatarIcons/business-man.png';
import Woman from '../../images/avatarIcons/woman.png';

/**
 * getAvatar: React function component for retrieving avatar images
 * @param {*} avatarID: ID of the avatar to be returned
 * @returns image object, depending on the avatarID given
 */
export default function getAvatar(avatarID){
    //switch statement for avatarID
    //image returned depends on the ID given
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