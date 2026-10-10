(() => {
  const root = document.querySelector('[data-dx-search]');
  if (!root) return;
  const input = root.querySelector('input[name="s"]');
  const clear = root.querySelector('.dx-search__clear');
  const sync = () => { clear.hidden = input.value.length === 0; };
  clear.addEventListener('click', () => {
    input.value = '';
    sync();
    input.focus();
  });
  input.addEventListener('input', sync);
  window.addEventListener('pageshow', sync);
  sync();
})();
