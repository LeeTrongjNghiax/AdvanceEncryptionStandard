const tx = document.getElementsByTagName("textarea");

for (let i = 0; i < tx.length; i++) {
  tx[i].setAttribute("style", "height:" + (tx[i].scrollHeight) + "px;overflow-y:hidden;");
  tx[i].addEventListener("input", resize, false);
}

document.querySelector("#encrypt").addEventListener("click", () => {
    let plain = document.querySelector("#plainText").value;
    let key = document.querySelector("#key").value;
    let cipherInput = document.querySelector("#cipherText");
    let length = document.querySelector("#keySize").options[document.querySelector("#keySize").selectedIndex].value;

    if ( isValidEncrypt(plain, key, length) ) {
        let plainMatrix = [];
		let keyMatrix = [];
		let count = 0;
		let multiOfLength = 0;

		while (multiOfLength * length / 8 < plain.length)
			multiOfLength++;

		console.log(multiOfLength);

		if ( plain.length % (length / 8) != 0 )
			while ( plain.length < (length / 8) * (multiOfLength + 1))
            plain += " ";

		console.log( plain.length );

		for (let k = 0; k < multiOfLength; k++) {
			count = 0;
			let arr = [];

			for (let i = 0; i < 4; i++) {
				arr[i] = [];
				keyMatrix[i] = [];
				for (let j = 0; j < length / 8 / 4; j++) {
					arr[i][j] = zeroPad( plain[k * (length / 8) + count].charCodeAt(0).toString(16), 2 );
					keyMatrix[i][j] = zeroPad( key[count].charCodeAt(0).toString(16), 2 );
					count++;
				}
			}
			plainMatrix.push( arr );
		}

		console.log( plainMatrix );

		let cipherText = "";
		let resultHex = ""

		for (let k = 0; k < plainMatrix.length; k++) {
			let cipherMatrix = encrypt(plainMatrix[k], keyMatrix);

			for (let i = 0; i < cipherMatrix.length; i++) {
				for (let j = 0; j < cipherMatrix[i].length; j++) {
					cipherText += String.fromCharCode( parseInt( cipherMatrix[i][j], 16 ) );
				}
			}

			resultHex += cipherText;
		}
		// console.log(plainMatrix);
		// console.log(keyMatrix);

		console.log(cipherText);

		// document.getElementById("cipherInput").innerText = cipherText;
		cipherInput.value = resultHex;	
    }
});

document.querySelector("#plainTextClear").addEventListener("click", () => {
    document.querySelector("#plainText").value = "";
});

document.querySelector("#advanceSettingButton").addEventListener("click", () => {
    let collapsible = document.querySelector("#advanceSetting");

    if ( collapsible.style.maxHeight )
        collapsible.style.maxHeight = null;
    else 
        collapsible.style.maxHeight = collapsible.scrollHeight * 3 + 'px';
});

document.querySelector("#decrypt").addEventListener("click", () => {
    let plainInput = document.querySelector("#plainText");
    let key = document.querySelector("#key").value;
    let cipher = document.querySelector("#cipherText").value;

    if ( isValidEncrypt(cipher, key, length) ) {
        let plainMatrix = [];
		let keyMatrix = [];
		let count = 0;
		let length = document.querySelector("#keySize").options[document.querySelector("#keySize").selectedIndex].value;

		console.log( cipher );

		for (let i = 0; i < 4; i++) {
			plainMatrix[i] = [];
			keyMatrix[i] = [];
			for (let j = 0; j < length / 8 / 4; j++) {
				plainMatrix[i][j] = zeroPad( cipher[count].charCodeAt(0).toString(16), 2 );
				// plainMatrix[i][j] = cipher.substring(count * 4, count * 4 + 4);
				keyMatrix[i][j] = zeroPad( key[count].charCodeAt(0).toString(16), 2 );
				count++;
			}
		}

		console.log(plainMatrix);
		console.log(keyMatrix);

		let cipherMatrix = decrypt(transposeMatrix( plainMatrix ), keyMatrix);
		let cipherText = "";

		console.log(cipherMatrix);

		for (let i = 0; i < cipherMatrix.length; i++) {
			for (let j = 0; j < cipherMatrix[i].length; j++) {
				cipherText += String.fromCharCode( parseInt( cipherMatrix[i][j], 16 ) );
			}
		}

		console.log(cipherText);

		plainInput.value = cipherText;
    }
});

document.querySelector("#cipherTextClear").addEventListener("click", () => {
    document.querySelector("#cipherText").value = "";
});