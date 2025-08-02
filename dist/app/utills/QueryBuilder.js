"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryBuilder = void 0;
class QueryBuilder {
    constructor(modelQuery, query) {
        this.modelQuery = modelQuery;
        this.query = query;
    }
    filter() {
        const filter = Object.assign({}, this.query);
        const excludedFields = ['searchTerm', 'sort', 'fields', 'page', 'limit'];
        for (const field of excludedFields) {
            // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
            delete filter[field];
        }
        if (filter.deliveryDate) {
            const dayStart = new Date(filter.deliveryDate);
            const dayEnd = new Date(filter.deliveryDate);
            dayEnd.setUTCHours(23, 59, 59, 999);
            filter.deliveryDate = { $gte: dayStart, $lte: dayEnd };
        }
        if (filter.status) {
            filter.status = { $regex: new RegExp(`^${filter.status}$`, "i") };
        }
        this.modelQuery = this.modelQuery.find(filter);
        return this;
    }
    search(searchableFields) {
        const searchTerm = this.query.searchTerm || '';
        if (searchTerm) {
            const searchQuery = {
                $or: searchableFields.map(field => ({
                    [field]: { $regex: searchTerm, $options: 'i' },
                })),
            };
            this.modelQuery = this.modelQuery.find(searchQuery);
        }
        return this;
    }
    sort() {
        const sortBy = this.query.sort || 'createdAt';
        this.modelQuery = this.modelQuery.sort(sortBy);
        return this;
    }
    select() {
        var _a;
        const fields = ((_a = this.query.fields) === null || _a === void 0 ? void 0 : _a.split(',').join(' ')) || '';
        this.modelQuery = this.modelQuery.select(fields);
        return this;
    }
    paginate() {
        const page = Number(this.query.page) || 1;
        const limit = Number(this.query.limit) || 2;
        const skip = (page - 1) * limit;
        this.modelQuery = this.modelQuery.skip(skip).limit(limit);
        return this;
    }
    getMeta() {
        return __awaiter(this, void 0, void 0, function* () {
            const totalDocuments = yield this.modelQuery.model.countDocuments();
            const page = Number(this.query.page) || 1;
            const limit = Number(this.query.limit) || 2;
            const totalPages = Math.ceil(totalDocuments / limit);
            return {
                page,
                limit,
                total: totalDocuments,
                totalPages,
            };
        });
    }
}
exports.QueryBuilder = QueryBuilder;
