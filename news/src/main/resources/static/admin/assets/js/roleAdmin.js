$(document).ready(function () {

})

function loadRoleTable() {
    $('#content-container').load('/news_lv/page/roleTable', function () {
        fetchRole()
        backRoleTable()
    });
}

$(document).on('click', '#showRole', function (e) {
    e.preventDefault()
    var titlePage = $('.titlePage')
    titlePage.html('Quản lý vai trò');
    var titlePageHeading = $('.titlePage-heading')
    titlePageHeading.html('Vai trò người dùng');
    sessionStorage.removeItem('manage-comment')
    $('#content-container').load('/news_lv/page/roleTable', function () {
        fetchRole()
    });
    $('.nav-link').removeClass('active-categoryName');
    $(this).addClass('active-categoryName');
})

$(document).on('click', '#editRole', function (e) {
    e.preventDefault()
    var roleId = $(this).data('role-id');
    sessionStorage.setItem('roleId', roleId)
    $('#content-container').load('/news_lv/page/editRole', function () {
        getRoleById(roleId);
        $('#saveRole').hide();
    });
})

$(document).on('click', '#deleteRole', function () {
    var roleIds = [];
    var roleNames = [];
    $('#checkboxRole:checked').each(function () {
        roleIds.push($(this).val());
        roleNames.push($(this).closest('tr').find('#title-roleTable').text());
    });

    if (roleIds.length > 0) {
        var confirmationMessage = 'Bạn có chắc muốn xóa vai trò:<br>' + roleNames.join(',<br>') + '?';
        $('#confirmationMessage').html(confirmationMessage);
        /*var confirmationMessage = 'Bạn có chắc muốn xóa các bài viết:\n' + selectedTitles.join(',\n') + '?';
        $('#confirmationMessage').text(confirmationMessage);*/
        $('#deleteConfirmationModal').show();

        $('#confirmDelete').off('click').on('click', function () {
            $.ajax({
                url: '/news_lv/role/update-status',
                method: 'PUT',
                contentType: 'application/json',
                data: JSON.stringify(roleIds),
                success: function(response) {
                    if (response.code === 1000) {
                        loadCategorySuccess()
                        createToast('success', 'fas fa-check', 'Thành công', 'Xóa vai trò thành công');
                        // location.reload();
                    } else {
                        alert('Có lỗi xảy ra: ' + response.message);
                    }
                },
                error: function(error) {
                    console.error('Error deleting news:', error);
                    alert('Có lỗi xảy ra khi xóa vai trò');
                }
            });
            $('#deleteConfirmationModal').hide();
        });

        $('#cancelDelete, .close').off('click').on('click', function () {
            $('#deleteConfirmationModal').hide();
        });
    } else {
        alert('Vui lòng chọn ít nhất một vai trò để xóa');
    }
});

function fetchCategoriesRole(categories, roleCode) {
    $.ajax({
        url: '/news_lv/category',
        method: 'GET',
        success: function(data) {
            if (data.code === 1000 && Array.isArray(data.result)) {
                renderCategoriesRole(data.result, categories, roleCode);
            } else {
                console.error('Unexpected response format:', data);
            }
        },
        error: function(error) {
            console.error('Error fetching categories:', error);
        }
    });
}

function renderCategoriesRole(category, categories, roleCode) {
    var categorySelect = $('#categories');
    categorySelect.empty();
    categorySelect.append('<option value="" selected>Chọn thể loại</option>');

    // Thêm hai thẻ option cho "Quản trị viên" và "Người dùng"
    categorySelect.append('<option value="ADMIN" ' + (categories === null && roleCode === 'ADMIN' ? 'selected' : '') + '>Quản trị viên</option>');
    categorySelect.append('<option value="USER" ' + (categories === null && roleCode === 'USER' ? 'selected' : '') + '>Người dùng</option>');

    category.forEach(function (category) {
        var isSelected = categories === category.code ? 'selected' : '';
        categorySelect.append('<option value="' + category.code + '" ' + isSelected + '>' + category.name + '</option>');
    })
}

function backRoleTable() {
    var roleId = sessionStorage.getItem('roleId');
    setTimeout(function() {
        $('tr').each(function() {
            var editLink = $(this).find('a#editRole');
            var roleInRow = editLink.data('role-id');
            if (roleInRow == roleId) {
                $(this).find('#title-roleTable').addClass('active-categoryName');
            }
        });
    }, 300);
}

$(document).on('click', '#back-roleTable', function (e) {
    e.preventDefault()
    loadRoleTable()
})

const roleCodeMapping = {
    'ADMIN': 'Quản trị viên',
    'USER': 'Người dùng',
    'ADMIN_MANAGE': 'Quản lý thể loại',
    'AUTHOR': 'Tác giả'
}

