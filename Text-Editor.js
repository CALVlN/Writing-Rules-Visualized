window.onload = function () {
    if (localStorage.getItem('text-in-editor') !== null) {
        document.getElementById('telling-words-editor').innerHTML = localStorage.getItem('text-in-editor');
        /* FIX THIS #1 */
        fixCursorPositionOnLoad();
    }

    document.addEventListener('keyup', function (e) {
        localStorage.setItem('text-in-editor', document.getElementById('telling-words-editor').innerHTML);

        /* Find character count of everything in the telling-words editor except whitespace. */
        var tellingWordsEditor = localStorage.getItem('text-in-editor');
        var result = tellingWordsEditor.replace(/\s/g, '');
        var length = result.length;
        console.log('Innacurate character count: ' + length);

        /* Call these functions on keyup. */
        highlightWords();
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

/* FIX THIS #1 */
/* Fix the cursor position in the editable div element when the page loads. */
function fixCursorPositionOnLoad() {
    // select all the content in the element
    document.execCommand('selectAll', false, null);
    // collapse selection to the end
    document.getSelection().collapseToEnd();
}

function highlightWords() {
    var textInEditor = document.getElementById('telling-words-editor').innerText;
    var locationsOfWords = [];
    var result = '';
    var highlightTheseWords = ['the', 'locations', 'this'];
    
    var tokenized = tokenize(textInEditor, { word: /\w+/, whitespace: /\s+/, punctuation: /[^\w\s]/ }, 'invalid');
    
/* This stores the position of every word that will be highlighted in an array. */
    highlightTheseWords.forEach(function (word) {
        locationsOfWords = locationsOfWords.concat(getAllIndexes(tokenized, word));
    });

    /* This line makes whatever this is into a string. */
    tokenized.forEach(function (tokenObject, index) {
        if (locationsOfWords.includes(index)) {
            result += '<b class="general-highlight">' + tokenObject.token + '</b>';
        }
        else {
            result += tokenObject.token;
        }
    });
    /* This line replaces the div text with the result variable. NOTE: If the result variable has white space at the end, that is not translated into the div. */
    document.getElementById('highlighted-words').innerHTML = result;
    /* This line sets the data saved on reload to the results variable.*/
    localStorage.setItem('text-in-editor', document.getElementById('telling-words-editor').innerHTML);

    /*console.log(locationsOfWords);*/
    console.log(result);
}

function getAllIndexes(array, value) {
    var indexes = [], i;
    for (i = 0; i < array.length; i++)
        if (array[i].token.toUpperCase() === value.toUpperCase())
            indexes.push(i);
    return indexes;
}

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