const CLOUD_NAME = "dvaua0cyk";
const UPLOAD_PRESET = "student_id_uploads";

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
  if(!file) return false;

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

function getCard(field){
  return document.querySelector(`[data-field="${field}"]`);
}

function showUI(field,url){
  const preview=document.getElementById(field+"Preview");
  const actions=getCard(field).querySelector(".upload-actions");
  const progress=document.getElementById(field+"Progress");

  preview.src=url;
  preview.style.display="block";
  actions.style.display="flex";
  progress.style.display="none";
  progress.value=0;
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

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);
  formData.append("folder", "student-id-cms");

  try{
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      {
        method:"POST",
        body:formData
      }
    );

    const data = await response.json();

    if(!data.secure_url){
      throw new Error("Upload failed");
    }

    hiddenInput.value = data.secure_url;
    showUI(field,data.secure_url);

  }catch(err){
    alert(err.message);
    progress.style.display="none";
  }
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

window.deleteUploadedImage=function(field){
  const hiddenInput=document.getElementById(field);

  hiddenInput.value="";
  hideUI(field);
};

window.restoreUploadPreview=function(field,url){
  if(url){
    showUI(field,url);
  }
};