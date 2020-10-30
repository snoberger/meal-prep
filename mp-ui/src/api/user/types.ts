export interface CreateUserResponse {
    config: {},
    data:  {
        message: string
    },
    headers: {},
    request: XMLHttpRequest,
    status: number,
    statusText: string
}

export interface  CreateUserItem {
    username: string,
    password: string
}