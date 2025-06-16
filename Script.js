
async function generateKey() {
  return await window.crypto.subtle.generateKey(
    {
      name: "AES-GCM",
      length: 256,
    },
    true,
    ["encrypt", "decrypt"]
  );
}

async function encryptData(key, data) {
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const encodedData = new TextEncoder().encode(data);
  const ciphertext = await window.crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv: iv,
    },
    key,
    encodedData
  );
  return { ciphertext, iv };
}

async function decryptData(key, ciphertext, iv) {
  const decryptedData = await window.crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv: iv,
    },
    key,
    ciphertext
  );
  return new TextDecoder().decode(decryptedData);
}

document.getElementById("encryptBtn").addEventListener("click", async () => {
  const inputText = document.getElementById("inputText").value;
  const key = await generateKey();
  const { ciphertext, iv } = await encryptData(key, inputText);
  document.getElementById("outputText").value = `Ciphertext: ${new TextDecoder().decode(ciphertext)}\nIV: ${new TextDecoder().decode(iv)}`;
});

document.getElementById("decryptBtn").addEventListener("click", async () => {
  const inputText = document.getElementById("inputText").value;
  const key = await generateKey();
  const [ciphertextStr, ivStr] = inputText.split('\n');
  const ciphertext = new TextEncoder().encode(ciphertextStr.replace('Ciphertext: ', ''));
  const iv = new TextEncoder().encode(ivStr.replace('IV: ', ''));
  const decryptedText = await decryptData(key, ciphertext, iv);
  document.getElementById("outputText").value = `Decrypted Text: ${decryptedText}`;
});
