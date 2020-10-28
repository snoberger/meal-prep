export interface AuthenticateResponse {
    config: {},
    data: {
        message: string
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