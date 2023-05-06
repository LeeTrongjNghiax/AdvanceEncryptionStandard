let option = document.querySelector("#selectLengthOfKey").value;
let lengthOfKey = () => {
  return document.getElementById("keyInput").value.length;
};

document
  .getElementById("selectLengthOfKey")
    .addEventListener("change", (option) => {
      let alert = document.getElementById("noticeKey");
      if (option == "128") {
        alert.innerText =
          lengthOfKey() == 16 ? "" : "Độ dài khóa phải là 16 kí tự";
        alert.style.color = "red";
      } else if (option == "192") {
        alert.innerText =
          lengthOfKey() == 24 ? "" : "Độ dài khóa phải là 24 kí tự";
        alert.style.color = "red";
      } else if ((option = "256")) {
        alert.innerText =
          lengthOfKey() == 32 ? "" : "Độ dài khóa phải là 32 kí tự";
        alert.style.color = "red";
      }
    });

document.getElementById("keyInput").addEventListener("keyup", () => {
  option = document.querySelector("#selectLengthOfKey").value;
  let alert = document.getElementById("noticeKey");
  if (option == "128") {
    alert.innerText =
      lengthOfKey() == 16 ? "" : "Độ dài khóa phải là 16 kí tự";
    alert.style.color = "red";
    return false;
  } else if (option == "192") {
    alert.innerText =
      lengthOfKey() == 24 ? "" : "Độ dài khóa phải là 24 kí tự";
    alert.style.color = "red";
    return false;
  } else if ((option == "256")) {
    alert.innerText =
      lengthOfKey() == 32 ? "" : "Độ dài khóa phải là 32 kí tự";
    alert.style.color = "red";
    return false;
  }
  return true;
});

isValidEncrypt = () => {
    if (document.getElementById("text").value.length == 0) {
        alert("Không được để rỗng văn bản");
        return false;
    }
    let key = document.getElementById("keyInput").value;
    switch ( document.getElementById("selectLengthOfKey").options[document.getElementById("selectLengthOfKey").selectedIndex].value ) {
        case '128':
            if (key.length != 16) {
				alert("Độ dài khóa phải là 16 kí tự");
				return false;
			}
            break;
        case '192':
			if (key.length != 24) {
				alert("Độ dài khóa phải là 24 kí tự")
				return false;
			}
            break;
        default:
			if (key.length != 32) {
				alert("Độ dài khóa phải là 32 kí tự")
				return false;
			}
            break;
    }
	return true;
}

document.getElementById("btnEncryption").addEventListener("click", () => {
	let plainText = document.getElementById("text").value;
	let key = document.getElementById("keyInput").value;
	// let notice = document.getElementById("noticeKey").innerText;

	if ( isValidEncrypt() ) {
		let plainMatrix = [];
		let keyMatrix = [];
		let count = 0;
		let length = document.getElementById("selectLengthOfKey").options[document.getElementById("selectLengthOfKey").selectedIndex].value;

		while ( plainText.length <= length / 8 )
			plainText += " ";

		console.log( plainText );

		for (let i = 0; i < 4; i++) {
			plainMatrix[i] = [];
			keyMatrix[i] = [];
			for (let j = 0; j < length / 8 / 4; j++) {
				plainMatrix[i][j] = zeroPad( plainText[count].charCodeAt(0).toString(16), 2 );
				keyMatrix[i][j] = zeroPad( key[count].charCodeAt(0).toString(16), 2 );
				count++;
			}
		}

		console.log(plainMatrix);
		console.log(keyMatrix);

		let cipherMatrix = encrypt(plainMatrix, keyMatrix);
		let cipherText = "";

		console.log(cipherMatrix);

		for (let i = 0; i < cipherMatrix.length; i++) {
			for (let j = 0; j < cipherMatrix[i].length; j++) {
				cipherText += String.fromCharCode( parseInt( cipherMatrix[i][j], 16 ) );
			}
		}

		console.log(cipherText);

		document.getElementById("result").innerText = cipherText;	
	}
});

document.getElementById("btnDecryption").addEventListener("click", () => {
  let plainText = document.getElementById("text").value;
  let key = document.getElementById("keyInput").value;
  let notice = document.getElementById("noticeKey").innerText;

  if ( isValidEncrypt() ) {
		let plainMatrix = [];
		let keyMatrix = [];
		let count = 0;
		let length = document.getElementById("selectLengthOfKey").options[document.getElementById("selectLengthOfKey").selectedIndex].value;

		console.log( plainText );

		for (let i = 0; i < 4; i++) {
			plainMatrix[i] = [];
			keyMatrix[i] = [];
			for (let j = 0; j < length / 8 / 4; j++) {
				plainMatrix[i][j] = zeroPad( plainText[count].charCodeAt(0).toString(16), 2 );
				keyMatrix[i][j] = zeroPad( key[count].charCodeAt(0).toString(16), 2 );
				count++;
			}
		}

		console.log(plainMatrix);
		console.log(keyMatrix);

		let cipherMatrix = transposeMatrix( decrypt(transposeMatrix( plainMatrix ), keyMatrix) );
		let cipherText = "";

		console.log(cipherMatrix);

		for (let i = 0; i < cipherMatrix.length; i++) {
			for (let j = 0; j < cipherMatrix[i].length; j++) {
				cipherText += String.fromCharCode( parseInt( cipherMatrix[i][j], 16 ) );
			}
		}

		console.log(cipherText);

		document.getElementById("result").innerText = cipherText;
	}
});
