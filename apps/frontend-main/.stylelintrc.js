module.exports = {
    defaultSeverity: 'warning',
    extends: [
        'stylelint-config-standard',
        'stylelint-config-prettier', // To avoid/remove conflicts with Prettier Related Rules. (Should be at Last)
    ],
    plugins: [
        'stylelint-order', // For now we have used "Alphabetic order" with "Stylelint-Order". If need other type of order check 'stylelint-order' github bottom. (Ex. stylelint-config-idiomatic-order)
    ],
    rules: {
        'order/order': ['custom-properties', 'declarations'],
        'order/properties-alphabetical-order': true,
    },
};
