export interface CreateUserResponse {
    config: {},
    data: string | false,
    headers: {},
    request: XMLHttpRequest,
    status: number,
    statusText: string
}

export interface  CreateUserItem {
    username: string,
    password: string
}