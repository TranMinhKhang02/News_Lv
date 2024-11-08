$(document).ready(function() {

})

$(document).on('click', '#updateProfileAdmin', function() {
    var data = {
        passwordPrevious: $('#passwordPrevious').val(),
        password: $('#password').val(),
        fullName: $('#fullNameInput').val(),
        email: $('#emailInput').val(),
        phoneNumber: $('#phoneNumberInput').val(),
        dob: $('#dob').val()
    }
    if(!data.password) {
        delete data.password;
        delete data.passwordPrevious;
    }

    updateProfile(data);
})

function updateProfile(data) {
    var userId = sessionStorage.getItem('userId');
    $.ajax({
        url: "/news_lv/users/" + userId,
        type: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function (response) {
            createToast('success', 'fas fa-check', 'Thành công', 'Cập nhật thông tin thành công');
        },
        error: function (error) {
            console.error('Error updating user:', error);
            alert('Có lỗi xảy ra khi cập nhật thông tin.');
        }
    })
}