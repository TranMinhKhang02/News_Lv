$(document).ready(function () {

})

function loadUserTable() {
    $('#content-container').load('/news_lv/page/userTable', function () {
        fetchRoles()
        fetchUsers('USER');
        backUserTable();
    });
}

function showBtnUser() {
    var userId = sessionStorage.getItem('userId');
    var saveUserBtn = $('#saveUser');
    var updateUserBtn = $('#updateUser');
    if (userId) {
        saveUserBtn.hide()
    } else {
        updateUserBtn.hide()
    }
}

function backUserTable() {
    var userId = sessionStorage.getItem('userId');
    setTimeout(function () {
        $('tr').each(function () {
            var editLink = $(this).find('a#viewUserDetail');
            var userInRow = editLink.data('user-id');
            if (userInRow === userId) {
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
    sessionStorage.setItem('roleCode', 'USER');
    // loadUserTable()
    $('#content-container').load('/news_lv/page/userTable', function () {
        fetchRoles()
        fetchUsers('USER');
    });
    $('.nav-link').removeClass('active-categoryName');
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
            // alert('Cập nhật vai trò thành công!');
            createToast('success', 'fas fa-check', 'Thành công', 'Cập nhật vai trò thành công');
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
        $('#saveUser').hide();

        $('#userName').on('blur', function() {
            var userName = $(this).val();
            if (userName) {
                checkUserNameExists(userName);
            }
        });
    });
})

$(document).on('click', '#createUser', function (e) {
    e.preventDefault()
    sessionStorage.removeItem('roleCode');
    $('#content-container').load('/news_lv/page/editUser', function () {
        $('#content-container').find('input').each(function() {
            $(this).val('');
            $(this).removeAttr('readonly');
        })
        $('.password-input').show();
        $('#updateUser').hide();
        fetchRoleSelect()
    });
})

$(document).on('click', '#deleteUser', function () {
    var userIds = [];
    var userNames = [];
    $('#checkboxUsers:checked').each(function () {
        userIds.push($(this).val());
        userNames.push($(this).closest('tr').find('#userName').text());
    });

    if (userIds.length > 0) {
        var confirmationMessage = 'Bạn có chắc muốn xóa người dùng:<br>' + userNames.join(',<br>') + '?';
        $('#confirmationMessage').html(confirmationMessage);
        /*var confirmationMessage = 'Bạn có chắc muốn xóa các bài viết:\n' + selectedTitles.join(',\n') + '?';
        $('#confirmationMessage').text(confirmationMessage);*/
        $('#deleteConfirmationModal').show();

        $('#confirmDelete').off('click').on('click', function () {
            $.ajax({
                url: '/news_lv/users/update-status',
                method: 'PUT',
                contentType: 'application/json',
                data: JSON.stringify(userIds),
                success: function(response) {
                    if (response.code === 1000) {
                        loadCategorySuccess()
                        createToast('success', 'fas fa-check', 'Thành công', 'Xóa người dùng thành công');
                        // location.reload();
                    } else {
                        alert('Có lỗi xảy ra: ' + response.message);
                    }
                },
                error: function(error) {
                    console.error('Error deleting news:', error);
                    alert('Có lỗi xảy ra khi xóa người dùng');
                }
            });
            $('#deleteConfirmationModal').hide();
        });

        $('#cancelDelete, .close').off('click').on('click', function () {
            $('#deleteConfirmationModal').hide();
        });
    } else {
        alert('Vui lòng chọn ít nhất một ngươi dùng để xóa');
    }
});

$(document).on('click', '#saveUser', function (e) {
    e.preventDefault()
    createUser()
})

function createUser() {
    var userDate = {
        fullName: $('#fullName').val(),
        userName: $('#userName').val(),
        password: $('#password').val(),
        email: $('#email').val(),
        dob: $('#dob').val(),
    }

    var roleId = $('#roleUser').val();

    $.ajax({
        url: '/news_lv/users/createUser/' + roleId,
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(userDate),
        success: function (response) {
            // alert('Tạo người dùng thành công!');
            createToast('success', 'fas fa-check', 'Thành công', 'Tạo người dùng thành công');
            loadUserTable()
        },
        error: function (error) {
            console.error('Error creating user:', error);
            alert('Tạo người dùng thất bại!');
        }
    })
}

function checkUserNameExists(userName) {
    $.ajax({
        url: '/news_lv/users/checkUserName',
        type: 'GET',
        data: {
            userName: userName
        },
        success: function(response) {
            if (response.result) {
                $('#userNameError').removeClass('d-none')
                $('#userName').val(''); // Xóa giá trị của trường userName
            } else {
                $('#userNameError').addClass('d-none')
            }
        },
        error: function(error) {
            console.error('Error checking userName:', error);
        }
    });
}

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
    var sessionRoleCode = sessionStorage.getItem('roleCode');
    roleUser.empty();
    if (!sessionRoleCode) {
        roleUser.append('<option value="" selected>Chọn vai trò</option>');
    }

    roles.forEach(function (role) {
        var isSelected = sessionRoleCode === role.code ? 'selected' : '';
        roleUser.append('<option value="' + role.id + '" ' + isSelected + '>' + role.name + '</option>');
    });

    /*// Thêm sự kiện change cho thẻ select
    roleUser.on('change', function () {
        var selectedRoleId = $(this).val();
        sessionStorage.setItem('roleId', selectedRoleId);
    });*/
}
/*function renderRoleSelect(roles) {
    var roleUser = $('#roleUser');
    roleUser.empty();
    if(!roles) {
        roleUser.append('<option value="" selected>Chọn vai trò</option>');
    }

    roles.forEach(function (role) {
        var isSelected = roles === role.id ? 'selected' : '';
        roleUser.append('<option value="' + role.id + '" ' + isSelected + '>' + role.name + '</option>');
    })
}*/

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
        sessionStorage.setItem('roleCode', roleCode);
        fetchUsers(roleCode);
        $('#role-name').find('.active-categoryName').removeClass('active-categoryName');
        $(this).addClass('active-categoryName');
    });

    var sessionRoleCode = sessionStorage.getItem('roleCode');
    console.log('sessionRoleCode:', sessionRoleCode);
    if (!sessionRoleCode) {
        sessionRoleCode = 'USER';
        sessionStorage.setItem('roleCode', sessionRoleCode);
    }

    // Thêm class active-categoryName vào danh mục có roleCode trùng với sessionRoleCode
    $('.nav-link').each(function () {
        var roleCode = $(this).data('role-code');
        if (roleCode === sessionRoleCode) {
            $(this).addClass('active-categoryName');
        }
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
            <td id="userName">${user.userName}</td>
            <td class="text-center">${user.email}</td>
            <td class="text-center">${user.role.name}</td>
            <td class="text-center">${new Date(user.createdDate).toLocaleDateString()}</td>
            
            <td class="align-middle">
                <a id="viewUserDetail" href="#" data-user-id="${user.id}" class="text-secondary font-weight-bold text-xs" 
                data-toggle="tooltip" data-original-title="View user">
                    Chi tiết
                </a>
            </td>
            <td class="align-middle">
                <input type="checkbox" id="checkboxUsers" class="delete-checkbox" data-user-id="${user.id}" value="${user.id}">
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