export function formatCurrency(amount: number): string {
    return amount !== null && amount !== undefined ? 'K' + amount.toLocaleString() : 'K0';
}


export function serializeError(error: any) {
    const serializedError = {
      message: error.message,
      cause: error.cause || '',
      name: error.name,
      code: error.code || '',
      status: error.status || '',
    };
    return JSON.stringify(serializedError);
  }