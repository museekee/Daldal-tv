namespace Auth {
    interface StrategyProcess {
        clientID: string
        clientSecret: string
        callbackURL: string
        passReqToCallback: boolean
    }
}

export = Auth