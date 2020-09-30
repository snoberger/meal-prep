export default function handler(lambda) {
    return function (event, context) {
        return Promise.resolve()
            // Run the Lambda
            .then(() => lambda(event, context))
            // On success
            .then(({statusCode, body}) => [statusCode || 200, body])
            // On failure
            .catch((e) => {
                console.log(e.message);
            return [500, { error: e.message }];
            })
            // Return HTTP response
            .then(([statusCode, body]) => ({
            statusCode,
            headers: {
            "Access-Control-Allow-Origin": "localhost:3001, localhost:3000",
            "Access-Control-Allow-Credentials": true,
            },
            body: JSON.stringify(body),
            }));
        };
   }