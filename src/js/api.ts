import { API_KEY, API_URL } from './config';
import { IRecipeDetail, IRecipeSearchItem } from './types';

interface ILoadSearchResultsResponse {
    data: {
        recipes: IRecipeSearchItem[];
    };
    results: number;
    status: string;
}

interface ILoadRecipeResponse {
    data: {
        recipe: IRecipeDetail;
    };
    status: string;
}

const loadRecipe = async function (id: number) {
    const data: ILoadRecipeResponse | null = await fetch(`${API_URL}/${id}?key=${API_KEY}`)
        .then((response) => {
            if (!response.ok) {
                throw new Error(response.statusText);
            }

            return response.json();
        })
        .catch(() => null);

    return data;
};

const loadSearchResults = async function (query: string) {
    const data: ILoadSearchResultsResponse | null = await fetch(`${API_URL}?search=${query}&key=${API_KEY}`)
        .then((response) => {
            if (!response.ok) {
                throw new Error(response.statusText);
            }

            return response.json();
        })
        .catch(() => null);

    return data;
};

export default {
    loadRecipe,
    loadSearchResults,
};
