import Contracts = require("../Declarations/Contracts/index");
import Logging = require("./Logging");

class Context {

    public keys: Contracts.ContextTagKeys;
    public tags: { [key: string]: string};
    public static DefaultRoleName:string = "Web";
    public static appVersion: {[path: string]: string} = {};
    public static sdkVersion: string = null;

    constructor(packageJsonPath?: string) {
        this.keys = new Contracts.ContextTagKeys();
        this.tags = <{ [key: string]: string}>{};

        this._loadApplicationContext();
        this._loadDeviceContext();
        this._loadInternalContext();
    }

    private _loadApplicationContext(packageJsonPath?: string) {
    }

    private _loadDeviceContext() {
    }

    private _loadInternalContext() {
    }
}

export = Context;
