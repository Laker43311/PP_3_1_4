import * as utils from "./util.js"

$(document).ready(async function () {

    await updateUsersTable()

    $("#submitEditBtn").on("click", async function() {
        try {
            let patchedUser = {
                id: $("#editId").val(),
                name: $("#editName").val(),
                surname: $("#editSurname").val(),
                age: parseInt($("#editAge").val()),
                email: $("#editEmail").val(),
                password: $("#editPassword").val(),
                roles: []
            }
            for (let option of $("#editRoles").children()) {
                if (option.selected) {
                    let patchedRoleId = option.value
                    let role = await fetch("/users/roles/" + patchedRoleId)
                        .then(response => response.json())
                    patchedUser.roles.push(role)
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
        } catch (error) {
            console.error("Ошибка при обновлении пользователя:", error)
            alert("Не удалось обновить пользователя. Проверьте консоль для подробностей.")
        }
    })

    $("#submitDeleteBtn").on("click", async function() {
        try {
            let deletedId = $("#deleteId").val()
            if (deletedId === await utils.getAuthId()) {
                window.location = "/logout"
                return
            }
            await fetch("/users/" + deletedId, {
                method: "DELETE"
            })
            await updateUsersTable()
            $("#deleteModal").modal("hide")
        } catch (error) {
            console.error("Ошибка при удалении пользователя:", error)
            alert("Не удалось удалить пользователя. Проверьте консоль для подробностей.")
        }
    })

    $("#submitNewBtn").on("click", async function () {
        try {
            const createdUser = {
                name: $("#newName").val(),
                surname: $("#newSurname").val(),
                age: parseInt($("#newAge").val()),
                email: $("#newEmail").val(),
                password: $("#newPassword").val(),
                roles: []
            };

            const selectedRoles = Array.from($("#newRoles").children()).filter(option => option.selected);
            for (const option of selectedRoles) {
                const response = await fetch("/users/roles/" + option.value);
                if (!response.ok) throw new Error(`Не удалось получить роль с id ${option.value}`);
                const role = await response.json();
                createdUser.roles.push(role);
            }

            const response = await fetch("/users/addNew", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(createdUser)
            });

            if (!response.ok) {
                const errorResponse = await response.json();
                alert(`Ошибка при создании пользователя: ${errorResponse.message}`);
                return;
            }

            // Очистить поля ввода
            $("#newName").val("");
            $("#newSurname").val("");
            $("#newAge").val("");
            $("#newEmail").val("");
            $("#newPassword").val("");
            $("#newRoles").children().prop("selected", false);


            await updateUsersTable();


            $("#newModal").modal("hide");


            $('#home-tab').click();

        } catch (error) {
            console.error("Ошибка при создании пользователя:", error)
            alert("Не удалось создать пользователя. Проверьте консоль для подробностей.")
        }
    });
})

async function updateUsersTable() {
    let body = $(".table #allUsers")
    body.empty()
    try {
        let users = await fetch("/users")
            .then(response => response.json())

        for (let user of users) {
            let tr = $("<tr/>")

            tr.append($("<th/>").text(user.id))
            tr.append($("<td/>").text(user.name))
            tr.append($("<td/>").text(user.surname))
            tr.append($("<td/>").text(user.age))
            tr.append($("<td/>").text(user.email))

            let roles = user.roles.map(role => role.roleName.substring(5)).join(", ")
            tr.append($("<td/>").text(roles))

            let editBtn = $("<button/>", {
                class: 'btn btn-primary',
                text: 'Edit',
                value: user.id,
                click: editFunc
            })
            tr.append($("<td/>").append(editBtn))

            let deleteBtn = $("<button/>", {
                class: 'btn btn-danger',
                text: 'Delete',
                value: user.id,
                click: deleteFunc
            })
            tr.append($("<td/>").append(deleteBtn))

            body.append(tr)
        }
    } catch (error) {
        console.error("Ошибка при обновлении таблицы пользователей:", error)
        alert("Не удалось обновить таблицу пользователей. Проверьте консоль для подробностей.")
    }
}

async function editFunc() {
    try {
        let patchedUser = await fetch("/users/" + this.value)
            .then(response => response.json())

        let select = $("#editRoles")
        select.empty()
        $("#editId").val(patchedUser.id)
        $("#editName").val(patchedUser.name)
        $("#editSurname").val(patchedUser.surname)
        $("#editAge").val(patchedUser.age)
        $("#editEmail").val(patchedUser.email)
        $("#editPassword").val("")

        let roles = await fetch("/users/roles/")
            .then(response => response.json())

        for (let role of roles) {
            let option = $("<option/>", {
                value: role.roleId,
                text: role.roleName.substring(5)
            })
            for (let userRole of patchedUser.roles) {
                if (role.roleId === userRole.roleId) {
                    option.prop("selected", true)
                    break
                }
            }
            select.append(option)
        }
        $("#editModal").modal("show")
    } catch (error) {
        console.error("Ошибка при получении данных пользователя для редактирования:", error)
        alert("Не удалось загрузить данные пользователя. Проверьте консоль для подробностей.")
    }
}

async function deleteFunc() {
    try {
        let deletedUser = await fetch("/users/" + this.value)
            .then(response => response.json())

        let select = $("#deleteRoles")
        select.empty()
        $("#deleteId").val(deletedUser.id)
        $("#deleteName").val(deletedUser.name)
        $("#deleteSurname").val(deletedUser.surname)
        $("#deleteAge").val(deletedUser.age)
        $("#deleteEmail").val(deletedUser.email)
        $("#deletePassword").val(deletedUser.password)

        for (let role of deletedUser.roles) {
            let option = $("<option/>", {
                text: role.roleName.substring(5)
            })
            select.append(option)
        }
        $("#deleteModal").modal("show")
    } catch (error) {
        console.error("Ошибка при получении данных пользователя для удаления:", error)
        alert("Не удалось загрузить данные пользователя. Проверьте консоль для подробностей.")
    }
}
