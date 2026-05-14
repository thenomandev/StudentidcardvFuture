import { auth } from "../../firebase-config.js";
import {
signOut,
onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-auth.js";

function goLogin(){
window.location.href = "../login.html";
}

onAuthStateChanged(auth,(user)=>{
if(!user){
goLogin();
}
});

window.logout = async function(){
await signOut(auth);
goLogin();
};