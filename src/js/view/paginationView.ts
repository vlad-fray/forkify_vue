import View from './view';
import icons from '../../img/icons.svg';

class PaginationView extends View {
	_parentEl = document.querySelector('.pagination');
	_message = '';
	_errorMessage = '';

	addHandlerClick(handler) {
		this._parentEl.addEventListener('click', function (e) {
			const btn = e.target.closest('.btn--inline');

			if (!btn) return;

			const goToPage = +btn.dataset.goto;
			handler(goToPage);
		});
	}

	_generateMarkup() {
		const curPage = this._data.page;
		const numPages = Math.ceil(
			this._data.results.length / this._data.resultsPerPage
		);

		const prevPage = `
        <button data-goto="${
					curPage - 1
				}" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
                <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${curPage - 1}</span>
        </button>
        `;

		const nextPage = `
        <button class="btn--inline pagination__btn--next" data-goto="${
					curPage + 1
				}">
            <span>Page ${curPage + 1}</span>
            <svg class="search__icon">
                <use href="${icons}#icon-arrow-right"></use>
            </svg>
        </button>
        `;

		if (this._data.page === 1 && numPages > 1) {
			return nextPage;
		}

		if (this._data.page === numPages && numPages > 1) {
			return prevPage;
		}

		if (this._data.page < numPages) {
			return prevPage + nextPage;
		}

		return '';
	}
}

export default new PaginationView();
