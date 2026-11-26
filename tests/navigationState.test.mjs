import test from 'node:test';
import assert from 'node:assert/strict';
import { INITIAL_NAV_STATE, navReducer } from '../minhaprefeitura/utils/navigationReducer.js';

test('navReducer handles tab switching, route pushing, back navigation and search', () => {
  let state = navReducer(INITIAL_NAV_STATE, {
    type: 'PUSH_ROUTE',
    name: 'newsDetail',
    params: { slug: 'vacina' },
  });
  assert.equal(state.stack.length, 1);
  assert.equal(state.stack[0].name, 'newsDetail');

  state = navReducer(state, { type: 'GO_BACK' });
  assert.equal(state.stack.length, 0);

  state = navReducer(state, { type: 'PUSH_ROUTE', name: 'buracos' });
  state = navReducer(state, { type: 'SWITCH_TAB', tab: 'noticias' });
  assert.equal(state.activeTab, 'noticias');
  assert.equal(state.stack.length, 0);

  state = navReducer(state, { type: 'SET_SEARCH_QUERY', query: 'obras' });
  assert.equal(state.searchQuery, 'obras');
});
