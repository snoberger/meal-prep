import dynamoLib from '../../src/libs/dynamodb-lib';
const mockPromise = jest.fn()
jest.mock('aws-sdk/clients/dynamodb', ()=> {
    return {
        DocumentClient: class DocumentClient {
            constructor() {
                return
            }
            get = () => {
                return {promise: mockPromise}
            }
            put = () => {
                return {promise: mockPromise}
            }
            query = () => {
                return {promise: mockPromise}
            }
            update = () => {
                return {promise: mockPromise}
            }
            delete = () => {
                return {promise: mockPromise}
            }
            scan = () => {
                return {promise: mockPromise}
            }
        }
    }
})

// test format of non local requests
describe('non-local calls', ()=>{
    beforeEach(() => {
        mockPromise.mockClear();
    });
    test('get calls client promise function', async () => {
        await dynamoLib.get({ TableName:'test', Key: {}});
        expect(mockPromise).toHaveBeenCalled();
    })
    test('put calls client promise function', async () => {
        await dynamoLib.put({ TableName:'test', Item: {}});
        expect(mockPromise).toHaveBeenCalled();
    })
    test('query calls client promise function', async () => {
        await dynamoLib.query({ TableName:'test'});
        expect(mockPromise).toHaveBeenCalled();
    })
    test('update calls client promise function', async () => {
        await dynamoLib.update({ TableName:'test', Key: {}});
        expect(mockPromise).toHaveBeenCalled();
    })
    test('delete calls client promise function', async () => {
        await dynamoLib.delete({ TableName:'test', Key: {}});
        expect(mockPromise).toHaveBeenCalled();
    })
    test('scan calls client promise function', async () => {
        await dynamoLib.scan({ TableName:'test'});
        expect(mockPromise).toHaveBeenCalled();
    })
})


// test format of local requests
describe('non-local calls', ()=>{
    const OLD_ENV = process.env;

    afterAll(() => {
        process.env = OLD_ENV; // restore old env
    });

    beforeAll(async () => {
        process.env.IS_OFFLINE = 'true';
        jest.resetModules()
        await import('../../src/libs/dynamodb-lib')
        jest.mock('aws-sdk/clients/dynamodb', ()=> {
            return {
                DocumentClient: class DocumentClient {
                    constructor() {
                        return
                    }
                    get = () => {
                        return {promise: mockPromise}
                    }
                    put = () => {
                        return {promise: mockPromise}
                    }
                    query = () => {
                        return {promise: mockPromise}
                    }
                    update = () => {
                        return {promise: mockPromise}
                    }
                    delete = () => {
                        return {promise: mockPromise}
                    }
                    scan = () => {
                        return {promise: mockPromise}
                    }
                }
            }
        })
    });

    

    test('get calls client promise function', async () => {
        process.env.IS_OFFLINE = 'true';
        await dynamoLib.get({ TableName:'test', Key: {}});
        expect(mockPromise).toHaveBeenCalled();
    })
    test('put calls client promise function', async () => {
        process.env.IS_OFFLINE = 'true';
        await dynamoLib.put({ TableName:'test', Item: {}});
        expect(mockPromise).toHaveBeenCalled();
    })
    test('query calls client promise function', async () => {
        process.env.IS_OFFLINE = 'true';
        await dynamoLib.query({ TableName:'test'});
        expect(mockPromise).toHaveBeenCalled();
    })
    test('update calls client promise function', async () => {
        process.env.IS_OFFLINE = 'true';
        await dynamoLib.update({ TableName:'test', Key: {}});
        expect(mockPromise).toHaveBeenCalled();
    })
    test('delete calls client promise function', async () => {
        process.env.IS_OFFLINE = 'true';
        await dynamoLib.delete({ TableName:'test', Key: {}});
        expect(mockPromise).toHaveBeenCalled();
    })
    test('scan calls client promise function', async () => {
        process.env.IS_OFFLINE = 'true';
        await dynamoLib.scan({ TableName:'test'});
        expect(mockPromise).toHaveBeenCalled();
    })
})