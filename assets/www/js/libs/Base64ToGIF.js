/**Works on all versions prior and including Cordova 1.6.1 
* by mcaesar
*  MIT license
*  
*/

(function() {
    /* This increases plugin compatibility */
    var cordovaRef = window.PhoneGap || window.Cordova || window.cordova; // old to new fallbacks

    /**
    * The Java to JavaScript Gateway 'magic' class 
    */
    function base64ToGIF() { }

    /**
    * Save the base64 String as a GIF file to the user's Photo Library
    */
    base64ToGIF.prototype.saveImage = function(b64String, params, win, fail) {
        cordovaRef.exec(win, fail, "Base64ToGIF", "saveImage", [b64String, params]);
    };

    cordovaRef.addConstructor(function() {
        if (!window.plugins) {
            window.plugins = {};
        }
        if (!window.plugins.base64ToGIF) {
            window.plugins.base64ToGIF = new base64ToGIF();
        }
    });

})();