import { input } from "../utilities/dom-builder.js";

export default function GuessWord(wordDomParent, resultDom) {
    const randomWords = [
        "humor", "miniature", "amusing", "creepy", "fact", "risk", "verse", "land", "lumpy",
        "holiday", "glorious", "weigh", "brake", "pretty", "grin", "capricious", "bite-sized",
        "misty", "ignore", "certain", "sloppy", "dress", "true", "zonked", "observation", "action",
        "various", "want", "direful", "suck", "dress", "scarecrow", "judge", "madly", "quizzical",
        "consist", "fierce", "love", "arrest", "serve", "fit", "hug", "tan", "curve", "eatable",
        "tub", "race", "innocent", "open", "preach", "steady", "acoustics", "lock", "field", "arrange",
        "rifle", "learned", "toe", "flow", "competition", "ill-fated", "oatmeal", "match", "male",
        "measure", "loaf", "smile", "wrestle", "dull", "food", "locket", "bell", "beg", "strengthen",
        "responsible", "enchanting", "loutish", "switch", "idea", "nine", "squeamish", "pig", "bat",
        "dear", "trains", "owe", "frogs", "assorted", "lonely", "hurry", "natural", "sun", "snow",
        "obnoxious", "broken", "friend", "bright", "cake", "sour", "permit", "economic", "lovely",
        "quick", "van", "tempt", "apparel", "decay", "business", "adjustment", "blushing", "makeshift",
        "slippery", "load", "winter", "exist", "tongue", "country", "roll", "fast", "moor", "possess",
        "pat", "pass", "books", "impartial", "hospitable", "dust", "naughty", "extra-large", "tacky",
        "produce", "committee", "fuzzy", "judicious", "nebulous", "stick", "ear", "copy", "friendly",
        "press", "distinct", "vegetable", "upset", "venomous", "statement", "sulky", "spell", "x-ray",
        "square", "taste", "great", "thumb", "adjoining", "chilly", "test", "ancient", "green", "badge",
        "work", "repeat", "free", "elderly", "doctor", "difficult", "grubby", "approval", "turn",
        "vivacious", "thundering", "cherries", "rest", "plan", "crime", "sticks", "wealthy", "phone",
        "suspend", "gullible", "fence", "note", "wall", "interest", "coil", "jump", "enchanted", "funny",
        "racial", "greasy", "polish", "elbow", "smart", "bore", "crowd", "glistening", "oval", "eggs",
        "nauseating", "detailed", "veil", "coal"
    ];
    let totalCharacters = [];
    let randomWord = '';
    const totalTries = 10;
    let wrongGuessedWords = [];

    const beautifyWordDom = () => {
        const wordDomParentElement = document.querySelector(wordDomParent);
        if (wordDomParentElement) {
            totalCharacters.forEach(alphabet => {
                wordDomParentElement.append(
                    input({
                        class: 'w-full flex-1 text-lg p-3 border border-gray-300 rounded-md font-medium text-center disabled:opacity-25',
                        value: (alphabet.hide ? alphabet.character : '-'),
                        ...(alphabet.hide ? { readonly: true } : ''),
                        onclick: function () {
                            this.value = '';
                        },
                        onblur: function () {
                            if (this.value === '') this.value = '-';
                        }
                    })
                );
            });
        }
    }

    const placeholder = function () {
        for (let alphabetIndex = 0; alphabetIndex < randomWord.length; alphabetIndex++) {
            totalCharacters.push({
                character: randomWord[alphabetIndex],
                hide: ((Math.floor(Math.random() * 70)) % 2 === 0 || alphabetIndex === 0) ? false : true
            });
        }
    }

    //  Choose a random word
    const getWord = function () {
        const randomNumber = Math.floor(Math.random() * randomWords.length);
        return randomWords[randomNumber];
    }

    const checkIfWin = (value) => {
        return randomWord.toUpperCase() === value.toUpperCase();
    }

    this.makeGuess = function (value) {
        const resultDomElement = document.querySelector(resultDom);
        const wordDomParentElement = document.querySelector(wordDomParent);
        let guessedWord = [];
        for (let words of wordDomParentElement.children) {
            guessedWord.push(words.value);
        }
        if (checkIfWin(guessedWord.join(''))) {
            resultDomElement.classList.remove('text-amber-400');
            resultDomElement.classList.add('text-emerald-400');
            resultDomElement.innerHTML = 'You guessed the right number! Hooray!!!';
        } else {
            wrongGuessedWords.push(value);
            resultDomElement.classList.remove('text-emerald-400');
            resultDomElement.classList.add('text-amber-400');
            resultDomElement.innerHTML = `You guessed the wrong word. ${wrongGuessedWords.length === totalTries ? 'Better luck next time :-(' : `Try again. Remaining guesses left: ${totalTries - wrongGuessedWords.length}`}`;
        }
    }

    const resetValues = () => {
        totalCharacters = [];
        randomWord = '';
        wrongGuessedWords = [];
        document.querySelector(resultDom).innerHTML = '';
        document.querySelector(wordDomParent).innerHTML = '';
    }

    this.startGame = function () {
        resetValues();
        randomWord = getWord();
        placeholder();
        beautifyWordDom();
    }
}