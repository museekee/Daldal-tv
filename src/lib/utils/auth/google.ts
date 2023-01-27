export function getData (profile: any) {
    return {
        id: `${profile.provider}-${profile.id}`,
        email: profile.email,
        displayName: profile.displayName,
        picture: profile.picture
    }
}