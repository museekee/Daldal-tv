import "express"
declare global {
    namespace Express {
        interface User {
          username: string;
          id?: number;
        }
    }
}
declare module "express-session" {
    interface SessionData {
        passport: {
            user: string
        }
    }
}

export interface Google {
    provider: string
    sub: string
    id: string
    displayName: string
    name: {
        familyName: string | undefined
        givenName: string
    }
    given_name: string
    family_name: string | undefined
    email_verified: boolean
    language: string
    locale: any | undefined
    email: string
    emails: {
        value: string
        type: string
    }[]
    photos: {
        value: string
        type: string
    }[]
    picture: string
    _raw: string
    _json: {
        sub: string
        name: string
        given_name: string
        picture: string
        email: string
        email_verified: boolean
        locale: string
    }
}