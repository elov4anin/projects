/*let enter = {
    login: document.getElementById("login"),
    pass: document.getElementById("pass"),
    remember: document.getElementById("remember"),
    loginPattern: "",
    btn: document.getElementById("submitLogin"),
    validateLogin: function (login) {
        if ( true) {
            return true

        } else {
            return false
        }
    },
    validateForm: function () {
        console.log("test");
        if (this.validateLogin() && this.pass != "" ) {
            this.btn.setAttribute("disbaled", "false");

        } else {
            this.btn.setAttribute("disbaled", "true");
        }

    }

};*/

class Enter {
    constructor(name) {
        this.name = name;
    }

    show() {
        console.log(this.name)
    }
}
export default Enter;