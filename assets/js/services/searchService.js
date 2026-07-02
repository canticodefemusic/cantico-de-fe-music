
export function searchHymns(hymns, query, theme){
  let items = [...hymns];
  const q = (query || "").toLowerCase();
  if(q){
    items = items.filter(h => [
      h.title, h.subtitle, h.theme, h.reference, h.album, h.author,
      ...(h.tags || []), ...(h.lyrics || [])
    ].join(" ").toLowerCase().includes(q));
  }
  if(theme) items = items.filter(h => h.theme === theme);
  return items;
}
