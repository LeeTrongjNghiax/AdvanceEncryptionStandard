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
		let multiOfLength = 0;

		while (multiOfLength * length / 8 < plainText.length)
			multiOfLength++;

		console.log(multiOfLength);

		if ( plainText.length % (length / 8) != 0 )
			while ( plainText.length < (length / 8) * (multiOfLength + 1))
				plainText += " ";

		console.log( plainText.length );

		for (let k = 0; k < multiOfLength; k++) {
			count = 0;
			let arr = [];

			for (let i = 0; i < 4; i++) {
				arr[i] = [];
				keyMatrix[i] = [];
				for (let j = 0; j < length / 8 / 4; j++) {
					arr[i][j] = zeroPad( plainText[k * (length / 8) + count].charCodeAt(0).toString(16), 2 );
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

			resultHex += cipherMatrix;
		}
		// console.log(plainMatrix);
		// console.log(keyMatrix);

		// let cipherMatrix = encrypt(plainMatrix, keyMatrix);

		// console.log(cipherMatrix);

		// for (let i = 0; i < cipherMatrix.length; i++) {
		// 	for (let j = 0; j < cipherMatrix[i].length; j++) {
		// 		cipherText += String.fromCharCode( parseInt( cipherMatrix[i][j], 16 ) );
		// 	}
		// }

		console.log(cipherText);

		document.getElementById("result").innerText = cipherText;
		document.getElementById("result-hex").innerText = resultHex;	
	}
});

// document.getElementById("btnDecryption").addEventListener("click", () => {
//   let plainText = document.getElementById("text").value;
//   let key = document.getElementById("keyInput").value;
//   let notice = document.getElementById("noticeKey").innerText;

//   if ( isValidEncrypt() ) {
// 		let plainMatrix = [];
// 		let keyMatrix = [];
// 		let count = 0;
// 		let length = document.getElementById("selectLengthOfKey").options[document.getElementById("selectLengthOfKey").selectedIndex].value;

// 		console.log( plainText );

// 		for (let i = 0; i < 4; i++) {
// 			plainMatrix[i] = [];
// 			keyMatrix[i] = [];
// 			for (let j = 0; j < length / 8 / 4; j++) {
// 				plainMatrix[i][j] = zeroPad( plainText[count].charCodeAt(0).toString(16), 2 );
// 				// plainMatrix[i][j] = plainText.substring(count * 4, count * 4 + 4);
// 				keyMatrix[i][j] = zeroPad( key[count].charCodeAt(0).toString(16), 2 );
// 				count++;
// 			}
// 		}

// 		console.log(plainMatrix);
// 		console.log(keyMatrix);

// 		let cipherMatrix = decrypt(transposeMatrix( plainMatrix ), keyMatrix);
// 		let cipherText = "";

// 		console.log(cipherMatrix);

// 		for (let i = 0; i < cipherMatrix.length; i++) {
// 			for (let j = 0; j < cipherMatrix[i].length; j++) {
// 				cipherText += String.fromCharCode( parseInt( cipherMatrix[i][j], 16 ) );
// 			}
// 		}

// 		console.log(cipherText);

// 		document.getElementById("result").innerText = cipherText;
// 		document.getElementById("result-hex").innerText = cipherMatrix;
// 	}
// });

document.getElementById("btnDecryption").addEventListener("click", () => {
	let plainText = document.getElementById("text").value;
	let key = document.getElementById("keyInput").value;
	let notice = document.getElementById("noticeKey").innerText;
  
	if ( isValidEncrypt() ) {
		  let plainMatrix = [];
		  let keyMatrix = [];
		  let count = 0;
		  let length = document.getElementById("selectLengthOfKey").options[document.getElementById("selectLengthOfKey").selectedIndex].value;
  
		//   for (let i = 0; i <)
  
		  for (let i = 0; i < 4; i++) {
			  plainMatrix[i] = [];
			  keyMatrix[i] = [];
			  for (let j = 0; j < length / 8 / 4; j++) {
				  plainMatrix[i][j] = zeroPad( plainText[count].charCodeAt(0).toString(16), 2 );
				  // plainMatrix[i][j] = plainText.substring(count * 4, count * 4 + 4);
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
  
		  document.getElementById("result").innerText = cipherText;
		  document.getElementById("result-hex").innerText = cipherMatrix;
	  }
  });