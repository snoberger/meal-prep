export function setLocalCookRecipes(recipeIds: string[]) {
    localStorage.setItem("cookRecipeIds", recipeIds.join(':'));
}

export function getLocalCookRecipes() {
    const recipeIds = localStorage.getItem('cookRecipeIds');
    if(recipeIds) {
        return recipeIds.split(':');
    }
    else {return [];}
}