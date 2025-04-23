export async function getFirstTransaction(address: string, apiKey: string) {
  try {
    console.log('Fetching transactions from Etherscan for address:', address);
    const url = `https://api.etherscan.io/api?module=account&action=txlist&address=${address}&sort=asc&apikey=${apiKey}`;
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Network response was not ok: ${res.statusText}`);
    }
    const data = await res.json();
    if (data.status === "1" && data.result && data.result.length > 0) {
      return new Date(parseInt(data.result[0].timeStamp) * 1000);
    } else {
      console.warn('No transactions found or API returned status != 1:', data);
      return null;
    }
  } catch (error) {
    console.error("Failed to fetch first transaction:", error);
    return null;
  }
}
