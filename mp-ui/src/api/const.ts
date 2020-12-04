export const ENDPOINT = function() {
    switch(process.env.NODE_ENV) {
        case 'production':
            return 'https://wdbb06ys49.execute-api.us-east-1.amazonaws.com/dev/api';
        default:
            return 'http://localhost:3001/api';
    }
};