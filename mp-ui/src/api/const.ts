export const ENDPOINT = function() {
    switch(process.env.stage) {
        case 'prod':
            return 'https://wdbb06ys49.execute-api.us-east-1.amazonaws.com/dev';
        default:
            return 'http://localhost:3001/api';
    }
};