export function formatCurrency(amount: number): string {
    return isNaN(amount) ? 'K0' : amount < 0 ? '-K' + Math.abs(amount).toLocaleString() : 'K' + amount.toLocaleString()
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