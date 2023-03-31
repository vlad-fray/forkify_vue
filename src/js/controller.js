import * as model from './model.js';
import recipeView from './view/recipeView.js';
import searchView from './view/searchView.js';
import resultsView from './view/resultsView.js';
import paginationView from './view/paginationView.js';
import bookmarksView from './view/bookmarksView.js';
import addRecipeView from './view/addRecipeView.js';

import { MODAL_CLOSE_SEC } from './config';

///////////////////////////////////////

const controlRecipes = async function () {
	try {
		const id = window.location.hash.slice(1);

		if (!id) return;
		recipeView.renderSpinner();

		// Update selected and non-selected results view
		resultsView.update(model.getSearchResultsPage());
		bookmarksView.update(model.state.bookmarks);

		// Loading recipe
		await model.loadRecipe(id);

		// Rendering recipe
		recipeView.render(model.state.recipe);
		controlServings();
	} catch (err) {
		recipeView.renderError();
	}
};

const controlSearchResults = async function () {
	try {
		resultsView.renderSpinner();
		const query = searchView.getQuery();
		console.log(query);

		if (!query) return;

		// Loading recipes
		await model.loadSearchResults(query);

		// Renderind results
		resultsView.render(model.getSearchResultsPage(1));

		// Rendering initial pagination buttons
		paginationView.render(model.state.search);
	} catch (err) {
		resultsView.renderError();
	}
};

const controlPagination = function (goToPage) {
	try {
		// Renderind new results
		resultsView.render(model.getSearchResultsPage(goToPage));

		// Rendering new pagination buttons
		paginationView.render(model.state.search);
	} catch (err) {
		resultsView.renderError();
	}
};

const controlServings = function (servingsCount) {
	//Update the recipe servings (in state)
	model.updateServings(servingsCount);

	//Update the recipe view
	recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
	// Add/remove bookmark
	if (!model.state.recipe.bookmarked)
		model.addBookmark(model.state.recipe);
	else model.removeBookmark(model.state.recipe.id);

	// Update recipe view
	recipeView.update(model.state.recipe);

	// Render bookmarks
	bookmarksView.render(model.state.bookmarks);
};

const synchronizeBookmarks = function () {
	model.restoreBookmarks();
	bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
	try {
		addRecipeView.renderSpinner();

		// Upload the new recipe data
		await model.uploadRecipe(newRecipe);

		// Render recipe
		recipeView.render(model.state.recipe);
		bookmarksView.render(model.state.bookmarks);

		// Change ID in URL
		window.history.pushState(null, '', `#${model.state.recipe.id}`);

		// Success message
		addRecipeView.renderMessage();

		// Close form
		setTimeout(function () {
			addRecipeView.closeWindow();
		}, MODAL_CLOSE_SEC * 1000);
	} catch (err) {
		addRecipeView.renderError(err.message);
	}
};

const init = function () {
	recipeView.addHandlerRender(controlRecipes);
	recipeView.addHandlerUpdateServings(controlServings);
	recipeView.addHandlerBookmark(controlAddBookmark);
	searchView.addHandlerSearch(controlSearchResults);
	paginationView.addHandlerClick(controlPagination);
	bookmarksView.addHandlerRender(synchronizeBookmarks);
	addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();
