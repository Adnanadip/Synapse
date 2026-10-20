(() => {
  const R = window.VIZ_REGISTRY, $ = s => document.querySelector(s);
  const PALETTE = ['#00D2EF', '#FF5C5C', '#FFC72C', '#00FF7F', '#FF69B4', '#8A2BE2', '#FF8C00', '#00CED1', '#FF1493', '#ADFF2F', '#FF4500', '#7B68EE', '#00FA9A', '#FF6347', '#1E90FF', '#FFD700', '#32CD32', '#FF69B4', '#00BFFF', '#FF8C00', '#FF1493', '#00CED1', '#FF4500', '#ADFF2F', '#7B68EE', '#00FA9A', '#FF6347', '#1E90FF', '#FFD700', '#32CD32', '#FF69B4', '#00BFFF', '#FF8C00'];
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  let cat = 'all', q = '', last = -1;

  const randColor = () => { let i; do { i = Math.floor(Math.random() * PALETTE.length); } while (i === last); last = i; return PALETTE[i]; };

  function render() {
    const term = q.toLowerCase();
    const html = R.categories.filter(c => cat === 'all' || cat === c.id).map(c => {
      const items = R.charts.filter(x => x.cat === c.id && (x.name + ' ' + x.desc + ' ' + x.cell).toLowerCase().includes(term));
      if (!items.length) return '';
      return `<section class="cat"><h2><i class="accent-dot" style="background:${randColor()}"></i>${esc(c.name)}</h2>
        <div class="grid-container">${items.map(x => `
          <a class="utility-card viz-card${x.status === 'ready' ? '' : ' unbuilt'}" style="--c:${randColor()}" href="${x.status === 'ready' ? 'workspace.html?chart=' + x.id : '#'}">
            <div class="card-header"><span class="accent-dot"></span><span class="card-id">${esc(x.cell)}</span></div>
            <h2>${esc(x.name)}</h2><p>${esc(x.desc)}</p>
          </a>`).join('')}</div></section>`;
    }).join('');
    $('#catalog').innerHTML = html || '<p class="empty">No charts match your search.</p>';
  }

  $('#filters').innerHTML = [{ id: 'all', name: 'All' }].concat(R.categories)
    .map(c => `<button class="pill${c.id === 'all' ? ' active' : ''}" data-cat="${c.id}">${esc(c.name)}</button>`).join('');
  $('#filters').addEventListener('click', e => {
    const b = e.target.closest('.pill'); if (!b) return;
    cat = b.dataset.cat;
    document.querySelectorAll('.pill').forEach(p => p.classList.toggle('active', p === b));
    render();
  });
  $('#vizSearch').addEventListener('input', e => { q = e.target.value.trim(); render(); });
  $('#catalog').addEventListener('click', e => { if (e.target.closest('.unbuilt')) e.preventDefault(); });
  document.addEventListener('keydown', e => {
    if (e.key === '/' && document.activeElement !== $('#vizSearch')) { e.preventDefault(); $('#vizSearch').focus(); }
  });
  render();
})();
