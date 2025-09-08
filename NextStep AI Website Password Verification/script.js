const formSection = document.getElementById("formSection");

const modal = document.getElementById("authModal");

const loginModal = document.getElementById("loginModal");
const signupModal = document.getElementById("signupModal");

function openModal(show = "signup") {
  modal.style.display = "flex";
  if (show == "login") {
    loginModal.style.display = "block";
    signupModal.style.display = "none"
  } else {
    signupModal.style.display = "block";
    loginModal.style.display = "none";
  }
}

function closeModal() {
  modal.style.display = "none";
}

function switchToSignup() {
  loginModal.style.display = "none";
  signupModal.style.display = "block";

  toggleDisabilityOptions();
}

function switchToLogin() {
  signupModal.style.display = "none";
  loginModal.style.display = "block";
}

function toggleDisabilityOptions() {
  const select = document.getElementById("disabilitySelect");
  const options = document.getElementById("disabilityOptions");
  if (!select || !options) return;

  options.style.display = select.value === "yes" ? "flex" : "none";
}

function handleLogin() {
  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value.trim();

  if (!email || !password) {
    alert("Please fill in all fields.");
    return;
  }

  // reusing your auth logic idea
  document.getElementById("authButtons").style.display = "none";
  document.getElementById("userName").style.display = "block";
  document.getElementById("userName").innerText = email;

  modal.style.display = "none";
  formSection.style.display = "block";
}

/* SIGN UP */
function handleSignup() {
  const name = document.getElementById("signupName").value.trim();
  const id = document.getElementById("signupID").value.trim();
  const matricYear = document.getElementById("matricYear").value.trim();
  const email = document.getElementById("signupEmail").value.trim();
  const pass = document.getElementById("signupPassword").value.trim();
  const confirmPass = document.getElementById("confirmPassword").value.trim();

  // reuse your name validation
  if (!/^[A-Za-z\s]+$/.test(name)) {
    alert("Name MUST contain Alphabets & Spaces");
    return;
  }

  /*
  // reuse your ID validation
  if (!/^\d+$/.test(id) || id.length !== 13) {
    alert("ID must be exactly 13 digits.");
    return;
  }*/

  // ✅ Validate SA ID properly
  const idInfo = validateSAID(id);
  if (!idInfo) {
    alert("Invalid South African ID number.");
    return;
  }

  if (!matricYear) {
    alert("Please enter your matric year.");
    return;
  }

  /*
  // ✅ Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    alert("Please enter a valid email address.");
    return;
  }*/

  // Allow Gmail, Google Workspace, and iCloud emails
  const emailRegex = /^[a-zA-Z0-9._%+-]+@((gmail\.com)|(icloud\.com)|(me\.com)|(mac\.com)|([a-zA-Z0-9.-]+\.[a-zA-Z]{2,}))$/i;
  if (!emailRegex.test(email)) {
    alert("Please enter a valid Google or iCloud email address.");
    return;
  }

  // After signup, simulate login
  document.getElementById("studentName").value = name;
  document.getElementById("studentID").value = id;
  document.getElementById("matricYear").value = matricYear;
  document.getElementById("studentGender").value = idInfo.gender;
  document.getElementById("studentAge").value = idInfo.age;

  // Show gender & age (you can create read-only inputs in your form)
  alert(`Signup successful!\nGender: ${idInfo.gender}\nAge: ${idInfo.age}`);

  document.getElementById("authButtons").style.display = "none";
  document.getElementById("userName").style.display = "block";
  document.getElementById("userName").innerText = name;


  modal.style.display = "none";
  formSection.style.display = "block";
}

//Function Validate SA ID number 
function validateSAID(id) {
  if (!/^\d{13}$/.test(id)) return false;

  // 1. Extract date of birth
  const yy = parseInt(id.substring(0, 2), 10);
  const mm = parseInt(id.substring(2, 4), 10);
  const dd = parseInt(id.substring(4, 6), 10);

  // Assume 1900s/2000s
  const currentYear = new Date().getFullYear() % 100;
  const century = yy <= currentYear ? 2000 : 1900;
  const birthYear = century + yy;

  const birthDate = new Date(birthYear, mm - 1, dd);
  if (
    birthDate.getFullYear() !== birthYear ||
    birthDate.getMonth() + 1 !== mm ||
    birthDate.getDate() !== dd
  ) {
    return false; // invalid date
  }

  // Gender: digits 7–10 (index 6–9)
  const genderCode = parseInt(id.substring(6, 10), 10);
  const gender = genderCode < 5000 ? "Female" : "Male";


  // 2. Citizenship digit
  const citizenship = parseInt(id.charAt(10), 10);
  if (citizenship !== 0 && citizenship !== 1) {
    return false;
  }

  // 3. Luhn checksum validation
  let sum = 0;
  let alt = false;
  for (let i = id.length - 1; i >= 0; i--) {
    let num = parseInt(id.charAt(i), 10);
    if (alt) {
      num *= 2;
      if (num > 9) num -= 9;
    }
    sum += num;
    alt = !alt;
  }
  if (sum % 10 !== 0) return null;

  // Age
  const today = new Date();
  let age = today.getFullYear() - birthYear;
  const hasHadBirthday =
    today.getMonth() > birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate());
  if (!hasHadBirthday) age--;

  return { birthDate, age, gender, citizenship: citizenship === 0 ? "Citizen" : "Resident" };

}

