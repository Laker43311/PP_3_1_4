export async function getAuthUser() {
    let response = await fetch("/user/current")
    return response.ok
        ? response.json()
        : null
}

export async function getAuthId() {
    return await getAuthUser()
        .then(authUser => authUser ? authUser.id : null)
}

export async function updateUserInfo() {
    let authUser = await getAuthUser()
    if (authUser != null) {
        $("#usernameNavbar").text(authUser.email)
        $("#userId").text(authUser.id)
        $("#userName").text(authUser.name)
        $("#userSurname").text(authUser.surname)
        $("#userAge").text(authUser.age)
        $("#userEmail").text(authUser.email)
        let rolesText = " with roles: "
        for (let role of authUser.roles) {
            rolesText += `${role.roleName.substring(5)}, `
        }
        $("#userRolesNavbar").text(rolesText.slice(0, -2))
        $("#userRoles").text(rolesText.slice(12, -2))
    }
}