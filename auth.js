// auth.js

// ฟังก์ชัน login (หน้า login.html)
function handleLogin(event) {
  event.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const username = email.split('@')[0];
  if (email && password) {
    localStorage.setItem("username", username);
    window.location.href = "MainWeb.html";
  }
}

// ฟังก์ชันสมัครสมาชิก (หน้า signup.html)
function handleSignUp(event) {
  event.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirm-password').value;
  if (password !== confirmPassword) {
    alert("รหัสผ่านไม่ตรงกัน กรุณาลองอีกครั้ง");
    return;
  }
  if (email && password) {
    var successModal = new bootstrap.Modal(document.getElementById('successModal'));
    successModal.show();
  }
}

// *** ฟังก์ชันใหม่สำหรับหน้าลืมรหัสผ่าน ***

// 1. ฟังก์ชันสำหรับเปลี่ยนจาก Step 1 (กรอกอีเมล) ไป Step 2 (ตั้งรหัสใหม่)
function moveToResetStep() {
  const email = document.getElementById('email').value;
  if (!email) {
    alert("กรุณากรอกอีเมลของคุณ");
    return;
  }
  // ซ่อน Step 1 และแสดง Step 2
  document.getElementById('step1-request-email').style.display = 'none';
  document.getElementById('step2-reset-password').style.display = 'block';
}

// 2. ฟังก์ชันสำหรับจัดการการตั้งรหัสผ่านใหม่ (เมื่อกด submit)
function handleResetPassword(event) {
  event.preventDefault();
  const newPassword = document.getElementById('new-password').value;
  const confirmNewPassword = document.getElementById('confirm-new-password').value;

  if (newPassword !== confirmNewPassword) {
    alert("รหัสผ่านใหม่ไม่ตรงกัน กรุณาลองอีกครั้ง");
    return;
  }
  
  if(newPassword) {
    // แสดง Modal ว่าเปลี่ยนรหัสผ่านสำเร็จ
    var successModal = new bootstrap.Modal(document.getElementById('passwordResetSuccessModal'));
    successModal.show();
  }
}


// ฟังก์ชัน logout
function logout() {
  localStorage.removeItem("username");
  window.location.href = "login.html";
}

// ฟังก์ชัน render เมนูโปรไฟล์
function renderAuthMenu() {
  const username = localStorage.getItem("username");
  const authMenu = document.getElementById('authMenu');
  if (!authMenu) return;
  if (username) {
    authMenu.innerHTML = `
      <div class="dropdown">
        <button class="btn btn-outline-warning dropdown-toggle" type="button" data-bs-toggle="dropdown">
          <i class="bi bi-person-circle"></i> ${username}
        </button>
        <ul class="dropdown-menu dropdown-menu-end">
          <li><a class="dropdown-item" href="profile.html">โปรไฟล์ของฉัน</a></li>
          <li><a class="dropdown-item" href="#" onclick="logout()">ออกจากระบบ</a></li>
        </ul>
      </div>
    `;
  } else {
    authMenu.innerHTML = "";
  }
}

// โหลดหน้า MainWeb.html → render เมนูโปรไฟล์
window.onload = () => {
  if (document.getElementById('authMenu')) {
    renderAuthMenu();
  }
};





  //close navbar open for cick login 
function renderAuthMenu() {
  const username = localStorage.getItem("username");
  const authMenu = document.getElementById('authMenu');
  const loginContainer = document.getElementById('loginContainer');
  const navbar = document.querySelector(".navbar");
  const videoCarousel = document.getElementById("videoCarousel");

  if (username) {
    
    if (navbar) navbar.style.display = "flex";
    if (videoCarousel) videoCarousel.style.display = "block";

    
    authMenu.innerHTML = `
      <div class="dropdown">
        <button class="btn btn-outline-warning dropdown-toggle" type="button" data-bs-toggle="dropdown">
          <i class="bi bi-person-circle"></i>
        </button>
        <ul class="dropdown-menu dropdown-menu-end">
          <li><a class="dropdown-item" href="profile.html">โปรไฟล์ของฉัน</a></li>
          <li><a class="dropdown-item" href="#" onclick="logout()">ออกจากระบบ</a></li>
        </ul>
      </div>
    `;

    
    if (loginContainer) loginContainer.style.display = "none";

  } else {
    
    if (navbar) navbar.style.display = "none";

    
    if (loginContainer) loginContainer.style.display = "block";

    if (videoCarousel) videoCarousel.style.display = "none";
  }
}