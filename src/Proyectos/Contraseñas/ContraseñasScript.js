const lengthSlider = document.getElementById("length");
const lengthValue = document.getElementById("lengthValue");
const passwordCard = document.getElementById("passwordCard");
const strengthBar = document.getElementById("strengthBar");
const customInput = document.getElementById("customInput");
const customStrengthBar = document.getElementById("customStrengthBar");

const uppercase = document.getElementById("uppercase");
const lowercase = document.getElementById("lowercase");
const numbers = document.getElementById("numbers");
const symbols = document.getElementById("symbols");
const usePassphrase = document.getElementById("usePassphrase");
const langSelect = document.getElementById("langSelect");
const leetMode = document.getElementById("leetMode");

const generateBtn = document.getElementById("generate");
const copyBtn = document.getElementById("copy");
const downloadBtn = document.getElementById("download");

lengthSlider.addEventListener("input", () => {
  lengthValue.textContent = lengthSlider.value;
});

usePassphrase.addEventListener("change", () => {
  langSelect.style.display = usePassphrase.checked ? "block" : "none";
  leetMode.parentElement.style.display = usePassphrase.checked ? "block" : "none";
});

generateBtn.addEventListener("click", () => {
  generateAndDisplayPassword();
});

copyBtn.addEventListener("click", () => {
  navigator.clipboard.writeText(passwordCard.textContent)
    .then(() => alert("¡Contraseña copiada!"))
    .catch(() => alert("No se pudo copiar."));
});

downloadBtn.addEventListener("click", () => {
  const blob = new Blob([passwordCard.textContent], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.download = 'contraseña.txt';
  link.href = url;
  link.click();
  URL.revokeObjectURL(url);
});

customInput.addEventListener("input", () => {
  const strength = calculateStrength(customInput.value);
  updateStrengthBar(customStrengthBar, strength);
});

async function generateAndDisplayPassword() {
  const length = parseInt(lengthSlider.value);
  const passphraseMode = usePassphrase.checked;
  const lang = langSelect.value;

  let password = "";

  if (passphraseMode) {
    const wordCount = Math.max(3, Math.floor(length / 4));
    const useLeet = leetMode.checked;
    password = await generatePassphraseFromAPI(wordCount, lang, useLeet);
  } else {
    const hasUpper = uppercase.checked;
    const hasLower = lowercase.checked;
    const hasNumber = numbers.checked;
    const hasSymbol = symbols.checked;

    if (!hasUpper && !hasLower && !hasNumber && !hasSymbol) {
      passwordCard.textContent = "⚠️ Selecciona al menos una opción de caracteres.";
      return;
    }

    password = generatePassword(length, hasUpper, hasLower, hasNumber, hasSymbol);
  }

  passwordCard.textContent = password;
  const strength = calculateStrength(password);
  updateStrengthBar(strengthBar, strength);
  passwordCard.classList.add("fade-in");
  setTimeout(() => passwordCard.classList.remove("fade-in"), 500);
}

function generatePassword(length, upper, lower, number, symbol) {
  const upperChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowerChars = "abcdefghijklmnopqrstuvwxyz";
  const numberChars = "0123456789";
  const symbolChars = "!@#$%^&*()_+[]{}<>?/|";

  let charSet = "";
  if (upper) charSet += upperChars;
  if (lower) charSet += lowerChars;
  if (number) charSet += numberChars;
  if (symbol) charSet += symbolChars;

  let password = "";
  for (let i = 0; i < length; i++) {
    const randIndex = Math.floor(Math.random() * charSet.length);
    password += charSet[randIndex];
  }

  return password;
}

function applyLeetSpeak(word) {
  const leetMap = {
    a: '@', e: '3', i: '1', o: '0', s: '$', l: '1', t: '7'
  };
  return word.split('').map(char => {
    const lowerChar = char.toLowerCase();
    return leetMap[lowerChar] !== undefined ? leetMap[lowerChar] : char;
  }).join('');
}

async function getWordsFromAPI(count = 4, lang = 'es') {
  try {
    const response = await fetch(`https://random-word-api.herokuapp.com/word?number=${count}&lang=${lang}`);
    if (!response.ok) throw new Error("API falló");
    return await response.json();
  } catch (err) {
    console.error('Error al obtener palabras:', err);
    return ["error", "al", "generar", "frase"];
  }
}

async function generatePassphraseFromAPI(wordCount = 4, lang = 'es', useLeet = false) {
  const words = await getWordsFromAPI(wordCount, lang);
  const symbols = "!@#$%&*-_";
  const transformed = useLeet ? words.map(w => applyLeetSpeak(w)) : words;
  return transformed.join('-') + symbols[Math.floor(Math.random() * symbols.length)];
}

function calculateStrength(password) {
  let strength = 0;
  if (password.length >= 8) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[a-z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^A-Za-z0-9]/.test(password)) strength++;
  return strength;
}

function updateStrengthBar(bar, strength) {
  const percentage = (strength / 5) * 100;
  bar.style.width = percentage + "%";
  bar.className = "strength-meter-fill";
  if (strength <= 2) bar.classList.add("strength-weak");
  else if (strength <= 4) bar.classList.add("strength-medium");
  else bar.classList.add("strength-strong");
}

window.addEventListener("load", () => {
  langSelect.style.display = usePassphrase.checked ? "block" : "none";
  leetMode.parentElement.style.display = usePassphrase.checked ? "block" : "none";
  generateAndDisplayPassword();
});