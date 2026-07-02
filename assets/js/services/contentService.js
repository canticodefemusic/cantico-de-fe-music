
export function getById(items, id){ return items.find(item => item.id === id); }
export function getRelatedHymns(hymns, hymn, limit = 3){ return hymns.filter(h => h.id !== hymn.id && h.theme === hymn.theme).slice(0, limit); }
export function mapItems(ids, collection){ return (ids || []).map(id => collection.find(item => item.id === id)).filter(Boolean); }
