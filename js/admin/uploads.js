import { storage } from "../../firebase-config.js";
import {
ref,
uploadBytesResumable,
getDownloadURL,
deleteObject
} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-storage.js";

const MAX_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = [
"image/png",
"image/jpeg",
"image/webp"
];

const uploadFields = [
"transparentLogo",
"whiteLogo",
"principalSignature",
"watermark"
];

function validateFile(file){
if(!file){
alert("No file selected");
return false;
}

if(!ALLOWED_TYPES.includes(file.type)){
alert("Only PNG / JPG / WebP allowed");
return false;
}

if(file.size > MAX_SIZE){
alert("Max file size is 5MB");
return false;
}

return true;
}

async function removeOldFile(url){
if(!url) return;

try{
const oldRef = ref(storage, url);
await deleteObject(oldRef);
}catch(err){
console.log("Old file delete skipped");
}
}

async function uploadFile(field,file){
if(!validateFile(file)) return;

const progressBar = document.getElementById(field + "Progress");
const hiddenInput = document.getElementById(field);
const preview = document.getElementById(field + "Preview");

await removeOldFile(hiddenInput.value);

const fileName = `${field}_${Date.now()}_${file.name}`;
const storageRef = ref(storage, "college-assets/" + fileName);

const task = uploadBytesResumable(storageRef,file);

task.on(
"state_changed",
(snapshot)=>{
const percent = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
progressBar.value = percent;
},
(error)=>{
alert(error.message);
},
async ()=>{
const url = await getDownloadURL(task.snapshot.ref);

hiddenInput.value = url;
preview.src = url;
preview.style.display = "block";
progressBar.value = 100;
}
);
}

uploadFields.forEach((field)=>{
const fileInput = document.getElementById(field + "File");

if(fileInput){
fileInput.addEventListener("change",(e)=>{
const file = e.target.files[0];
uploadFile(field,file);
});
}
});

window.deleteUploadedImage = async function(field){
const hiddenInput = document.getElementById(field);
const preview = document.getElementById(field + "Preview");
const progressBar = document.getElementById(field + "Progress");

if(hiddenInput.value){
await removeOldFile(hiddenInput.value);
}

hiddenInput.value = "";
preview.src = "";
preview.style.display = "none";
progressBar.value = 0;
};