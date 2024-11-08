/*
let notifications = document.querySelector('.notifications');

function createToast(type, icon, title, text){
    console.log('Creating toast');
    let newToast = document.createElement('div');
    newToast.innerHTML = `
            <div class="toast ${type}">
                <i class="${icon}"></i>
                <div class="content">
                    <div class="title">${title}</div>
                    <span>${text}</span>
                </div>
                <i class="fa-solid fa-xmark" onclick="(this.parentElement).remove()"></i>
            </div>`;
    notifications.appendChild(newToast);
    newToast.timeOut = setTimeout(
        ()=>newToast.remove(), 5000
    )
}*/

/*let notifications = $('#notification-container');

function createToast(type, icon, title, text){
    console.log('Creating toast');
    if (notifications.length === 0) {
        console.error('Element .notifications not found');
        return;
    }
    let newToast = $(`
        <div class="toast ${type}">
            <i class="${icon}"></i>
            <div class="content">
                <div class="title">${title}</div>
                <span>${text}</span>
            </div>
            <i class="fa-solid fa-xmark" onclick="$(this).parent().remove()"></i>
        </div>
    `);
    notifications.append(newToast);
    setTimeout(() => newToast.remove(), 5000);
}
$(document).on('click', '#success', function() {
    console.log('Click success')
    let type = 'success';
    let icon = 'fa-solid fa-circle-check';
    let title = 'Success';
    let text = 'This is a success toast.';
    createToast(type, icon, title, text);
});*/

/*$(document).ready(function() {
    let notifications = $('#notification-container');

    function createToast(type, icon, title, text){
        console.log('Creating toast');
        if (notifications.length === 0) {
            console.error('Element .notifications not found');
            return;
        }
        let newToast = $(`
            <div class="toast ${type}">
                <i class="${icon}"></i>
                <div class="content">
                    <div class="title">${title}</div>
                    <span>${text}</span>
                </div>
                <i class="fa-solid fa-xmark" onclick="$(this).parent().remove()"></i>
            </div>
        `);
        notifications.append(newToast);
        setTimeout(() => newToast.remove(), 5000);
    }

    $(document).on('click', '#success', function() {
        console.log('Click success');
        let newNotification = $('<h5>Thông báo thành công</h5>');
        notifications.append(newNotification);
    });
    /!*$(document).on('click', '#success', function() {
        console.log('Click success');
        let type = 'success';
        let icon = 'fa-solid fa-circle-check';
        let title = 'Success';
        let text = 'This is a success toast.';
        createToast(type, icon, title, text);
    });*!/
});*/

/*
function createToast(type, iconClass, title, message) {
    var toastContainer = document.getElementById('notification-container');
    var toast = document.createElement('div');
    toast.className = `toast ${type} show`; // Add the 'show' class here

    toast.innerHTML = `
        <i class="${iconClass}"></i>
        <div class="content">
            <div class="title">${title}</div>
            <span>${message}</span>
        </div>
        <i class="fa-solid fa-xmark" onclick="(this.parentElement).remove()"></i>
    `;

    toastContainer.appendChild(toast);

    // Remove the toast after a certain time
    setTimeout(function() {
        toast.classList.remove('show');
        toast.addEventListener('transitionend', function() {
            toast.remove();
        });
    }, 5000); // Adjust the timeout duration as needed
}

$(document).on('click', '#success', function() {
    console.log('Click success');
    let type = 'success';
    let icon = 'fa-solid fa-circle-check';
    let title = 'Success';
    let text = 'This is a success toast.';
    createToast(type, icon, title, text);
});*/

function createToast(type, iconClass, title, message) {
    var toastContainer = $('#notification-container');
    var newToast = $(`
        <div class="toast ${type} show">
            <i class="${iconClass}"></i>
            <div class="content">
                <div class="title">${title}</div>
                <span>${message}</span>
            </div>
            <i class="fas fa-xmark" onclick="$(this).parent().remove()"></i>
        </div>
    `);

    toastContainer.append(newToast);

    // Remove the toast after a certain time
    setTimeout(function() {
        newToast.removeClass('show');
        newToast.on('transitionend', function() {
            newToast.remove();
        });
    }, 5000); // Adjust the timeout duration as needed
}

$(document).on('click', '#btn-success', function() {
    console.log('Click success');
    let type = 'success';
    let icon = 'fa-solid fa-circle-check';
    let title = 'Success';
    let text = 'This is a success toast.';
    createToast(type, icon, title, text);
});
