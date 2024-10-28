$(document).ready(function () {

})

function loadUserTable() {
    $('#content-container').load('/news_lv/page/userTable', function () {
        fetchRoles()
        fetchUsers('USER');
        backUserTable();
    });
}

function backUserTable() {
    var userId = sessionStorage.getItem('userId');
    setTimeout(function () {
        $('tr').each(function () {
            var editLink = $(this).find('a#viewUserDetail');
            var userInRow = editLink.data('user-id');
            if (userInRow == userId) {
                $(this).find('#fullName').addClass('active-categoryName');
            }
        });
    }, 300);
}

$(document).on('click', '#showUsers', function (e) {
    e.preventDefault();
    var titlePage = $('.titlePage')
    titlePage.html('Quản lý người dùng');
    var titlePageHeading = $('.titlePage-heading')
    titlePageHeading.html('Người dùng hệ thống');
    sessionStorage.removeItem('manage-comment')
    // loadUserTable()
    $('#content-container').load('/news_lv/page/userTable', function () {
        fetchRoles()
        fetchUsers('USER');
    });
    $(this).addClass('active-categoryName');
})

$(document).on('click', '#updateUser', function (e) {
    e.preventDefault()
    var userId = sessionStorage.getItem('userId');
    var roleId = $('#roleUser').val();
    updateRoleUser(userId, roleId);
})

function updateRoleUser(userId, roleId) {
    $.ajax({
        url: '/news_lv/users/updateRole/' + userId,
        type: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify({ roleId: roleId }),
        success: function (response) {
            alert('Cập nhật vai trò thành công!');
            loadUserTable()
            // Xử lý sau khi cập nhật thành công, ví dụ: chuyển hướng hoặc cập nhật giao diện
        },
        error: function (error) {
            console.error('Error updating role:', error);
            alert('Cập nhật vai trò thất bại!');
        }
    });
}

$(document).on('click', '#viewUserDetail', function (e) {
    e.preventDefault()
    var userId = $(this).data('user-id')
    sessionStorage.setItem('userId', userId);
    $('#content-container').load('/news_lv/page/editUser', function () {
        getUserById(userId);
        fetchRoleSelect()
    });
})

$(document).on('click', '#back-userTable', function (e) {
    e.preventDefault()
    loadUserTable()
    /*$('#content-container').load('/news_lv/page/userTable', function () {
        fetchRoles()
        fetchUsers('USER');
    });*/
})

function getUserById(userId) {
    $.ajax({
        url: '/news_lv/users/' + userId,
        type: 'GET',
        success: function (response) {
            renderUserDetail(response.result);
        },
        error: function (error) {
            console.error('Error fetching user:', error);
        }
    });
}

function renderUserDetail(user) {
    $('#fullName').val(user.fullName);
    $('#userName').val(user.userName);
    $('#email').val(user.email);
    $('#dob').val(user.dob);
}

function fetchRoleSelect() {
    $.ajax({
        url: '/news_lv/role',
        type: 'GET',
        success: function (response) {
            renderRoleSelect(response.result);
        },
        error: function (error) {
            console.error('Error fetching roles:', error);
        }
    });
}

function renderRoleSelect(roles) {
    var roleUser = $('#roleUser');
    roleUser.empty();
    if(!roles) {
        roleUser.append('<option value="" selected>Chọn vai trò</option>');
    }

    roles.forEach(function (role) {
        var isSelected = roles === role.id ? 'selected' : '';
        roleUser.append('<option value="' + role.id + '" ' + isSelected + '>' + role.name + '</option>');
    })
}

function fetchRoles() {
    $.ajax({
        url: '/news_lv/role',
        type: 'GET',
        success: function (response) {
            renderRoles(response.result);
        },
        error: function (error) {
            console.error('Error fetching roles:', error);
        }
    });
}

// Function to render roles
function renderRoles(roles) {
    var roleList = $('#role-name');
    roleList.empty();

    var hasAdminManage = false;

    roles.forEach(function (role) {
        if (role.code === 'ADMIN_MANAGE') {
            if(!hasAdminManage){
                role.name = 'Quản lý thể loại'
                var roleNav = createRoleItem(role)
                roleList.append(roleNav);
                hasAdminManage = true;
            }
        } else {
            var roleNav = createRoleItem(role)
            roleList.append(roleNav);
        }
    });

    // Add click event listener to role items
    $('#role-name').on('click', '#roleFetchUser', function () {
        var roleCode = $(this).data('role-code');
        fetchUsers(roleCode);
    });
}

function createRoleItem(role) {
    return `
        <li class="nav-item">
            <a id="roleFetchUser" class="nav-link mb-0 px-0 py-1 active d-flex align-items-center justify-content-center" 
            data-bs-toggle="tab" href="javascript:;" role="tab" aria-selected="true" data-role-code="${role.code}">
                <i class="ni ni-app"></i>
                <span class="ms-2">${role.name}</span>
            </a>
        </li>
    `;
}

// Function to create a role item
/*function createRoleItem(role, roleList) {
    /!*var listItem =
        '<li class="nav-item">' +
            '<a class="nav-link mb-0 px-0 py-1 active d-flex align-items-center justify-content-center" data-bs-toggle="tab" href="javascript:;" role="tab" aria-selected="true" data-role-code="' + role.code + '">' +
                '<i class="ni ni-app"></i>' +
                '<span class="ms-2">' + role.name + '</span>' +
            '</a>' +
        '</li>';
    roleList.append(listItem);*!/
    roleList.append('')
}*/

function fetchUsers(roleCode) {
    // var roleCode = 'ADMIN_MANAGE'; // Example role code

    $.ajax({
        url: '/news_lv/users/usersByRoleAndStatus',
        type: 'GET',
        data: {
            roleCode: roleCode
        },
        success: function (response) {
            if (response.code === 1000 && Array.isArray(response.result)) {
                renderUsers(response.result);
            } else {
                console.error('Invalid response format:', response);
            }
        },
        error: function (error) {
            console.error('Error fetching users:', error);
        }
    });
}

// Function to render users
function renderUsers(users) {
    var tbody = $('table tbody');
    tbody.empty(); // Clear existing rows

    users.forEach(function (user) {
        var userRow = createUserItem(user)
        // createItem(user, tbody);
        tbody.append(userRow);
    });
}

// Function to create an item for each user
function createUserItem(user) {
    return `
        <tr>
            <td id="fullName">${user.fullName}</td>
            <td>${user.userName}</td>
            <td class="text-center">${user.email}</td>
            <td class="text-center">${user.role.name}</td>
            <td class="text-center">${new Date(user.createdDate).toLocaleDateString()}</td>
            
            <td class="align-middle">
                <a id="viewUserDetail" href="#" data-user-id="${user.id}" class="text-secondary font-weight-bold text-xs" 
                data-toggle="tooltip" data-original-title="View user">
                    Chi tiết
                </a>
            </td>
        </tr>
    `;
    /*var row = '<tr>' +
        '<td>' + user.fullName + '</td>' +
        '<td>' + user.userName + '</td>' +
        '<td class="text-center">' + user.email + '</td>' +
        '<td class="text-center">' + user.role.name + '</td>' +
        '<td class="text-center">' + user.createdDate + '</td>' +
        '</tr>';
    tbody.append(row);*/
}