function fetchAllRoles() {
    $.ajax({
        url: '/news_lv/role',
        type: 'GET',
        success: function (response) {
            if (response.code === 1000) {
                var roles = response.result;
                var roleCodeSelect = $('#roleCode');
                var addedRoles = new Set();
                roleCodeSelect.empty();
                roleCodeSelect.append('<option value="">Chọn vai trò</option>');
                roles.forEach(function (role) {
                    if (!addedRoles.has(role.code)) {
                        roleCodeSelect.append('<option value="' + role.code + '">' + roleCodeMapping[role.code] + '</option>');
                        addedRoles.add(role.code);
                    }
                });
            } else {
                console.error('Failed to fetch roles:', response);
            }
        },
        error: function (error) {
            console.error('Error fetching roles:', error);
        }
    });
}

function getRoleById(roleId) {
    $.ajax({
        url: '/news_lv/role/' + roleId,
        type: 'GET',
        success: function (response) {
            if (response.code === 1000) {
                var role = response.result;
                console.log(role);
                // Điền dữ liệu vào các trường trong form
                $('#roleName').val(role.name);
                Object.keys(roleCodeMapping).forEach(function (code) {
                    var isSelected = role.code === code ? 'selected' : '';
                    $('#roleCode').append('<option value="' + code + '" ' + isSelected + '>' + roleCodeMapping[code] + '</option>');
                })
                $('#description').val(role.description);
                $('#roleCreatedDate').val(new Date(role.createdDate).toLocaleDateString());


                fetchCategoriesRole(role.categories, role.code)
            } else {
                console.error('Failed to fetch role:', response);
            }
        },
        error: function (error) {
            console.error('Error fetching role:', error);
        }
    });

}

function fetchRole() {
    $.ajax({
        url: '/news_lv/role',
        type: 'GET',
        success: function (response) {
            renderRole(response.result);
        },
        error: function (error) {
            console.error('Error fetching roles:', error);
        }
    });
}

function renderRole(role) {
    var tableBody = $('table tbody');
    tableBody.empty(); // Clear existing table rows

    // Loop through the categories and create table rows
    role.forEach(function (role) {
        var row = createRoleTable(role);
        tableBody.append(row);
    });
}

function createRoleTable(role) {
    return `
            <tr>
                <td>
                    <div class="d-flex flex-column justify-content-center">
                        <h6 id="title-roleTable" class="mb-0 text-sm">${role.name}</h6>
                    </div>
                </td>
                <td>
                    <p class="text-xs font-weight-bold mb-0">${role.createdBy}</p>

                </td>
                <td class="text-center">
                    <span class="text-secondary text-xs font-weight-bold">${new Date(role.createdDate).toLocaleDateString()}</span>
                </td>
                <td class="align-middle">
                    <a id="editRole" data-role-id="${role.id}" href="#" class="text-secondary font-weight-bold text-xs" 
                    data-toggle="tooltip" data-original-title="Edit role">
                        Chỉnh sửa
                    </a>
                </td>
                <td class="align-middle">
                    <input type="checkbox" id="checkboxRole" class="delete-checkbox" data-role-id="${role.id}" value="${role.id}">
                </td>
            </tr>
        `;
}

$(document).on('click', '#createRole', function (e) {
    e.preventDefault()
    sessionStorage.removeItem('Role')
    $('#content-container').load('/news_lv/page/editRole', function () {
        $('#content-container').find('input').each(function() {
            fetchAllRoles()
            fetchCategoriesRole()
            $(this).val('');
            $('#updateRole').hide();
        });
    });
})

$(document).on('click', '#saveRole', function (e) {
    e.preventDefault()
    createRole()
})

function createRole() {
    var roleData = {
        name: $('#roleName').val(),
        code: $('#roleCode').val(),
        categories: $('#categories').val(),
        description: $('#description').val()
    };

    $.ajax({
        url: '/news_lv/role',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(roleData),
        success: function (response) {
            if (response.code === 1000) {
                // alert('Vai trò đã được tạo thành công!');
                createToast('success', 'fas fa-check', 'Thành công', 'Tạo vai trò thành công');
                loadRoleTable()
                // Chuyển hướng hoặc cập nhật giao diện người dùng nếu cần
            } else {
                console.error('Failed to create role:', response);
                alert('Đã xảy ra lỗi khi tạo vai trò.');
            }
        },
        error: function (error) {
            console.error('Error creating role:', error);
            alert('Đã xảy ra lỗi khi tạo vai trò.');
        }
    });
}
/*
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
}*/
