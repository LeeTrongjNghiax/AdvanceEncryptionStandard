document.querySelector("#encrypt").addEventListener("click", () => {
    let plain = document.querySelector("#plainText").value;
    let key = document.querySelector("#key").value;
    let cipherInput = document.querySelector("#cipherText");
    let select = document.querySelector("select");
    let bits = select.options[select.selectedIndex].value;

    console.log(`Plain: ${plain}, key: ${key}, cipher: ${cipherInput}, bits: ${bits}`);
});

document.querySelector("#advanceSettingButton").addEventListener("click", () => {
    let collapsible = document.querySelector("#advanceSetting");

    if ( collapsible.style.maxHeight )
        collapsible.style.maxHeight = null;
    else 
        collapsible.style.maxHeight = collapsible.scrollHeight * 3 + 'px';
});