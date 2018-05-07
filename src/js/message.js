let messagePage= {
    header: document.getElementById('header'),
    messageText: document.getElementById('messageText'),
    setHeader: function (text) {
        this.header.innerText = 'Уважаемый, ' + text + '!';
    },
    setText: function (email, site) {

        this.messageText.innerHTML =
            "Вам на почту  <a href='https://"+ site +"' target='_blank' class='message__mail'>" + email + "</a> отправлено письмо<br>с кодом подтверждения";
    }
};

function getSiteOfMail(email) {
    return email.replace(/.*@/, "");

}

document.addEventListener('DOMContentLoaded', function() {
    if (localStorage.getItem('fullname') !='') {
        messagePage.setHeader(localStorage.getItem('fullname'));
    }
    if (localStorage.getItem('email') !='') {
        messagePage.setText(localStorage.getItem('email'), getSiteOfMail(localStorage.getItem('email')));
    }


}, false);

