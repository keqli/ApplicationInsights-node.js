import RequestResponseHeaders = require("../Library/RequestResponseHeaders");
import CorrelationIdManager = require("../Library/CorrelationIdManager");
import Util = require("../Library/Util");

class OperationHeaderParser {
    public sourceCorrelationId: string = "";
    public correlationContextHeader: string = "";
    public parentId: string = "";
    public requestId: string = "";
    public operationId: string = "";

    constructor(headers: {[id: string]: string}) {
        let headerKeys = Object.keys(headers);
        for(var i=0; i<headerKeys.length; i++) {
            headers[headerKeys[i].toLowerCase()] = headers[headerKeys[i]];
        }

        this.sourceCorrelationId = Util.getHeaderValueForKey(headers[RequestResponseHeaders.requestContextHeader], RequestResponseHeaders.requestContextSourceKey);
        this.parentId = headers[RequestResponseHeaders.requestIdHeader];
        this.requestId = CorrelationIdManager.generateRequestId(this.parentId);
        this.correlationContextHeader = headers[RequestResponseHeaders.correlationContextHeader];
        this.operationId = CorrelationIdManager.getRootId(this.requestId);
    }
}

export = OperationHeaderParser;