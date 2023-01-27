export function getData(profile: any) {
    return {
        id: `${profile.provider}-${profile.id}`,
        email: profile.account,
        displayName: profile.displayName,
        picture: `https://daldal.so${profile.profile.image.replace("url(", "").replace(") 0% 0% / 100% 100% no-repeat", "")}`
    }
}