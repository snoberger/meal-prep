import { Ingredient } from "../../store/pantry/reducers/pantry";
import { RecipeStep } from "../../store/recipes/reducers/recipes";


type Ingredients =Ingredient[]
export interface MergedRecipeIngredient {
    ingredients: Ingredients,
    recipeName: string
}
export interface OutputMergedRecipeIngredient {
    ingredient: Ingredient,
}
export function mergeIngredientLists(ingredientsList: MergedRecipeIngredient[]) {
    let mergedList: Ingredient[] = [];

    ingredientsList.forEach((ingredientList) => {
        let recipeName = ingredientList.recipeName;
        ingredientList.ingredients.forEach((ingredientItem) => {
            if(!mergedList.some((ingredient) => {
                if(ingredient.id === ingredientItem.id) {
                    ingredient.amount += `\n${recipeName}: ${ingredientItem.amount}`;
                }
                return ingredient.id === ingredientItem.id;
            })) {
                mergedList.push({
                    ...ingredientItem,
                    amount: `${recipeName}: ${ingredientItem.amount}`   
            });
            }
        });
    });
    return mergedList;
}
type RecipeSteps = RecipeStep[]
export interface MergedRecipeStep {
    steps: RecipeSteps,
    recipeName: string
}
export interface OutputMergedRecipedStep {
    step: RecipeStep,
    recipeName: string
}
export function mergeStepsLists(stepsList: MergedRecipeStep[]) {
    let mergedList: OutputMergedRecipedStep[] = [];
    let appendIndex = 0;
    let noMore = false;
    while(!noMore) {
        noMore = true;
        stepsList.forEach((stepList) => {
            if(stepList.steps[appendIndex] && stepList) {
                mergedList = mergedList.concat({
                    step: stepList.steps[appendIndex],
                    recipeName: stepList.recipeName
                });
                noMore = false;
            }
        });
        appendIndex += 1;
    }
    return mergedList;
}