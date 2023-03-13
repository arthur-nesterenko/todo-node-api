module.exports = {
  '*.{js,ts,json}': ['eslint', 'prettier --write'],
  '*.{ts,tsx}': 'bash -c tsc --noEmit',
};
