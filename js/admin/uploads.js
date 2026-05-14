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
const oldRef = ref(
storage,
decodeURIComponent(url.split("/o/")[1].split("?")[0])
);
await deleteObject(oldRef);
}catch(err){
console.log("Old delete skipped");
}
}

function getCard(field){
return document.querySelector(`[data-field="${field}"]`);
}

function showUI(field,url){
const preview=document.getElementById(field+"Preview");
const actions=getCard(field).querySelector(".upload-actions");

preview.src=url;
preview.style.display="block";
actions.style.display="flex";
}

function hideUI(field){
const preview=document.getElementById(field+"Preview");
const actions=getCard(field).querySelector(".upload-actions");
const progress=document.getElementById(field+"Progress");

preview.src="";
preview.style.display="none";
actions.style.display="none";
progress.style.display="none";
progress.value=0;
}

async function uploadFile(field,file){
if(!validateFile(file)) return;

const progress=document.getElementById(field+"Progress");
const hiddenInput=document.getElementById(field);

progress.style.display="block";

await removeOldFile(hiddenInput.value);

const fileName=`${field}_${Date.now()}_${file.name}`;
const storageRef=ref(storage,"college-assets/"+fileName);

const task=uploadBytesResumable(storageRef,file);

task.on(
"state_changed",
(snapshot)=>{
const percent=(snapshot.bytesTransferred/snapshot.totalBytes)*100;
progress.value=percent;
},
(error)=>{
alert(error.message);
},
async ()=>{
const url=await getDownloadURL(task.snapshot.ref);

hiddenInput.value=url;
showUI(field,url);
}
);
}

uploadFields.forEach((field)=>{
const input=document.getElementById(field+"File");

if(input){
input.addEventListener("change",(e)=>{
const file=e.target.files[0];
uploadFile(field,file);
});
}
});

window.triggerUpload=function(field){
document.getElementById(field+"File").click();
};

window.deleteUploadedImage=async function(field){
const hiddenInput=document.getElementById(field);

if(hiddenInput.value){
await removeOldFile(hiddenInput.value);
}

hiddenInput.value="";
hideUI(field);
};

window.restoreUploadPreview=function(field,url){
if(url){
showUI(field,url);
}
};