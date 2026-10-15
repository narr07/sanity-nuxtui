// Grids have three columns on large screens. With 2 or 4 items that leaves a gap
// or a lone card on the last row, so match the column count instead. Pass
// `wide` for content that needs room (blog cards): 4 items become 2 × 2.
export function gridColumns(count: number | null | undefined, { wide = false } = {}) {
  if (count === 2) return 'lg:grid-cols-2'
  if (count === 4) return wide ? 'lg:grid-cols-2' : 'lg:grid-cols-4'
  return undefined
}

// UPageCard switches to CSS grid on large screens, which stretches the image row
// when cards in the same row have different heights. Flex keeps the title right
// under the image and the footer at the bottom.
export const cardUi = { container: 'lg:flex' }
