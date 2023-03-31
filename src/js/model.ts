import api from './api';
import { API_KEY, API_URL, RES_PER_PAGE } from './config.js';
import { AJAX } from './helpers.js';

const state = {
    recipe: {},
    search: {
        query: '',
        results: [],
        page: 1,
        resultsPerPage: RES_PER_PAGE,
    },
    bookmarks: [],
};

const createRecipeObject = function (data) {
    const { recipe } = data.data;

    return {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        sourceUrl: recipe.source_url,
        imageUrl: recipe.image_url,
        ingredients: recipe.ingredients,
        servings: recipe.servings,
        cookingTime: recipe.cooking_time,
        ...(recipe.key && { key: recipe.key }),
    };
};

const loadRecipe = async function (id: number) {
	const data = await api.loadRecipe(id);

	state.recipe = createRecipeObject(data);

	state.recipe.bookmarked = state.bookmarks.some((b) => b.id === id);
};

const loadSearchResults = async function (query: string) {
	state.search.query = query;

	const data = await api.loadSearchResults(query);

	if (!data) return;

	state.search.results = data.data.recipes.map((recipe) => {
		return {
			id: recipe.id,
			title: recipe.title,
			publisher: recipe.publisher,
			imageUrl: recipe.image_url,
			...(recipe.key && { key: recipe.key }),
		};
	});
};

const getSearchResultsPage = function (page = state.search.page) {
    state.search.page = page;

    const start = (page - 1) * state.search.resultsPerPage;
    const end = page * state.search.resultsPerPage;

    return state.search.results.slice(start, end);
};

const updateServings = function (servingsCount = state.recipe.servings) {
    state.recipe.ingredients.forEach((ing) => {
        ing.quantity *= servingsCount / state.recipe.servings;
        //newQt = oldQt * serCount / oldSerCount
    });

    state.recipe.servings = servingsCount;
};

const persistBookmarks = function () {
    localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

const addBookmark = function (recipe) {
    // Add bookmark
    state.bookmarks.push(recipe);

    // Mark current recipe as bookmarked
    state.recipe.bookmarked = true;

    // Save new bookmarks array in local storage
    persistBookmarks();
};

const removeBookmark = function (id: number) {
    // Remove bookmark
    const index = state.bookmarks.findIndex((b) => b.id === id);
    state.bookmarks.splice(index, 1);

    // Mark current recipe as not bookmarked
    state.recipe.bookmarked = false;

    // Save new bookmarks array in local storage
    persistBookmarks();
};

const restoreBookmarks = function () {
    const storage = localStorage.getItem('bookmarks');

    if (storage) state.bookmarks = JSON.parse(storage);
};

const uploadRecipe = async function (newRecipe) {
    try {
        const ingredients = Object.entries(newRecipe)
            .filter((entry) => entry[0].startsWith('ingredient') && entry[1] !== '')
            .map((ing) => {
                const ingArr = ing[1].split(',');
                if (ingArr.length !== 3) throw new Error('Wrong ingredient format!');
                const [quantity, unit, description] = ingArr;
                return {
                    quantity: quantity ? +quantity : null,
                    unit,
                    description,
                };
            });

        const recipe = {
            title: newRecipe.title,
            source_url: newRecipe.sourceUrl,
            image_url: newRecipe.image,
            publisher: newRecipe.publisher,
            cooking_time: +newRecipe.cookingTime,
            servings: +newRecipe.servings,
            ingredients,
        };

        const data = await AJAX(`${API_URL}?key=${API_KEY}`, recipe);

        state.recipe = createRecipeObject(data);

        addBookmark(state.recipe);
    } catch (err) {
        throw err;
    }
};

export {
    state,
    loadRecipe,
    loadSearchResults,
    getSearchResultsPage,
    updateServings,
    addBookmark,
    removeBookmark,
    restoreBookmarks,
    uploadRecipe,
};
