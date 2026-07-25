/**
 * V9.0.5 Sort Engine
 * SortTemplates
 *
 * Plantillas HTML para el selector de ordenamiento.
 */

const SORT_OPTIONS = [
  { value: 'title-asc', label: 'Título (A → Z)' },
  { value: 'title-desc', label: 'Título (Z → A)' },
  { value: 'author-asc', label: 'Autor (A → Z)' },
  { value: 'author-desc', label: 'Autor (Z → A)' },
  { value: 'album-asc', label: 'Álbum (A → Z)' },
  { value: 'album-desc', label: 'Álbum (Z → A)' },
  { value: 'category-asc', label: 'Categoría (A → Z)' },
  { value: 'category-desc', label: 'Categoría (Z → A)' },
  { value: 'year-desc', label: 'Más recientes' },
  { value: 'year-asc', label: 'Más antiguos' },
  { value: 'plays-desc', label: 'Más reproducidos' },
  { value: 'views-desc', label: 'Más vistos' },
  { value: 'shares-desc', label: 'Más compartidos' },
  { value: 'downloads-desc', label: 'Más descargados' },
  { value: 'duration-desc', label: 'Duración (Mayor)' },
  { value: 'duration-asc', label: 'Duración (Menor)' },
  { value: 'random', label: 'Aleatorio' }
];

function optionTemplate(option, selected) {
  return `
    <option
      value="${option.value}"
      ${option.value === selected ? 'selected' : ''}
    >
      ${option.label}
    </option>
  `;
}

function selectorTemplate(selected = 'title-asc') {
  return `
    <div class="hymn-sort">
      <label
        class="hymn-sort__label"
        for="hymn-sort-select"
      >
        Ordenar por
      </label>

      <select
        id="hymn-sort-select"
        class="hymn-sort__select"
        data-sort-select
      >
        ${SORT_OPTIONS
          .map(option =>
            optionTemplate(option, selected)
          )
          .join('')}
      </select>
    </div>
  `;
}

export const SortTemplates = {
  selector: selectorTemplate,
  options: SORT_OPTIONS
};

export default SortTemplates;
