interface IIngridient {
    description: string;
    quantity: number;
    unit: string;
}

interface IRecipeDetail {
    cooking_time: number;
    id: string;
    image_url: string;
    ingredients: IIngridient[];
    publisher: string;
    servings: number;
    source_url: string;
    title: string;
}

interface IRecipeSearchItem {
    id: string;
    image_url: string;
    publisher: string;
    title: string;
}

export type {
    IIngridient,
    IRecipeDetail,
    IRecipeSearchItem,
}