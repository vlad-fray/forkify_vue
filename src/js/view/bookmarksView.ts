import PreviewView from './previewView';

class BookmarksView extends PreviewView {
	_parentEl = document.querySelector('.bookmarks__list');
	_message = '';
	_errorMessage =
		'No bookmarks yet. Find a nice recipe and bookmark it :)';

	addHandlerRender(handler) {
		window.addEventListener('load', handler);
	}
}

export default new BookmarksView();
