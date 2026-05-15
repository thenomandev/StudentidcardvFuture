export function showToast(message, type = "success") {
  let container = document.getElementById("toastContainer");

  if (!container) {
    container = document.createElement("div");
    container.id = "toastContainer";
    container.style.position = "fixed";
    container.style.top = "20px";
    container.style.left = "50%";
    container.style.transform = "translateX(-50%)";
    container.style.zIndex = "9999999";
    container.style.display = "flex";
    container.style.flexDirection = "column";
    container.style.alignItems = "center";
    container.style.gap = "12px";
    container.style.width = "calc(100% - 32px)";
    container.style.maxWidth = "420px";
    container.style.pointerEvents = "none";
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");

  const colors = {
    success: "linear-gradient(135deg,#16a34a,#22c55e)",
    error: "linear-gradient(135deg,#dc2626,#ef4444)",
    warning: "linear-gradient(135deg,#d97706,#f59e0b)",
    info: "linear-gradient(135deg,#2563eb,#3b82f6)"
  };

  toast.style.background = colors[type] || colors.success;
  toast.style.color = "#fff";
  toast.style.padding = "14px 18px";
  toast.style.borderRadius = "16px";
  toast.style.fontWeight = "600";
  toast.style.fontSize = "14px";
  toast.style.boxShadow = "0 12px 35px rgba(0,0,0,.35)";
  toast.style.transform = "translateY(-20px)";
  toast.style.opacity = "0";
  toast.style.transition = "all .35s ease";
  toast.style.width = "100%";
  toast.style.textAlign = "center";
  toast.style.wordBreak = "break-word";
  toast.style.pointerEvents = "auto";

  toast.textContent = message;

  container.appendChild(toast);

  requestAnimationFrame(() => {
    toast.style.transform = "translateY(0)";
    toast.style.opacity = "1";
  });

  setTimeout(() => {
    toast.style.transform = "translateY(-20px)";
    toast.style.opacity = "0";
    setTimeout(() => toast.remove(), 350);
  }, 3000);
}

export function showConfirm(title, message) {
  return new Promise((resolve) => {
    const overlay = document.createElement("div");
    overlay.style.position = "fixed";
    overlay.style.inset = "0";
    overlay.style.background = "rgba(0,0,0,.6)";
    overlay.style.backdropFilter = "blur(8px)";
    overlay.style.zIndex = "9999998";
    overlay.style.display = "flex";
    overlay.style.alignItems = "center";
    overlay.style.justifyContent = "center";
    overlay.style.padding = "20px";

    const modal = document.createElement("div");
    modal.style.width = "100%";
    modal.style.maxWidth = "380px";
    modal.style.background = "#111827";
    modal.style.border = "1px solid rgba(255,255,255,.08)";
    modal.style.borderRadius = "24px";
    modal.style.padding = "24px";
    modal.style.boxShadow = "0 20px 60px rgba(0,0,0,.45)";
    modal.style.color = "#fff";

    modal.innerHTML = `
      <h3 style="margin:0 0 10px;font-size:20px;font-weight:700;">${title}</h3>
      <p style="margin:0 0 20px;color:#cbd5e1;line-height:1.5;">${message}</p>
      <div style="display:flex;gap:12px;">
        <button id="cancelBtn" style="flex:1;padding:14px;border:none;border-radius:14px;background:#374151;color:#fff;font-weight:600;">Cancel</button>
        <button id="okBtn" style="flex:1;padding:14px;border:none;border-radius:14px;background:linear-gradient(135deg,#dc2626,#ef4444);color:#fff;font-weight:700;">Delete</button>
      </div>
    `;

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    modal.querySelector("#cancelBtn").onclick = () => {
      overlay.remove();
      resolve(false);
    };

    modal.querySelector("#okBtn").onclick = () => {
      overlay.remove();
      resolve(true);
    };
  });
}