export function formatNPWP(input) {
    let digitsOnly = input.replace(/\D/g, "");

    let formattedString =
        digitsOnly.slice(0, 2) +
        "." +
        digitsOnly.slice(2, 5) +
        "." +
        digitsOnly.slice(5, 8) +
        "." +
        digitsOnly.slice(8, 9) +
        "-" +
        digitsOnly.slice(9, 12) +
        "." +
        digitsOnly.slice(12);

    return formattedString;
}
