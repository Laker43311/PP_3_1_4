import * as utils from "./util.js"

$(document).ready(async function () {

    await updateUsersTable()

    $("#submitEditBtn").bind("click", async function() {
        let patchedUser = {
            id: $("#editId").val(),
            name: $("#editName").val(),
            surname: $("#editSurname").val(),
            age: $("#editAge").val(),
            email: $("#editEmail").val(),
            password: $("#editPassword").val(),
            roles: []
        }
        for (let option of $("#editRoles").children()) {
            if (option.selected) {
                let patchedRoleId = option.value
                await fetch("users/roles/" + patchedRoleId)
                    .then(response => response.json())
                    .then(role => {
                        patchedUser.roles.push(role)
                    })
            }
        }
        let patchedId = $("#editId").val()
        await fetch("/users/" + patchedId, {
            method: "PATCH",
            body: JSON.stringify(patchedUser),
            headers: {
                "Content-Type": "application/json"
            }
        })
        await updateUsersTable()
        if ($("#editId").val() === await utils.getAuthId()) {
            await utils.updateUserInfo()
        }
        $("#editModal").modal("hide")
    })

    $("#submitDeleteBtn").bind("click", async function() {
        let deletedId = $("#deleteId").val()
        if (deletedId === await utils.getAuthId()) {
            window.location = "/logout"
        }
        await fetch("/users/" + deletedId, {
            method: "DELETE"
        })
        await updateUsersTable()
        $("#deleteModal").modal("hide")
    })

    $("#submitNewBtn").bind("click", async function () {
        const createdUser = {
            name: $("#newName").val(),
            surname: $("#newSurname").val(),
            age: $("#newAge").val(),
            email: $("#newEmail").val(),
            password: $("#newPassword").val(),
            roles: []
        };

        const selectedRoles = Array.from($("#newRoles").children()).filter(option => option.selected);
        for (const option of selectedRoles) {
            try {
                const response = await fetch("/users/roles/" + option.value);
                if (!response.ok) throw new Error(`Не удалось получить роль с id ${option.value}`);
                const role = await response.json();
                createdUser.roles.push(role);
            } catch (error) {
                console.error("Ошибка при получении роли:", error);
            }
        }

            const response = await fetch("/users/addNew", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(createdUser)
            });

        $("#newName").val("");
        $("#newSurname").val("");
        $("#newAge").val("");
        $("#newEmail").val("");
        $("#newPassword").val("");
        $("#newRoles").children().prop("selected", false);

        await updateUsersTable();

        window.location = "/admin";
    });
})

async function updateUsersTable() {
    let body = $(".table #allUsers")
    body.empty()
    let users = await fetch("/users")
        .then(response => response.json())
        .then(users => {
            return users
        })
    for (let user of users) {
        let tr = $("<tr/>")
        let th = $("<th/>")

        th.text(user.id)
        tr.append(th)

        let tdName = $("<td/>")
        tdName.text(user.name)
        tr.append(tdName)

        let tdSurname = $("<td/>")
        tdSurname.text(user.surname)
        tr.append(tdSurname)

        let tdAge = $("<td/>")
        tdAge.text(user.age)
        tr.append(tdAge)

        let tdEmail = $("<td/>")
        tdEmail.text(user.email)
        tr.append(tdEmail)

        body.append(tr)
        let tdRoles = $("<td/>")

        let roles = ""
        for (let role of user.roles) {

            roles += `${role.roleName.substring(5)} `
        }
        tdRoles.text(roles)
        tr.append(tdRoles)

        let tdEdit = $("<td/>")
        let editBtn =$("<button id='editBtn' class='btn btn-primary' type='button'>")
        editBtn.text("Edit")
        editBtn.val(user.id)
        editBtn.bind("click", editFunc)
        tdEdit.append(editBtn)
        tr.append(tdEdit)

        let tdDelete = $("<td/>")
        let deleteBtn =$("<button id='deleteBtn' class='btn btn-danger' type='button'>")
        deleteBtn.text("Delete")
        deleteBtn.val(user.id)
        deleteBtn.bind("click", deleteFunc)
        tdDelete.append(deleteBtn)
        tr.append(tdDelete)
    }
}

async function editFunc() {
    let patchedUser = await fetch("/users/" + this.value)
        .then(response => response.json())
        .then(user => {
            return user
        })
    let select = $("#editRoles")
    select.empty()
    $("#editId").val(patchedUser.id)
    $("#editName").val(patchedUser.name)
    $("#editSurname").val(patchedUser.surname)
    $("#editAge").val(patchedUser.age)
    $("#editEmail").val(patchedUser.email)
    // $("#editPassword").val(patchedUser.password)
    let roles = await fetch("/users/roles/")
        .then(response => response.json())
        .then(rolesList => {
            return rolesList
        })
    for (let role of roles) {
        let option = $("<option/>")
        option.val(role.roleId)
        option.text(role.roleName)
        for (let userRole of patchedUser.roles) {
            if (role.roleId === userRole.roleId) { //возможно тут изменить ид на ролеид
                option.attr("selected", true)
                break
            }
        }
        select.append(option)
    }
    $("#editModal").modal("show")
}

async function deleteFunc() {
    let deletedUser = await fetch("/users/" + this.value)
        .then(response => response.json())
        .then(user => {
            return user
        })
    let select = $("#deleteRoles")
    select.empty()
    $("#deleteId").val(deletedUser.id)
    $("#deleteName").val(deletedUser.name)
    $("#deleteSurname").val(deletedUser.surname)
    $("#deleteAge").val(deletedUser.age)
    $("#deleteEmail").val(deletedUser.email)
    $("#deletePassword").val(deletedUser.password)
    for (let role of deletedUser.roles) {
        let option = $("<option/>")
        option.text(role.roleName)
        select.append(option)
    }
    $("#deleteModal").modal("show")
}
