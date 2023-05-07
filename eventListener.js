const tx = document.getElementsByTagName("textarea");

for (let i = 0; i < tx.length; i++) {
  tx[i].setAttribute("style", "height:" + (tx[i].scrollHeight * 2) + "px;overflow-y:hidden;");
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
		let multiOfLength = 0;
		let resultHex = "";
		let count = 0;

		console.log("Plain text: " + plain);
		console.log("Key: " + key);

		while (multiOfLength * 16 < plain.length)
			multiOfLength++;

		if ( plain.length % 16 != 0 )
			while ( plain.length < 16 * (multiOfLength))
            	plain += " ";

		for (let i = 0; i < 4; i++) {
			keyMatrix[i] = [];

			for (let j = 0; j < length / 8 / 4; j++) {
				keyMatrix[i][j] = zeroPad( key[count].charCodeAt(0).toString(16), 2 );
				count++;
			}
		}

		for (let k = 0; k < multiOfLength; k++) {
			let count = 0;
			let arr = [];

			for (let i = 0; i < 4; i++) {
				arr[i] = [];

				for (let j = 0; j < 4; j++) {
					arr[i][j] = zeroPad( plain[k * 16 + count].charCodeAt(0).toString(16), 2 );
					count++;
				}
			}

			plainMatrix.push( arr );
		}

		console.log("Plain text to hex: ");
		console.table( plainMatrix );
		console.log("Key to hex: ");
		console.table( keyMatrix );

		for (let k = 0; k < plainMatrix.length; k++) {
			let cipherText = "";
			let cipherMatrix = encrypt(plainMatrix[k], keyMatrix);

			for (let i = 0; i < cipherMatrix.length; i++)
				for (let j = 0; j < cipherMatrix[i].length; j++)
					cipherText += String.fromCharCode( parseInt( cipherMatrix[i][j], 16 ) );

			resultHex += cipherText;

			console.log("Cipher to hex: ");
			console.table( cipherMatrix );
		}

		console.log("Cipher: " + resultHex);
		console.log("--------------------------------------------------------");

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
	let length = document.querySelector("#keySize").options[document.querySelector("#keySize").selectedIndex].value;

    if ( isValidEncrypt(cipher, key, length) ) {
        let cipherMatrix = [];
		let keyMatrix = [];
		let resultHex = "";
		let count = 0;
		let multiOfLength = cipher.length / 16;

		console.log("Cipher text: " + cipher);
		console.log("Key: " + key);

		for (let i = 0; i < 4; i++) {
			keyMatrix[i] = [];

			for (let j = 0; j < length / 8 / 4; j++) {
				keyMatrix[i][j] = zeroPad( key[count].charCodeAt(0).toString(16), 2 );
				count++;
			}
		}

		for (let k = 0; k < multiOfLength; k++) {
			let count = 0;
			let arr = [];

			for (let i = 0; i < 4; i++) {
				arr[i] = [];

				for (let j = 0; j < 4; j++) {
					// console.log("String: " + cipher[k * 16 + count] + ", Str: " + cipher[k * 16 + count].charCodeAt(0) + ", Code: " + zeroPad( cipher[k * 16 + count].charCodeAt(0).toString(16), 2 ));
					arr[i][j] = zeroPad( cipher[k * 16 + count].charCodeAt(0).toString(16), 2 );
					count++;
				}
			}

			cipherMatrix.push( arr );
		}

		console.log("Cipher text to hex: ");
		console.table( cipherMatrix );
		console.log("Key to hex: ");
		console.table( keyMatrix );

		for (let k = 0; k < cipherMatrix.length; k++) {
			let plainText = "";
			let plainMatrix = decrypt( cipherMatrix[k], keyMatrix );

			for (let i = 0; i < 4; i++) {
				for (let j = 0; j < 4; j++) {
					plainText += String.fromCharCode( parseInt( plainMatrix[i][j], 16 ) );
				}
			}

			resultHex += plainText;

			console.log("Plain to hex: ");
			console.table( plainMatrix );
		}

		console.log("Plain: " + resultHex);
		console.log("--------------------------------------------------------");

		plainInput.value = resultHex;
    }
});

document.querySelector("#cipherTextClear").addEventListener("click", () => {
    document.querySelector("#cipherText").value = "";
});