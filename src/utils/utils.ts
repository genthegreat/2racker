export function formatCurrency(amount: number): string {
    return 'K' + amount.toLocaleString();
}
