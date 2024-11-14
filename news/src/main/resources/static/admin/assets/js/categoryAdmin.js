$(document).ready(function () {

})

function showBtnCategory() {
    var categoryId = sessionStorage.getItem('categoryId');
    var saveCategoryBtn = $('#saveCategory');
    var updateCategoryBtn = $('#updateCategory');
    if (categoryId) {
        saveCategoryBtn.hide()
    } else {
        updateCategoryBtn.hide()
    }
}

$(document).on('click', '#showCategory', function (e) {
    e.preventDefault();
    var titlePage = $('.titlePage')
    titlePage.html('Quản lý thể loại');
    var titlePageHeading = $('.titlePage-heading')
    titlePageHeading.html('Danh sách tin tức');
    sessionStorage.removeItem('manage-comment')
    $('#content-container').load('/news_lv/page/categoryTable', function () {
        fetchCategoryTable();
    });
    $('.nav-link').removeClass('active-categoryName');
    $(this).addClass('active-categoryName');
})

$(document).on('click', '#editCategory', function (e) {
    e.preventDefault();
    var categoryId = $(this).data('category-id');
    sessionStorage.setItem('categoryId', categoryId);
    console.log('Category ID: ', categoryId);
    $('#content-container').load('/news_lv/page/editCategory', function () {
        getCategoryItem(categoryId);
        showBtnCategory()
    });
})

$(document).on('click', '#createCategory', function (e) {
    e.preventDefault()
    sessionStorage.removeItem('categoryId');
    $('#content-container').load('/news_lv/page/editCategory', function () {
        $('#content-container').find('input').each(function() {
            $(this).val('');
            fetchCategories();
            showBtnCategory()
        });
    });
})

function loadCategorySuccess() {
    $('#content-container').load('/news_lv/page/categoryTable', function () {
        fetchCategoryTable();
        backCategoryTable()
    });
}

function backCategoryTable() {
    var categoryId = sessionStorage.getItem('categoryId');
    setTimeout(function () {
        $('tr').each(function () {
            var editLink = $(this).find('a#editCategory');
            var categoryInRow = editLink.data('category-id');
            if (categoryInRow == categoryId) {
                $(this).find('#title-categoryTable').addClass('active-categoryName');
            }
        });
    }, 300);
}

$(document).on('click', '#back-categoryTable', function (e) {
    e.preventDefault()
    loadCategorySuccess()
})

// Function to fetch categories and populate the table
function fetchCategoryTable() {
    $.ajax({
        url: '/news_lv/category/all', // URL of your API endpoint
        method: 'GET',
        success: function (response) {
            if (response.code === 1000) {
                renderCategoryTable(response.result);
            } else {
                console.error('Failed to fetch categories:', response);
            }
        },
        error: function (error) {
            console.error('Error fetching categories:', error);
        }
    });
}

// Function to render categories in the table
function renderCategoryTable(categories) {
    var tableBody = $('table tbody');
    tableBody.empty(); // Clear existing table rows

    // Loop through the categories and create table rows
    categories.forEach(function (category) {
        var row = createCategoryTableRow(category);
        tableBody.append(row);
    });
}

function getCategoryItem(categoryId) {
    $.ajax({
        url: '/news_lv/category/' + categoryId,
        type: 'GET',
        success: function (response) {
            if (response.code === 1000) {
                var category = response.result;
                // Điền dữ liệu vào các trường trong form
                $('#categoryName').val(category.name);
                $('#categoryCode').val(category.code);
                if (category.parentCategory) {
                    $('#category-select').append('<option value="' + category.parentCategory.id + '" selected>' + category.parentCategory.name + '</option>');
                }
                $('#description').val(category.description);
                fetchCategories(category.parentCategory ? category.parentCategory.id : null);
            } else {
                console.error('Failed to fetch category:', response);
            }
        },
        error: function (error) {
            console.error('Error fetching category:', error);
        }
    });
}

function fetchCategories(selectedParentId) {
    $.ajax({
        url: '/news_lv/category/all', // URL của API để lấy danh sách các danh mục
        type: 'GET',
        success: function (response) {
            if (response.code === 1000) {
                var categories = response.result;
                var categorySelect = $('#category-select');
                categorySelect.empty(); // Xóa các tùy chọn hiện tại

                // Thêm tùy chọn "Thể loại cha" nếu selectedParentId là null
                if (!selectedParentId) {
                    categorySelect.append('<option value="" selected>Thể loại cha</option>');
                }

                // Thêm các danh mục vào thẻ select
                categories.forEach(function (category) {
                    var isSelected = selectedParentId === category.id ? 'selected' : '';
                    categorySelect.append('<option value="' + category.id + '" ' + isSelected + '>' + category.name + '</option>');
                });
            } else {
                console.error('Failed to fetch categories:', response);
            }
        },
        error: function (error) {
            console.error('Error fetching categories:', error);
        }
    });
}

