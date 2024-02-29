import userService from '../../service/instagram/users/user';

export function getUsers() {
    
}

export function saveUser() {

}

export async function getUserInfo(id, username) {
    if(id) {
        return userService.getUserInfo(id);
    } else if(username) {
        const user = await userService.getUser(username);
        if(user) return userService.getUserInfo(user.id);
    }
    return false;
}