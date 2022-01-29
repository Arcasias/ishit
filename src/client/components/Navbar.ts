import { Component, tags } from "@odoo/owl";

const { xml: html } = tags;

export class Navbar extends Component {
  static template = html` <header class="header">
    <nav class="navbar">
      <div class="container-fluid">
        <h5 class="navbar-brand m-0">
          <span class="text-primary">i</span>mage
          <span class="text-primary">S</span>earch from
          <span class="text-primary">H</span>uman
          <span class="text-primary">I</span>nput
          <span class="text-primary">T</span>ext
        </h5>
        <button
          type="button"
          class="btn btn-outline-primary"
          t-on-click="openSettings"
        >
          <i class="fas fa-cog"></i>
        </button>
      </div>
    </nav>
    <nav class="navbar">
      <div class="container-fluid flex-nowrap">
        <Dropdown
          t-if="favorites.length"
          class="me-2"
          title="'Favorites'"
          items="favorites"
          deletable="true"
          onSelect="applyFavorite"
          onRemove="removeFavorite"
          onClear="clearFavorites"
        />
        <div class="input-group">
          <div class="input-wrapper form-control bg-white">
            <input
              type="text"
              class="me-2"
              placeholder="Search on Google Image"
              aria-label="Search"
              t-ref="search-input"
              t-model="state.query"
              t-on-focus="state.showSuggestions = true"
              t-on-blur="state.showSuggestions = false"
              t-on-keydown="onSearchKeydown"
            />
            <div
              t-if="state.showSuggestions and suggestions.length"
              class="dropdown-menu"
            >
              <a
                t-foreach="suggestions"
                t-as="query"
                t-key="query_index"
                t-att-class="{ active: state.activeSuggestion === query_index }"
                class="dropdown-item"
                href="#"
                t-esc="query"
              ></a>
            </div>
            <button
              t-if="currentSearch"
              class="btn badge text-warning me-2 p-0"
              type="button"
              t-on-click="toggleFavorite"
            >
              <i
                t-attf-class="{{ favoritesManager.has(currentSearch) ? 'fas' : 'far' }} fa-star text-warning"
              ></i>
            </button>
            <Dropdown
              title="state.ext.toUpperCase()"
              small="true"
              items="extensionItems"
              onSelect="applySearchExtension"
            />
          </div>
          <button
            t-attf-class="btn btn{{ getFullQuery() === currentSearch ? '-outline' : '' }}-primary"
            t-on-click="search"
          >
            Search
          </button>
          <button class="btn text-primary" t-on-click="reset">
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>
    </nav>
  </header>`;
}
