export function getPageRange(total: number, currentPage: number, perPage: number): string {
  const start = (currentPage - 1) * perPage + 1;
  const end = Math.min(currentPage * perPage, total); // Ensure `end` does not exceed `total`
  
  // If `start` is greater than `total`, no rows are available
  if (start > total) {
    return `0-0 of ${total}`;
  }
  
  return `${start}-${end} of ${total}`;
}
