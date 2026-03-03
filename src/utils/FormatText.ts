export const capitalizeText = (
  text: string,
  separator: string | RegExp = /[\s-_]+/,
): string => {
  return text
    .split(separator)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};
