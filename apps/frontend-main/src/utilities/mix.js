// Simple helper utility function to convert string numbers into numeric values.
export const transformStringValueToNumber = (value) => {
    const numericValue = Number(value);

    if (Number.isNaN(numericValue)) {
        return value;
    }
    return numericValue;
};
