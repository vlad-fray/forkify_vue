import icons from '../../img/icons.svg';

export default class View {
	_data;

	/**
	 * Render the received object to the DOM
	 * @param {Object | Object[]} data The data to be rendered (e.g. recipe)
	 * @returns Render error message if has some error
	 * @this {Object} View instance
	 */
	render(data) {
		if (!data || (Array.isArray(data) && data.length === 0))
			return this.renderError();

		this._data = data;
		const markup = this._generateMarkup();

		this._clear();
		this._parentEl.insertAdjacentHTML('afterbegin', markup);
	}

	update(data = null) {
		this._data = data;
		const newMarkup = this._generateMarkup();

		//New fragment of DOM tree, not incided to current HTML
		const newDOM = document
			.createRange()
			.createContextualFragment(newMarkup);

		//Array of new fragment of DOM tree
		const newEls = Array.from(newDOM.querySelectorAll('*'));
		//Array of current fragment of DOM tree, which is included to HTML
		const curEls = Array.from(this._parentEl.querySelectorAll('*'));

		//Comparing new and current fragments
		newEls.forEach((newEl, i) => {
			const curEl = curEls[i];

			// Update changet TEXT
			if (
				!newEl.isEqualNode(curEl) &&
				newEl.firstChild?.nodeValue.trim() !== ''
			) {
				curEl.textContent = newEl.textContent;
			}

			// Update changed ATTRIBUTES
			if (!newEl.isEqualNode(curEl)) {
				Array.from(newEl.attributes).forEach((attr) =>
					curEl.setAttribute(attr.name, attr.value)
				);
			}
		});
	}

	renderSpinner() {
		const markup = `
        <div class="spinner">
          <svg>
            <use href="${icons}#icon-loader"></use>
          </svg>
        </div>
      `;
		this._clear();
		this._parentEl.insertAdjacentHTML('afterbegin', markup);
	}

	renderError(message = this._errorMessage) {
		const markup = `
        <div class="error">
            <div>
              <svg>
                <use href="${icons}#icon-alert-triangle"></use>
              </svg>
            </div>
            <p>${message}</p>
        </div>
        `;
		this._clear();
		this._parentEl.insertAdjacentHTML('afterbegin', markup);
	}

	_clear() {
		this._parentEl.innerHTML = '';
	}
}
