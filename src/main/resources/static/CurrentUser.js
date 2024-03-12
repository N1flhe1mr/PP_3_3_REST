'use strict';

const currentUserTable = document.getElementById('currentUserTable');
const currentUserTableBody = currentUserTable.querySelector('tbody');
const currentUserHeader = document.getElementById('currentUserHeader');

fetch("api/user")
    .then(response => {

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        return response.json();
    })
    .then(currentUserData => {
        currentUserHeader.innerHTML = `
            <div class="row m-0 p-2 ">
                <div class="col-11 text-white">
                    <span class="h5">${currentUserData.email}</span> with roles:
                    <span class="font-weight-light">${currentUserData.roles.map(role => role.name).join(', ')}</span>
                </div>
                <div class="col-1 text-white">
                    <a class="btn-dark text-secondary" href="/logout">Logout</a>
                </div>
            </div>
        `;
        currentUserTableBody.innerHTML =
            `<tr>
            <td>${currentUserData.id}</td>
            <td>${currentUserData.name}</td>
            <td>${currentUserData.surname}</td>
            <td>${currentUserData.age}</td>
            <td>${currentUserData.username}</td>
            <td>${currentUserData.email}</td>
            <td>${currentUserData.roles.map(role => role.name).join(', ')}</td>
        </tr>`;
    })
    .catch(error => {
        console.error('There was a problem with your fetch operation:', error);
    });