import * as actions from '../../../../../src/store/pantry/actions/pantry';
import * as types from '../../../../../src/store/pantry/actionTypes';

describe("Synchronous Actions", () => {
  it('should send UPDATE_INGREDIENTS with updateIngredients action', () => {  
    const expectedAction = {
      type: types.UPDATE_INGREDIENTS
    };

    expect(actions.updateIngredients()).toEqual(expectedAction);
  });
  it('should send  ADD_PANTRY_INGREDIENT with  ADD_PANTRY_INGREDIENT action', () => {
    const expectedAction = {
      type: types.ADD_PANTRY_INGREDIENT,
      ingredient: {
        name: "name",
        amount: "amount",
        metric: "metric"
      }
    };

    expect(actions.createdPantryIngredient({name: "name", amount: "amount", metric: "metric"})).toEqual(expectedAction);

  });
});

