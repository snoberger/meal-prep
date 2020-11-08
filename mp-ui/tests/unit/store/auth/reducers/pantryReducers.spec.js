// import reducer from '../../../../../src/store/pantry/reducers/pantry';
// import * as getters from '../../../../../src/store/pantry/reducers/pantry';

// import * as types from '../../../../../src/store/pantry/actionTypes';

// describe('pantry reducer handlers', () => {
//   it('should return the initial state', () => {
//     process.env.TESTING = true
//     expect(reducer(undefined, {})).toEqual(
//       {
//         ingredients: []
//       }
//     );
//     process.env.TESTING = false
//   });

//   it('should handle UPDATE_INGREDIENTS', () => {
//     expect(
//       reducer([], {
//         type: types.UPDATE_INGREDIENTS,
//         ingredients: [{
//             name: 'flour',
//             amount: '2',
//             metric: 'bags'
//         }]
//       })
//     ).toEqual(
//       {
//         ingredients: [{
//             name: 'flour',
//             amount: '2',
//             metric: 'bags'
//         }]
//       }
//     );
//   });
// });

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