// SEARCH (in body)
function startSearch() {
  if (document.getElementById("userName").style.display === "none") {
    openModal();
  } else {
    formSection.style.display = "block";
  }
}

function clampNumeric(el, min, max) {
  el.addEventListener('input', () => {
    if (el.value === '') return;
    const v = parseInt(el.value, 10);
    if (isNaN(v)) { el.value = ''; return; }
    if (v > max) el.value = String(max);
    else if (v < min) el.value = String(min);
  });
  el.addEventListener('blur', () => {
    if (el.value === '') return;
    let v = parseInt(el.value, 10);
    if (isNaN(v)) v = min;
    if (v > max) v = max;
    if (v < min) v = min;
    el.value = String(v);
  });

  // No notation & signs in number inputs
  el.addEventListener('keydown', (e) => {
    if (['e', 'E', '+', '-', '.'].includes(e.key)) e.preventDefault();
  });
}

function addSubject(subject, selectElement) {
  if (!subject) return;

  const table = document.getElementById('subjectTable');
  const rowCount = table.rows.length - 1; // exclude header

  // Max 12 subjects
  if (rowCount >= 12) {
    alert('You can only select up to 12 subjects.');
    if (selectElement) selectElement.value = '';
    return;
  }

  // Prevent duplicates
  for (let i = 1; i < table.rows.length; i++) {
    if (table.rows[i].cells[0].innerText === subject) {
      alert(subject + ' already added!');
      if (selectElement) selectElement.value = '';
      return;
    }
  }

  // Build row with real DOM nodes (so listeners work reliably)
  const row = table.insertRow();
  const c1 = row.insertCell(0);
  const c2 = row.insertCell(1);
  const c3 = row.insertCell(2);
  const c4 = row.insertCell(3);

  c1.textContent = subject;

  // Marks: 0–100
  const marksInput = document.createElement('input');
  marksInput.type = 'number';
  marksInput.placeholder = '%';
  marksInput.min = '0';
  marksInput.max = '100';
  marksInput.step = '1';
  marksInput.inputMode = 'numeric';
  marksInput.pattern = '\\d*';
  clampNumeric(marksInput, 0, 100);
  c2.appendChild(marksInput);

  // APS: 1–7
  const apsInput = document.createElement('input');
  apsInput.type = 'number';
  apsInput.placeholder = 'APS';
  apsInput.min = '1';
  apsInput.max = '7';
  apsInput.step = '1';
  apsInput.inputMode = 'numeric';
  apsInput.pattern = '\\d*';
  clampNumeric(apsInput, 1, 7);
  c3.appendChild(apsInput);

  const btn = document.createElement('button');
  btn.className = 'remove-btn';
  btn.textContent = 'X';
  btn.addEventListener('click', () => row.remove());
  c4.appendChild(btn);

  if (selectElement) selectElement.value = '';
}

function removeRow(btn) {
  let row = btn.parentNode.parentNode;
  row.parentNode.removeChild(row);
}

// Validate subject count on search
function validateSubjects() {
  const table = document.getElementById("subjectTable");
  const rowCount = table.rows.length - 1; // exclude header

  if (rowCount < 7) {
    alert("You must select at least 7 subjects.");
    return;
  }

  if (rowCount > 12) {
    alert("You cannot select more than 12 subjects.");
    return;
  }

  alert("Subjects validated. Proceeding with search...");
  // 👉 place search logic here
}
  // Password Verification
