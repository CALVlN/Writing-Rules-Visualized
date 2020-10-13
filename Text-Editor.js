window.onload = function () {
    if (localStorage.getItem("text-in-editor") !== null) {
        document.getElementById("telling-words-editor").innerText = localStorage.getItem("text-in-editor");
    }

    document.addEventListener('keyup', function (e) {
        localStorage.setItem("text-in-editor", document.getElementById("telling-words-editor").innerText);

        /* Find string length of the text in the telling words tool editor. */
        var tellingWordsEditor = localStorage.getItem("text-in-editor");
        var result = tellingWordsEditor.replace(/\s/g, "");
        var length = result.length;
        console.log("Character count: " + length);
    });
}

/* Makes the website always load at the top of the page. */
window.onbeforeunload = function () {
    window.scrollTo(0, 0);
}

function clearText() {
    /* Clears the text in the div. */
    document.getElementById("telling-words-editor").innerHTML = "";

    /* Sets focus to the div. */
    document.getElementById("telling-words-editor").focus();

    /* Sets the data saved on reload to what is in the div. */
    localStorage.setItem("text-in-editor", document.getElementById("telling-words-editor").innerText);
}

function theTest(array, value) {
    var textInEditor = localStorage.getItem("text-in-editor");
    var result;

    /* This line takes all the text in the text editor div and converts it into an array. */
    var textInArray = textInEditor.split(" ");

    /* This line gets the position of every instance of the word "the" in an array and stores them in the variable result. */
    result = getAllIndexes(textInArray, "the");

    /* This line takes the array called "result" and makes it into a string. */
    /*result = textInArray.join(" ");*/

    console.log(textInArray);
    console.log(result);





    /* This code replaces the div text with the resultsHighlighted variable.
    document.getElementById("telling-words-editor").innerHTML = resultsHighlighted;
    */

    /* Sets the data saved on reload to the highlighted text.
    localStorage.setItem("text-in-editor", document.getElementById("telling-words-editor").innerText);
    */
}

function getAllIndexes(array, value) {
    var indexes = [], i;
    for (i = 0; i < array.length; i++)
        if (array[i] === value)
            indexes.push(i);
    return indexes;
}

/* This probably does something useful. */
/*
 * Tiny tokenizer
 *
 * - Accepts a subject string and an object of regular expressions for parsing
 * - Returns an array of token objects
 *
 * tokenize('this is text.', { word:/\w+/, whitespace:/\s+/, punctuation:/[^\w\s]/ }, 'invalid');
 * result => [{ token="this", type="word" },{ token=" ", type="whitespace" }, Object { token="is", type="word" }, ... ]
 * 
 */
function tokenize(s, parsers, deftok) {
    var m, r, l, cnt, t, tokens = [];
    while (s) {
        t = null;
        m = s.length;
        for (var key in parsers) {
            r = parsers[key].exec(s);
            // try to choose the best match if there are several
            // where "best" is the closest to the current starting point
            if (r && (r.index < m)) {
                t = {
                    token: r[0],
                    type: key,
                    matches: r.slice(1)
                }
                m = r.index;
            }
        }
        if (m) {
            // there is text between last token and currently 
            // matched token - push that out as default or "unknown"
            tokens.push({
                token: s.substr(0, m),
                type: deftok || 'unknown'
            });
        }
        if (t) {
            // push current token onto sequence
            tokens.push(t);
        }
        s = s.substr(m + (t ? t.token.length : 0));
    }
    return tokens;
}