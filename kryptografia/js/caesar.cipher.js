function caesarCipherEncrypt() {
    var txtInput = document.getElementById("input-caesar").value;
    var keyInput = document.getElementById("key-caesar").value;

    var txt = txtInput.toLowerCase();
    var key = parseInt(keyInput);
    var alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
    var result = '';

    for (var i = 0; i < txt.length; i++) {
        var letter = txt[i];
        if (letter === ' ') {
            result += letter;
            continue;
        }
        var currentIndex = alphabet.indexOf(letter);
        var newIndex = currentIndex + key;
        if (newIndex > 25) newIndex = newIndex - 26;
        if (newIndex < 0) newIndex = newIndex + 26;

        result += alphabet[newIndex];
    }
    document.getElementById("output-caesar").innerHTML = result;
}

function caesarCipherDecrypt() {
    var txt = document.getElementById("input-caesar").value.toLowerCase();
    var key = parseInt(document.getElementById("key-caesar").value);
    var alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
    var result = '';

    for (var i = 0; i < txt.length; i++) {
        var letter = txt[i];
        if (letter === ' ') {
            result += letter;
            continue;
        }
        var currentIndex = alphabet.indexOf(letter);
        var newIndex = currentIndex - key;
        if (newIndex > 25) newIndex = newIndex - 26;
        if (newIndex < 0) newIndex = newIndex + 26;

        result += alphabet[newIndex];
    }
    document.getElementById("output-caesar").innerHTML = result;
}