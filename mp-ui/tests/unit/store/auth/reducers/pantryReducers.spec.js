
import reducer from '../../../../../src/store/pantry/reducers/pantry';
import * as getters from '../../../../../src/store/pantry/reducers/pantry';

import * as types from '../../../../../src/store/pantry/actionTypes';

describe('pantry reducer handlers', () => {
  it('should return the initial state', () => {
    // eslint-disable-next-line no-undef
    process.env.TESTING = true;
    expect(reducer(undefined, {})).toEqual(
      {
          pantry: {
              id: '',
              userId: '',
              ingredients: [],
              createTs: '',
              updateTs: ''
          },
          currentIngredient: {name: '', amount: '', metric: ''},
          displayAddIngredientDiaglogue: false,
          displayEditIngredientDialogue: false,
          alert: false,
      }
    );
    // eslint-disable-next-line no-undef
    process.env.TESTING = false;
  });

//   it('should handle UPDATE_INGREDIENTS', () => {
//     expect(
//       reducer([{ingredients: []}], {
//         type: types.UPDATE_INGREDIENTS,
//       })
//     ).toEqual(
//       {
//         ingredients: []
//       }
//     );
//   });
});

// describe('pantry reducer getters', () => {
//   it('should return the initial state', () => {
//     expect(getters.getIngredients({ pantry: { ingredients: [{
//         name: 'flour',
//         amount: '2',
//         metric: 'bags'
//     }]}})).toEqual([{
//         name: 'flour',
//         amount: '2',
//         metric: 'bags'
//     }]);
//   });
// });