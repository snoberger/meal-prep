export interface IngredientType {
    id: string,
    name: string,
    amount: number,
    metric: string
}

export interface RecipeType {
    id: string,
    ingredients: IngredientType[],
    steps: StepType[]
}

export type StepType = string
