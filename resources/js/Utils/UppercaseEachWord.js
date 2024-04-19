export function upperCaseEachWord(sentence) {
    return sentence.toLowerCase().replace(/\b\w/g, function(char) {
        return char.toUpperCase();
    });
}