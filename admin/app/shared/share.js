var root = "/";
var admin = "/admin";
var feedback = "feedback";

var bet ='/bet';
var users = '/user';

var user_list = '/user/list';



function AlertMessage(message, displayLength, className, completeCallback) {
    className = className || "";

    var container = document.getElementById('alert-container');

    if (container === null) {
        var container = document.createElement('div');
        container.id = 'alert-container';
        document.body.appendChild(container);
    }

    if ($('.alert-message').length > 0) {
        $('.alert-container-inner').animate({
            opacity: 0
        }, 1000, "linear", function () {
            $('.alert-message').parent().remove();
        });
    }
    var alert = createAlert(message);
    container.appendChild(alert);
    $('.alert-message').animate({
        opacity: 1
    });


    var timeLeft = displayLength;


    var counterInterval = setInterval(function () {


        if (alert.parentNode === null)
            window.clearInterval(counterInterval);

        timeLeft -= 20;


        if (timeLeft <= 0) {

            //$('.alert-container-inner').hide("slow",function () {
            //    $('.alert-message').parent().remove();
            //    });
            $('.alert-container-inner').animate({
                opacity: 0
            }, 1500, "linear", function () {
                $('.alert-message').parent().remove();
            });

            window.clearInterval(counterInterval);
        }
    }, 20);

    function createAlert(html) {

        var alert = document.createElement('div');
        alert.classList.add('alert-container-inner');


        var alertMsg = document.createElement('span');
        alertMsg.classList.add("alert-message");


        alertMsg.innerHTML = html;

        alert.appendChild(alertMsg);


        return alert;
    }
}

function uniNotification(text,title,ok,no, callback){

    swal({  title: title,
            text: text,
            type: "warning",   showCancelButton: true,
            confirmButtonColor: "#337ab7",
            confirmButtonText: ok,
            cancelButtonText: no,
            closeOnConfirm: false },
        function(){
            callback();
            swal.close();
        }
    );
}

function deleteObjectNotification(name, callback){

    swal({  title: "ჩანაწერის წაშლა !",
            text: "წავშალოთ ჩანაწერი " + name +  " ?",
            type: "warning",   showCancelButton: true,
            confirmButtonColor: "#337ab7",
            confirmButtonText: "წაშლა!",
            cancelButtonText: "გაუქმება",
            closeOnConfirm: false },
        function(){
            callback();
            swal.close();
        }
    );
}

function saveObjectNotification(text, callback){

    swal({  title: "ცვლილებების შენახვა !",
            text: text,
            type: "warning",   showCancelButton: true,
            confirmButtonColor: "#337ab7",
            confirmButtonText: "შენახვა !",
            cancelButtonText: "გაუქმება",
            closeOnConfirm: false },
        function(){
            callback();
            swal.close();
        }
    );
}


function alertNotification(text){

    swal(text);
}


function findFirst(arr, test, context) {
    var Result = function (v, i) {
        this.value = v;
        this.index = i;
    };
    try {
        Array.prototype.filter.call(arr, function (v, i, a) {
            if (test(v, i, a)) throw new Result(v, i);
        }, context);
    } catch (e) {
        if (e instanceof Result) return e;
        throw e;
    }
}