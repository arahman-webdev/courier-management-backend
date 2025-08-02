"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParcelStatus = void 0;
var ParcelStatus;
(function (ParcelStatus) {
    ParcelStatus["REQUESTED"] = "Requested";
    ParcelStatus["APPROVED"] = "Approved";
    ParcelStatus["DISPATCHED"] = "Dispatched";
    ParcelStatus["IN_TRANSIT"] = "In Transit";
    ParcelStatus["DELIVERED"] = "Delivered";
    ParcelStatus["CANCELLED"] = "Cancelled";
    ParcelStatus["BLOCKED"] = "Blocked";
    ParcelStatus["RETURNED"] = "Returned";
    ParcelStatus["RESCHEDULED"] = "Rescheduled";
})(ParcelStatus || (exports.ParcelStatus = ParcelStatus = {}));
