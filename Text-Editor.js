window.onload = function () {
    if (localStorage.getItem('text-in-editor') !== null) {
        document.getElementById('telling-words-editor').innerText = localStorage.getItem('text-in-editor');
    }

    document.addEventListener('keyup', function (e) {
        localStorage.setItem('text-in-editor', document.getElementById('telling-words-editor').innerText);

        /* Find string length of the text in the telling words tool editor. */
        var tellingWordsEditor = localStorage.getItem('text-in-editor');
        var result = tellingWordsEditor.replace(/\s/g, "");
        var length = result.length;
        console.log("Character count: " + length);

        if (length === 0) {

        }
    });
}

/* Makes the website always load at the top of the page. */
window.onbeforeunload = function () {
    window.scrollTo(0, 0);
}

function clearText() {
    document.getElementById("telling-words-editor").innerHTML = "";
    document.getElementById("telling-words-editor").focus();
}


/* HOW DO IT WORK???////// */
function theTest() {
    let the = document.getElementsById("telling-words-editor");
    let i;

    for (i = 0; i < cards.length; i++) {
        let the = cards[i];
        let text = the.innerHTML;

        text = text.replace(/the/ig, 'TEST')

        the.innerHTML = text;
    }
}