function createCategoryTableRow(category) {
    return `
            <tr>
                <td>
                    <div class="d-flex flex-column justify-content-center">
                        <h6 id="title-categoryTable" class="mb-0 text-sm">${category.name}</h6>
                    </div>
                </td>
                <td>
                    <p class="text-xs font-weight-bold mb-0">${category.createdBy}</p>

                </td>
                <td class="text-center">
                    <span class="text-secondary text-xs font-weight-bold">${new Date(category.createdDate).toLocaleDateString()}</span>
                </td>
                <td class="align-middle">
                    <a id="editCategory" data-category-id="${category.id}" href="#" class="text-secondary font-weight-bold text-xs" data-toggle="tooltip" data-original-title="Edit category">
                        Chỉnh sửa
                    </a>
                </td>
                <td class="align-middle">
                    <input type="checkbox" id="checkboxCategory" class="delete-checkbox" data-category-id="${category.id}" value="${category.id}">
                </td>
            </tr>
        `;
}

$(document).on('click', '#saveCategory', function (e) {
    e.preventDefault()
    createCategory()
})

$(document).on('click', '#deleteCategory', function () {
    var categoryIds = [];
    var categoryNames = [];
    $('#checkboxCategory:checked').each(function () {
        categoryIds.push($(this).val());
        categoryNames.push($(this).closest('tr').find('#title-categoryTable').text());
    });

    if (categoryIds.length > 0) {
        var confirmationMessage = 'Bạn có chắc muốn xóa các thể loại:<br>' + categoryNames.join(',<br>') + '?';
        $('#confirmationMessage').html(confirmationMessage);
        /*var confirmationMessage = 'Bạn có chắc muốn xóa các bài viết:\n' + selectedTitles.join(',\n') + '?';
        $('#confirmationMessage').text(confirmationMessage);*/
        $('#deleteConfirmationModal').show();

        $('#confirmDelete').off('click').on('click', function () {
            $.ajax({
                url: '/news_lv/category/delete',
                method: 'PUT',
                contentType: 'application/json',
                data: JSON.stringify(categoryIds),
                success: function(response) {
                    if (response.code === 1000) {
                        loadCategorySuccess()
                        createToast('success', 'fas fa-check', 'Thành công', 'Xóa thể loại thành công');
                        // location.reload();
                    } else {
                        alert('Có lỗi xảy ra: ' + response.message);
                    }
                },
                error: function(error) {
                    console.error('Error deleting news:', error);
                    alert('Có lỗi xảy ra khi xóa bài viết');
                }
            });
            $('#deleteConfirmationModal').hide();
        });

        $('#cancelDelete, .close').off('click').on('click', function () {
            $('#deleteConfirmationModal').hide();
        });
    } else {
        alert('Vui lòng chọn ít nhất một thể loại để xóa');
    }
});

// Hàm chuyển đổi tên thành mã thể loại
function generateCategoryCode(name) {
    return name.toLowerCase()
        .normalize('NFD') // Chuyển đổi ký tự có dấu thành ký tự không dấu
        .replace(/[\u0300-\u036f]/g, '') // Loại bỏ các dấu
        .replace(/\s+/g, '-') // Thay thế khoảng trắng bằng dấu gạch ngang
        .replace(/[^a-z0-9-]/g, ''); // Loại bỏ các ký tự không hợp lệ
}

function createCategory() {
    var categoryName = $('#categoryName').val();
    var categoryCode = generateCategoryCode(categoryName);
    var categoryData = {
        name: categoryName,
        code: categoryCode,
        parentCategory: $('#category-select').val(),
        description: $('#description').val()
    };

    $.ajax({
        url: '/news_lv/category',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(categoryData),
        success: function (response) {
            if (response.code === 1000) {
                loadCategorySuccess();
                // alert('Tạo thể loại thành công!');
                createToast('success', 'fas fa-check', 'Thành công', 'Tạo thể loại thành công');
                // Thực hiện các hành động khác sau khi tạo thành công
            } else {
                console.error('Failed to create category:', response);
            }
        },
        error: function (error) {
            console.error('Error creating category:', error);
        }
    });
}

$(document).on('click', '#updateCategory', function (e) {
    e.preventDefault()
    var categoryId = sessionStorage.getItem('categoryId');
    updateCategory(categoryId);
})

function updateCategory(categoryId) {
    var categoryName = $('#categoryName').val();
    var categoryCode = generateCategoryCode(categoryName);

    var categoryData = {
        name: categoryName,
        code: categoryCode,
        parentCategory: $('#category-select').val(),
        description: $('#description').val()
    };

    $.ajax({
        url: '/news_lv/category/' + categoryId,
        type: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify(categoryData),
        success: function (response) {
            if (response.code === 1000) {
                loadCategorySuccess()
                // alert('Cập nhật thể loại thành công!');
                createToast('success', 'fas fa-check', 'Thành công', 'Cập nhật thể loại thành công');
                // Thực hiện các hành động khác sau khi cập nhật thành công
            } else {
                console.error('Failed to update category:', response);
            }
        },
        error: function (error) {
            console.error('Error updating category:', error);
        }
    });
}