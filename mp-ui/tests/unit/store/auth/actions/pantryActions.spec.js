import * as actions from '../../../../../src/store/pantry/actions/pantry';
import * as types from '../../../../../src/store/pantry/actionTypes';

describe("Synchronous Actions", () => {
  it('should send SET_PANTRY with updateIngredients action', () => {  
    const expectedAction = {
      type: types.SET_PANTRY,
      pantry: {
        id: '1234',
        userId: '12341234',
        ingredients: [{name: 'test', amount: '1', metric: 'cups'}],
        createTs: 'now',
        updateTs: 'now'
      }
    };

    expect(actions.setPantry({
      id: '1234',
      userId: '12341234',
      ingredients: [{name: 'test', amount: '1', metric: 'cups'}],
      createTs: 'now',
      updateTs: 'now'
    })).toEqual(expectedAction);
  });
  it('should send EDIT_PANTRY_INGREDIENT with EDIT_PANTRY_INGREDIENT action', () => {
    const expectedAction = {
      type: types.EDIT_PANTRY_INGREDIENT,
      ingredients: [{
        index: 0, 
        name: "name",
        amount: "amount",
        metric: "metric"
      }]
    };

    expect(actions.editedPantryIngredients([
          {
            index: 0, 
            name: "name", 
            amount: "amount", 
            metric: "metric"
          }
        ]
      )).toEqual(expectedAction);

  });
  it('should send TOGGLE_ADDDIALOGUE with toggleAddIngredientDialogue action', () => {  
    const expectedAction = {
      type: types.TOGGLE_ADDDIALOGUE
    };

    expect(actions.toggleAddIngredientDialogue()).toEqual(expectedAction);
  });

  it('should send TOGGLE_PANTRYERROR with editPantryIngredientsError action', () => {  
    const expectedAction = {
      type: types.TOGGLE_PANTRYERROR
    };

    expect(actions.editPantryIngredientsError()).toEqual(expectedAction);
  });
});

//@TODO Create tests for asynchronous test handleCreateIngredient
