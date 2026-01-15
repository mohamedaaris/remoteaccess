"use strict";
// Shared protocol definitions for FlowLink
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageType = void 0;
var MessageType;
(function (MessageType) {
    // Session Management
    MessageType["REGISTER_DEVICE"] = "register_device";
    MessageType["DEVICE_REGISTERED"] = "device_registered";
    MessageType["DEVICE_LIST"] = "device_list";
    MessageType["REQUEST_SESSION"] = "request_session";
    MessageType["SESSION_REQUEST"] = "session_request";
    MessageType["ACCEPT_SESSION"] = "accept_session";
    MessageType["REJECT_SESSION"] = "reject_session";
    MessageType["SESSION_STARTED"] = "session_started";
    MessageType["END_SESSION"] = "end_session";
    // WebRTC Signaling
    MessageType["OFFER"] = "offer";
    MessageType["ANSWER"] = "answer";
    MessageType["ICE_CANDIDATE"] = "ice_candidate";
    // Control Events
    MessageType["MOUSE_MOVE"] = "mouse_move";
    MessageType["MOUSE_CLICK"] = "mouse_click";
    MessageType["MOUSE_SCROLL"] = "mouse_scroll";
    MessageType["KEY_EVENT"] = "key_event";
    MessageType["TOUCH_EVENT"] = "touch_event";
    // Status
    MessageType["ERROR"] = "error";
    MessageType["PING"] = "ping";
    MessageType["PONG"] = "pong";
})(MessageType || (exports.MessageType = MessageType = {}));
