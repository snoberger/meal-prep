import { APIGatewayProxyEvent } from "aws-lambda";


export const getPrincipleId = (event: APIGatewayProxyEvent): string => {
    if(event.requestContext.authorizer && event.requestContext.authorizer.principalId) {
        return event.requestContext.authorizer.principalId as string;
    } else {
        throw new Error("No principalId");
    }
};