window.onload = function () {
    if (localStorage.getItem('text-in-editor') !== null) {
        document.getElementById('telling-words-editor').innerHTML = localStorage.getItem('text-in-editor');
    }

    document.addEventListener('keyup', function (e) {
        localStorage.setItem('text-in-editor', document.getElementById('telling-words-editor').innerHTML);

        /* Find character count of everything in the telling-words editor except whitespace. */
        var tellingWordsEditor = localStorage.getItem('text-in-editor');
        var result = tellingWordsEditor.replace(/\s/g, '');
        var length = result.length;
        console.log('Innacurate character count: ' + length);

        /* Call these functions on keyup. */
        theTest();
        fixCursorPosition();
    });
}

/* Makes the website always load at the top of the page. */
window.onbeforeunload = function () {
    window.scrollTo(0, 0);
}

function clearText() {
    /* Clears the text in the div. */
    document.getElementById('telling-words-editor').innerHTML = '';

    /* Sets focus to the div. */
    document.getElementById('telling-words-editor').focus();

    /* Sets the data saved on reload to what is in the div. */
    localStorage.setItem('text-in-editor', document.getElementById('telling-words-editor').innerHTML);
}

function theTest() {
    var textInEditor = document.getElementById('telling-words-editor').innerText;
    var theLocations = [];
    var result = '';
    var highlightedWords = ['the', 'locations', 'this'];
    
    var tokenized = tokenize(textInEditor, { word: /\w+/, whitespace: /\s+/, punctuation: /[^\w\s]/ }, 'invalid');

/* This stores the position of every word that will be highlighted in an array. */
    highlightedWords.forEach(function (word) {
        theLocations = theLocations.concat(getAllIndexes(tokenized, word));
    });

    /* This line makes whatever this is into a string. */
    tokenized.forEach(function (tokenObject, index) {
        if (theLocations.includes(index)) {
            result += '<span class="blue-highlight">' + tokenObject.token + '</span>';
        }
        else {
            result += tokenObject.token;
        }
    });
    /* This line replaces the div text with the result variable. NOTE: If the result variable has a space at the end, that is not translated into the div. */
    document.getElementById('telling-words-editor').innerHTML = result;
    /* This line sets the data saved on reload to the results variable.*/
    localStorage.setItem('text-in-editor', document.getElementById('telling-words-editor').innerHTML);

    /*console.log(theLocations);*/
    console.log(result);
}

/* NOTE: This is only a temporary solution. Every time you type a character, the cursor is teleported to the end of the text. */
function fixCursorPosition() {
    // select all the content in the element
    document.execCommand('selectAll', false, null);
    // collapse selection to the end
    document.getSelection().collapseToEnd();
}

function getAllIndexes(array, value) {
    var indexes = [], i;
    for (i = 0; i < array.length; i++)
        if (array[i].token.toUpperCase() === value.toUpperCase())
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
 * result => [{ token='this', type='word' },{ token=' ', type='whitespace' }, Object { token='is', type='word' }, ... ]
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