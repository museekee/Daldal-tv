export function getData(profile: any) {
    return {
        id: `${profile.provider}-${profile.id}`,
        email: profile.email,
        displayName: profile.username,
        picture: `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png`
    }
}