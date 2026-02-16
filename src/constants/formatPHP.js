export const formatPHP = (amount) => {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 0, // no decimals
    maximumFractionDigits: 0,
  }).format(amount);
};