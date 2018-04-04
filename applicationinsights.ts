import Config = require("./Library/Config");
import Context = require("./Library/Context");
import Logging = require("./Library/Logging");
import Util = require("./Library/Util");

// We export these imports so that SDK users may use these classes directly.
// They're exposed using "export import" so that types are passed along as expected
export import TelemetryClient = require("./Library/TelemetryClient");
export import Contracts = require("./Declarations/Contracts/index");

// Default autocollection configuration
let _isConsole = true;
let _isConsoleLog = false;
let _isExceptions = true;
let _isPerformance = true;
let _isRequests = true;
let _isDependencies = true;
let _isDiskRetry = true;
let _isCorrelating = true;

let _diskRetryInterval: number = undefined;
let _diskRetryMaxBytes: number = undefined;

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

    if (defaultClient && defaultClient.channel) {
        defaultClient.channel.setUseDiskRetryCaching(_isDiskRetry, _diskRetryInterval, _diskRetryMaxBytes);
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
     * Sets the state of console and logger tracking (enabled by default for third-party loggers only)
     * @param value if true logger activity will be sent to Application Insights
     * @param collectConsoleLog if true, logger autocollection will include console.log calls (default false)
     * @returns {Configuration} this class
     */
    public static setAutoCollectConsole(value: boolean, collectConsoleLog: boolean = false) {
        _isConsole = value;
        _isConsoleLog = collectConsoleLog;
        if (_isStarted){
        }

        return Configuration;
    }

    /**
     * Sets the state of exception tracking (enabled by default)
     * @param value if true uncaught exceptions will be sent to Application Insights
     * @returns {Configuration} this class
     */
    public static setAutoCollectExceptions(value: boolean) {
        _isExceptions = value;

        return Configuration;
    }

    /**
     * Sets the state of performance tracking (enabled by default)
     * @param value if true performance counters will be collected every second and sent to Application Insights
     * @returns {Configuration} this class
     */
    public static setAutoCollectPerformance(value: boolean) {
        _isPerformance = value;

        return Configuration;
    }

    /**
     * Sets the state of request tracking (enabled by default)
     * @param value if true requests will be sent to Application Insights
     * @returns {Configuration} this class
     */
    public static setAutoCollectRequests(value: boolean) {
        _isRequests = value;

        return Configuration;
    }

    /**
     * Sets the state of dependency tracking (enabled by default)
     * @param value if true dependencies will be sent to Application Insights
     * @returns {Configuration} this class
     */
    public static setAutoCollectDependencies(value: boolean) {
        _isDependencies = value;

        return Configuration;
    }

    /**
     * Sets the state of automatic dependency correlation (enabled by default)
     * @param value if true dependencies will be correlated with requests
     * @returns {Configuration} this class
     */
    public static setAutoDependencyCorrelation(value: boolean) {
        _isCorrelating = value;

        return Configuration;
    }

    /**
     * Enable or disable disk-backed retry caching to cache events when client is offline (enabled by default)
     * Note that this method only applies to the default client. Disk-backed retry caching is disabled by default for additional clients.
     * For enable for additional clients, use client.channel.setUseDiskRetryCaching(true).
     * These cached events are stored in your system or user's temporary directory and access restricted to your user when possible.
     * @param value if true events that occured while client is offline will be cached on disk
     * @param resendInterval The wait interval for resending cached events.
     * @param maxBytesOnDisk The maximum size (in bytes) that the created temporary directory for cache events can grow to, before caching is disabled.
     * @returns {Configuration} this class
     */
    public static setUseDiskRetryCaching(value: boolean, resendInterval?: number, maxBytesOnDisk?: number) {
        _isDiskRetry = value;
        _diskRetryInterval = resendInterval;
        _diskRetryMaxBytes = maxBytesOnDisk
        if (defaultClient && defaultClient.channel){
            defaultClient.channel.setUseDiskRetryCaching(value, resendInterval, maxBytesOnDisk);
        }

        return Configuration;
    }

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
