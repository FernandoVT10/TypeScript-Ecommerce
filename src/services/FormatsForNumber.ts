export function AddSpacesToNumber(number: number) {
    const fixedNumber = number.toFixed(2);

    return fixedNumber.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

export function getDiscountedPrice(price: number, discount: number) {
    return price * ((100 - discount) / 100);
}
