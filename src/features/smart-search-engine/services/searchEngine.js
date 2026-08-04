/**
 * Cántico de Fe Music
 * V11.0 — Global Search Engine
 */

function normalize(text = '') {
  return String(text)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ñ/g, 'n')
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizeList(value) {
  if (Array.isArray(value)) {
    return normalize(
      value
        .filter(Boolean)
        .join(' ')
    );
  }

  return normalize(value || '');
}

function getSearchFields(item = {}) {
  return {
    title: normalize(item.title || item.name || ''),
    subtitle: normalize(item.subtitle || ''),
    artist: normalize(item.artist || item.author || ''),
    category: normalize(item.category || item.type || ''),
    theme: normalize(item.theme || ''),
    description: normalize(item.description || item.content || ''),
    scriptures: normalizeList(
      item.scriptures || item.scripture
    ),
    tags: normalizeList(item.tags),
    keywords: normalizeList(item.keywords),
    hymnIds: normalizeList(item.hymnIds)
  };
}

function scoreField(
  value,
  term,
  {
    startsWith = 0,
    includes = 0
  } = {}
) {
  if (!value || !term) {
    return 0;
  }

  if (
    startsWith > 0 &&
    value.startsWith(term)
  ) {
    return startsWith;
  }

  if (
    includes > 0 &&
    value.includes(term)
  ) {
    return includes;
  }

  return 0;
}

function scoreItem(item, term) {
  const fields =
    getSearchFields(item);

  let score = 0;

  score += scoreField(
    fields.title,
    term,
    {
      startsWith: 120,
      includes: 100
    }
  );

  score += scoreField(
    fields.subtitle,
    term,
    {
      startsWith: 60,
      includes: 50
    }
  );

  score += scoreField(
    fields.artist,
    term,
    {
      startsWith: 50,
      includes: 40
    }
  );

  score += scoreField(
    fields.category,
    term,
    {
      startsWith: 42,
      includes: 35
    }
  );

  score += scoreField(
    fields.theme,
    term,
    {
      startsWith: 36,
      includes: 30
    }
  );

  score += scoreField(
    fields.scriptures,
    term,
    {
      includes: 25
    }
  );

  score += scoreField(
    fields.tags,
    term,
    {
      includes: 22
    }
  );

  score += scoreField(
    fields.keywords,
    term,
    {
      includes: 20
    }
  );

  score += scoreField(
    fields.description,
    term,
    {
      includes: 12
    }
  );

  score += scoreField(
    fields.hymnIds,
    term,
    {
      includes: 5
    }
  );

  return score;
}

function compareResults(a, b) {
  if (b.__score !== a.__score) {
    return b.__score - a.__score;
  }

  const aTitle = normalize(
    a.title || a.name || ''
  );

  const bTitle = normalize(
    b.title || b.name || ''
  );

  return aTitle.localeCompare(
    bTitle,
    'es'
  );
}

export function searchItems(
  items = [],
  query = '',
  {
    limit = Infinity,
    includeScore = false
  } = {}
) {
  const safeItems =
    Array.isArray(items)
      ? items
      : [];

  const term =
    normalize(query);

  if (!term) {
    const results =
      [...safeItems];

    return Number.isFinite(limit)
      ? results.slice(0, limit)
      : results;
  }

  const scoredResults =
    safeItems
      .map(item => ({
        ...item,
        __score:
          scoreItem(item, term)
      }))
      .filter(
        item =>
          item.__score > 0
      )
      .sort(compareResults);

  const limitedResults =
    Number.isFinite(limit)
      ? scoredResults.slice(
          0,
          Math.max(0, limit)
        )
      : scoredResults;

  if (includeScore) {
    return limitedResults;
  }

  return limitedResults.map(
    ({
      __score,
      ...item
    }) => item
  );
}

export function searchGroups(
  groups = {},
  query = '',
  {
    limitPerGroup = 8,
    includeEmpty = false
  } = {}
) {
  return Object.entries(groups)
    .reduce(
      (
        results,
        [groupName, items]
      ) => {
        const matches =
          searchItems(
            items,
            query,
            {
              limit:
                limitPerGroup
            }
          );

        if (
          includeEmpty ||
          matches.length
        ) {
          results[groupName] =
            matches;
        }

        return results;
      },
      {}
    );
}

export {
  normalize,
  scoreItem
};
