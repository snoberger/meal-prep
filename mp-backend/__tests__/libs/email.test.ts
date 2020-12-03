import {generateTemplate}  from '../../src/libs/email'

describe('email service', ()=> {
    test('generateTemplate returns a empty strign by default', ()=> {
        const result = generateTemplate('', null)
        expect(result).toEqual('')
    })
    test('generateTemplate returns a tmplate for a grocery list email', ()=> {
        const result = generateTemplate('grecery-list', ['item - 1 cups'])
        expect(result).toEqual('')
    })
})