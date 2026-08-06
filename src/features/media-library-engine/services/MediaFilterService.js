/**
 * Cántico de Fe Music
 * V12.8.12 — Media Filter Service
 */

function normalize(text = '') {
  return String(text)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

function matchesQuery(
  media,
  query
) {
  if (!query) {
    return true;
  }

  const term =
    normalize(query);

  return [
    media.name,
    media.description,
    media.category,
    media.type,
    ...(media.tags || [])
  ]
    .join(' ')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .includes(term);
}

function compareByOrder(a, b) {
  return (
    (a.order ?? 0) -
    (b.order ?? 0)
  );
}

function compareByName(a, b) {
  return (
    a.name || ''
  ).localeCompare(
    b.name || '',
    'es'
  );
}

function compareByNewest(a, b) {
  return new Date(
    b.createdAt || 0
  ) -
  new Date(
    a.createdAt || 0
  );
}

const sorters = {
  order:
    compareByOrder,

  name:
    compareByName,

  newest:
    compareByNewest
};

const MediaFilterService = {
  filter(
    media = [],
    options = {}
  ) {
    const {
      query = '',
      type = 'all',
      category = 'all',
      sort = 'order'
    } = options;

    let result =
      [...media];

    result =
      result.filter(item =>
        matchesQuery(
          item,
          query
        )
      );

    if (
      type !== 'all'
    ) {
      result =
        result.filter(
          item =>
            item.type ===
            type
        );
    }

    if (
      category !==
      'all'
    ) {
      result =
        result.filter(
          item =>
            item.category ===
            category
        );
    }

    const sorter =
      sorters[
        sort
      ] ||
      compareByOrder;

    result.sort(
      sorter
    );

    return result;
  }
};

export default
  MediaFilterService;
