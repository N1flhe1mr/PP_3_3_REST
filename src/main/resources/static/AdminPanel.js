'use strict';

$(async function () {
    try {
        await getUsers();
        await getRolesForDropdown('newUserRoles');
    } catch (error) {
        console.error('Error:', error);
    }
});

async function getUsers() {
    const usersTableBody = $('#usersTableBody');
    usersTableBody.empty();
    try {
        const response = await fetch("api/users");
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const usersData = await response.json();
        usersData.forEach(userData => {
            usersTableBody.append(createUserRow(userData));
        });
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
    }
}

function createUserRow(userData) {
    return `
        <tr>
            <td>${userData.id}</td>
            <td>${userData.name}</td>
            <td>${userData.surname}</td>
            <td>${userData.age}</td>
            <td>${userData.username}</td>
            <td>${userData.email}</td>
            <td>${userData.roles.map(role => role.name).join(', ')}</td>
            <td>
                <button type="button" class="btn btn-info edit-button" data-bs-toggle="modal"
                        data-id="${userData.id}" data-bs-target="#editUserModal">Edit</button>
            </td>
            <td>
                <button type="button" class="btn btn-danger delete-button" data-bs-toggle="modal"
                        data-id="${userData.id}" data-bs-target="#deleteUserModal">Delete</button>
            </td>
        </tr>
    `;
}

async function getRolesForDropdown(dropdownId) {
    try {
        const response = await fetch("api/users/roles");
        if (!response.ok) throw new Error("Failed to fetch roles");
        const roles = await response.json();
        populateRolesDropdown(roles, dropdownId);
    } catch (error) {
        console.error("Error fetching roles:", error);
    }
}

function populateRolesDropdown(roles, dropdownId) {
    const dropdown = $(`#${dropdownId}`);
    dropdown.empty();
    roles.forEach(role => {
        dropdown.append(`<option value="${role.id}">${role.name}</option>`);
    });
}

document.forms["addNewUserForm"].addEventListener("submit", handleNewUserFormSubmit);

async function handleNewUserFormSubmit(event) {
    event.preventDefault();
    const form = event.target;

    let newUserRoles = $('#newUserRoles option:selected').toArray().map(option => {
        return {
            name: $(option).text(),
            id: $(option).val()
        };
    });

    const userData = {
        name: form.name.value,
        surname: form.surname.value,
        age: form.age.value,
        username: form.username.value,
        password: form.password.value,
        email: form.email.value,
        roles: newUserRoles
    };

    try {
        const response = await fetch("api/users/save", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(userData)
        });

        if (response.ok) {
            $('#nav-home-tab').tab('show');
            document.getElementById('addNewUserForm').reset();
            await getUsers();
        } else {
            throw new Error("Error adding user");
        }
    } catch (error) {
        console.error('Error adding user:', error);
        alert('An error occurred while adding the user. Please try again later.');
    }
}

async function getUserById(userId) {
    try {
        const response = await fetch(`api/users/${userId}`);
        if (!response.ok) throw new Error('Failed to fetch user');
        return await response.json();
    } catch (error) {
        console.error('Error fetching user:', error);
    }
}

function fillForm(userData, formId, rolesDropdownId) {
    $(`#${formId}Id`).val(userData.id);
    $(`#${formId}Name`).val(userData.name);
    $(`#${formId}Surname`).val(userData.surname);
    $(`#${formId}Age`).val(userData.age);
    $(`#${formId}Username`).val(userData.username);
    $(`#${formId}Email`).val(userData.email);
    populateRolesDropdown(userData.roles, rolesDropdownId);
    userData.roles.forEach(role => {
        $(`#${rolesDropdownId} option[value="${role.id}"]`).prop('selected', true);
    });
    $(`#${rolesDropdownId}`).val('');
}

document.addEventListener('click', async function (event) {
    if (event.target.matches('.edit-button')) {
        const userId = event.target.dataset.id;
        const userData = await getUserById(userId);
        userData.roles = getRolesForDropdown('editUserModalRoles');
        fillForm(userData, 'editUserModal', 'editUserModalRoles');
        $('#editUserModal').modal('show');
    } else if (event.target.matches('.delete-button')) {
        const userId = event.target.dataset.id;
        const userData = await getUserById(userId);
        fillForm(userData, 'deleteUserModal', 'deleteUserModalRoles');
        $('#deleteUserModal').modal('show');
    }
});

document.getElementById('editUserForm').addEventListener("submit", async function (event) {
    event.preventDefault();
    const userId = document.getElementById('editUserModalId').value;
    const selectedRoles = $('#editUserModalRoles option:selected').toArray().map(option => { return { name: $(option).text(), id: $(option).val() }; });

    let userData = {
        id: userId,
        name: $('#editUserModalName').val(),
        surname: $('#editUserModalSurname').val(),
        age: parseInt($('#editUserModalAge').val(), 10),
        username: $('#editUserModalUsername').val(),
        email: $('#editUserModalEmail').val(),
        roles: selectedRoles
    };

    try {
        const response = await fetch(`api/users/update`, {
            method: "PATCH",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(userData)
        });

        if (response.ok) {
            $('#editUserModal').modal('hide');
            await getUsers();
        } else {
            throw new Error("Failed to update user");
        }
    } catch (error) {
        console.error('Error updating user:', error);
        alert('An error occurred while updating the user. Please try again later.');
    }
});

document.getElementById('deleteUserForm').addEventListener("submit", async function (event) {
    event.preventDefault();
    const userId = document.getElementById('deleteUserModalId').value;

    try {
        const response = await fetch(`api/users/delete/${userId}`, {
            method: "DELETE"
        });

        if (response.ok) {
            $('#deleteUserModal').modal('hide');
            await getUsers();
        } else {
            throw new Error("Failed to delete user");
        }
    } catch (error) {
        console.error('Error deleting user:', error);
        alert('An error occurred while deleting the user. Please try again later.');
    }
});