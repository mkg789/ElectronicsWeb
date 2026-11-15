export function getProductBrand(product) {
  const value = product?.brand ?? product?.manufacturer ?? product?.vendor;
  if (typeof value === "string") return value.trim();
  if (value && typeof value === "object" && typeof value.name === "string") {
    return value.name.trim();
  }
  return "";
}
