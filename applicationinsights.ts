import Logging = require("./Library/Logging");

// We export these imports so that SDK users may use these classes directly.
// They're exposed using "export import" so that types are passed along as expected
export import TelemetryClient = require("./Library/TelemetryClient");
export import Contracts = require("./Declarations/Contracts/index");

let _isStarted = false;

/**
* The default client, initialized when setup was called. To initialize a different client
* with its own configuration, use `new TelemetryClient(instrumentationKey?)`.
*/
export let defaultClient: TelemetryClient;

/**
 * Initializes the default client. Should be called after setting
 * configuration options.
 * 
 * @param instrumentationKey the instrumentation key to use. Optional, if
 * this is not specified, the value will be read from the environment
 * variable APPINSIGHTS_INSTRUMENTATIONKEY.
 * @returns {Configuration} the configuration class to initialize
 * and start the SDK.
 */
export function setup(instrumentationKey?: string) {
    if(!defaultClient) {
        defaultClient = new TelemetryClient(instrumentationKey);
    } else {
        Logging.info("The default client is already setup");
    }

    return Configuration;
}

/**
 * Starts automatic collection of telemetry. Prior to calling start no
 * telemetry will be *automatically* collected, though manual collection 
 * is enabled.
 * @returns {ApplicationInsights} this class
 */
export function start() {
    if(!!defaultClient) {
        _isStarted = true;
    } else {
        Logging.warn("Start cannot be called before setup");
    }

    return Configuration;
}

/**
 * The active configuration for global SDK behaviors, such as autocollection.
 */
export class Configuration {
    // Convenience shortcut to ApplicationInsights.start
    public static start = start;

    /**
     * Enables debug and warning logging for AppInsights itself.
     * @param enableDebugLogging if true, enables debug logging
     * @param enableWarningLogging if true, enables warning logging
     * @returns {Configuration} this class
     */
    public static setInternalLogging(enableDebugLogging = false, enableWarningLogging = true) {
        Logging.enableDebug = enableDebugLogging;
        Logging.disableWarnings = !enableWarningLogging;
        return Configuration;
    }
}

/**
 * Disposes the default client and all the auto collectors so they can be reinitialized with different configuration
*/
export function dispose() {
    defaultClient = null;
    _isStarted = false;
}
