export interface AuthenticateResponse {
    config: {},
    data: {
        authToken: string,
        userId: string,
        pantryId: string
    },
    headers: {},
    request: XMLHttpRequest,
    status: number,
    statusText: string
}


export interface AuthenticateItem {
    username: string,
    password: string
}