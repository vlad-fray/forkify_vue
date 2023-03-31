import { TIMEOUT_SEC } from './config';

const AJAX = async function (url: string, uploadData: any = undefined) {
	try {
		const fetchPromise = uploadData
			? fetch(url, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(uploadData),
			  })
			: fetch(url);

		const response = await Promise.race([
			timeout(TIMEOUT_SEC),
			fetchPromise,
		]);

		const data = await response.json();

		if (!response.ok) {
			throw new Error(`${data.message} ${response.status}`);
		}

		return data;
	} catch (err) {
		throw err;
	}
};

const timeout = function (s: number) {
	return new Promise((_, reject) => {
		return setTimeout(function () {
			reject(
				new Error(`Request took too long! Timeout after ${s} second`)
			);
		}, s * 1000);
	});
};

export {
	AJAX,
	timeout,
}

/* export const getJSON = async function (url) {
	try {
		const response = await Promise.race([
			timeout(TIMEOUT_SEC),
			fetch(url),
		]);
		const data = await response.json();

		if (!response.ok)
			throw new Error(`${data.message} ${response.status}`);

		return data;
	} catch (err) {
		throw err;
	}
};
export const sendJSON = async function (url, uploadData) {
	try {
		const response = await Promise.race([
			timeout(TIMEOUT_SEC),
			fetch(url, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(uploadData),
			}),
		]);
		const data = await response.json();

		if (!response.ok)
			throw new Error(`${data.message} ${response.status}`);

		return data;
	} catch (err) {
		throw err;
	}
}; */