document.addEventListener('DOMContentLoaded', function() {
    // Get password-related elements
    const passwordInput = document.getElementById('signupPassword');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const strengthMeter = document.getElementById('strength-meter');
    const strengthText = document.getElementById('strength-text');
    const matchStatus = document.getElementById('match-status');
    
    // Requirements elements
    const lengthRequirement = document.getElementById('length-requirement');
    const uppercaseRequirement = document.getElementById('uppercase-requirement');
    const lowercaseRequirement = document.getElementById('lowercase-requirement');
    const numberRequirement = document.getElementById('number-requirement');
    const specialRequirement = document.getElementById('special-requirement');
    
    // Check password strength
    if (passwordInput) {
        passwordInput.addEventListener('input', function() {
            const password = passwordInput.value;
            checkPasswordStrength(password);
            checkPasswordMatch();
        });
    }
    
    // Check password confirmation match
    if (confirmPasswordInput) {
        confirmPasswordInput.addEventListener('input', checkPasswordMatch);
    }
    
    function checkPasswordStrength(password) {
        let strength = 0;
        
        // Check length
        if (password.length >= 8) {
            strength++;
            if (lengthRequirement) {
                lengthRequirement.classList.add('valid');
                lengthRequirement.innerHTML = '<span>✓</span> At least 8 characters';
            }
        } else {
            if (lengthRequirement) {
                lengthRequirement.classList.remove('valid');
                lengthRequirement.innerHTML = '<span>◯</span> At least 8 characters';
            }
        }
        
        // Check uppercase letters
        if (/[A-Z]/.test(password)) {
            strength++;
            if (uppercaseRequirement) {
                uppercaseRequirement.classList.add('valid');
                uppercaseRequirement.innerHTML = '<span>✓</span> Contains uppercase letters';
            }
        } else {
            if (uppercaseRequirement) {
                uppercaseRequirement.classList.remove('valid');
                uppercaseRequirement.innerHTML = '<span>◯</span> Contains uppercase letters';
            }
        }
        
        // Check lowercase letters
        if (/[a-z]/.test(password)) {
            strength++;
            if (lowercaseRequirement) {
                lowercaseRequirement.classList.add('valid');
                lowercaseRequirement.innerHTML = '<span>✓</span> Contains lowercase letters';
            }
        } else {
            if (lowercaseRequirement) {
                lowercaseRequirement.classList.remove('valid');
                lowercaseRequirement.innerHTML = '<span>◯</span> Contains lowercase letters';
            }
        }
        
        // Check numbers
        if (/[0-9]/.test(password)) {
            strength++;
            if (numberRequirement) {
                numberRequirement.classList.add('valid');
                numberRequirement.innerHTML = '<span>✓</span> Contains numbers';
            }
        } else {
            if (numberRequirement) {
                numberRequirement.classList.remove('valid');
                numberRequirement.innerHTML = '<span>◯</span> Contains numbers';
            }
        }
        
        // Check special characters
        if (/[^A-Za-z0-9]/.test(password)) {
            strength++;
            if (specialRequirement) {
                specialRequirement.classList.add('valid');
                specialRequirement.innerHTML = '<span>✓</span> Contains special characters';
            }
        } else {
            if (specialRequirement) {
                specialRequirement.classList.remove('valid');
                specialRequirement.innerHTML = '<span>◯</span> Contains special characters';
            }
        }
        
        // Update strength meter
        const percent = (strength / 5) * 100;
        if (strengthMeter) {
            strengthMeter.style.width = percent + '%';
        }
        
        // Update strength text and color
        if (password.length === 0) {
            if (strengthText) {
                strengthText.textContent = 'Password strength';
                strengthText.style.color = '#666';
            }
            if (strengthMeter) strengthMeter.style.background = '#eee';
        } else if (strength < 2) {
            if (strengthText) {
                strengthText.textContent = 'Weak';
                strengthText.style.color = '#dc3545';
            }
            if (strengthMeter) strengthMeter.style.background = '#dc3545';
        } else if (strength < 4) {
            if (strengthText) {
                strengthText.textContent = 'Medium';
                strengthText.style.color = '#fd7e14';
            }
            if (strengthMeter) strengthMeter.style.background = '#fd7e14';
        } else {
            if (strengthText) {
                strengthText.textContent = 'Strong';
                strengthText.style.color = '#28a745';
            }
            if (strengthMeter) strengthMeter.style.background = '#28a745';
        }
        
        return strength;
    }
    
    function checkPasswordMatch() {
        if (!passwordInput || !confirmPasswordInput || !matchStatus) return;
        
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        
        if (confirmPassword.length === 0) {
            matchStatus.textContent = 'Passwords must match';
            matchStatus.style.color = '#666';
        } else if (password === confirmPassword) {
            matchStatus.textContent = 'Passwords match!';
            matchStatus.style.color = '#28a745';
        } else {
            matchStatus.textContent = 'Passwords do not match';
            matchStatus.style.color = '#dc3545';
        }
    }
    
    // Update handleSignup function to validate password
    const originalHandleSignup = window.handleSignup;
    window.handleSignup = function() {
        const name = document.getElementById('signupName').value.trim();
        const id = document.getElementById('signupID').value.trim();
        const matricYear = document.getElementById('matricYear').value.trim();
        const email = document.getElementById('signupEmail').value.trim();
        const pass = document.getElementById('signupPassword').value.trim();
        const confirmPass = document.getElementById('confirmPassword').value.trim();
        
        // Check password strength
        const strength = checkPasswordStrength(pass);
        
        // Validate password
        if (strength < 4) {
            alert('Please create a stronger password that meets these requirements:\n\n• At least 8 characters\n• At least one uppercase letter (A-Z)\n• At least one lowercase letter (a-z)\n• At least one number (0-9)\n• At least one special character (!@#$%^&*, etc.)');
            return;
        }
        
        // Check if passwords match
        if (pass !== confirmPass) {
            alert('Passwords do not match. Please confirm your password.');
            return;
        }
        
        // Call the original handleSignup function if all validations pass
        if (originalHandleSignup) {
            originalHandleSignup();
        }
    };
});
