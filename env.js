//
// Environment
//
var Env = (function () {
    function Env(outer) {
        if (outer === void 0) { outer = null; }
        this.dict = {};
        this.outer = outer;
    }
    Env.prototype.lookup = function (id) {
        if (this.dict[id] != undefined)
            return this.dict[id];
        if (this.outer != undefined)
            return this.outer.lookup(id);
        throw new Error(id + " is an unbound identifier!");
    };
    Env.prototype.set = function (id, val) {
        this.dict[id] = val;
    };
    return Env;
})();
exports.Env = Env;
