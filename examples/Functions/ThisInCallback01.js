var Handler = /** @class */ (function () {
    function Handler() {
    }
    Handler.prototype.onClickBad = function (e) {
        // oops, used this here. using this callback would crash at runtime
        // this.info = e.message;
    };
    return Handler;
}());
var h = new Handler();
// uiElement.addClickListener(h.onClickBad); // error!
