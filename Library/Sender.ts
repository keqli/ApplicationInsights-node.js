import Logging = require("./Logging");
import Config = require("./Config")

class Sender {
    private static TAG = "Sender";

    private _config: Config;
    private _storageDirectory: string;
    private _onSuccess: (response: string) => void;
    private _onError: (error: Error) => void;

    constructor(config: Config, onSuccess?: (response: string) => void, onError?: (error: Error) => void) {
        this._config = config;
        this._onSuccess = onSuccess;
        this._onError = onError;
    }

    public send(buffer: string[], callback?: (v: string) => void) {
        const endpointUrl = this._config.endpointUrl;
        const payload = buffer.join("\n");
        this._config.sendRequest({
            url: endpointUrl,
            data: payload,
            method: "POST",
            dataType: "application/x-json-stream",
            success: (res: any) => {
                const responseString = res.data;
                Logging.info(Sender.TAG, responseString);
                if (typeof this._onSuccess === "function") {
                    this._onSuccess(responseString);
                }

                if (typeof callback === "function") {
                    callback(responseString);
                }
            },
            fail: (error: any) => {
                Logging.warn(Sender.TAG, error);
                this._onErrorHelper(error);

                if (typeof callback === "function") {
                    var errorMessage = "error sending telemetry";
                    if (error && (typeof error.toString === "function")) {
                        errorMessage = error.toString();
                    }

                    callback(errorMessage);
                }
            }
        });
    }

    private _onErrorHelper(error: Error): void {
        if (typeof this._onError === "function") {
            this._onError(error);
        }
    }
}

export = Sender;
