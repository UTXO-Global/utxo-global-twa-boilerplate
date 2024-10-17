export const truncateAddress = (address: string, count?: number) => {
    if (!address) return "";
    return `${address.slice(0, count || 14)}...${address.slice(
      address.length - (count || 14),
      address.length
    )}`;
};