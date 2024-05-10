export function formatCurrency(amount: number): string {
    return amount !== null && amount !== undefined ? 'K' + amount.toLocaleString() : 'K0';
}
