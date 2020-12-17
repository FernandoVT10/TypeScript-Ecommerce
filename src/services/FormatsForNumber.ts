export function AddSpacesToNumber(number: number) {
    let formatNumber: string;

    formatNumber = number.toString();

    if(number % 1 !== 0) {
	formatNumber = number.toFixed(2);
    }

    return formatNumber.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

export function getDiscountedPrice(price: number, discount: number) {
    return price * ((100 - discount) / 100);
}
