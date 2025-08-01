import { Query } from 'mongoose';

export class QueryBuilder<T> {
    public modelQuery: Query<T[], T>;
    public readonly query: Record<string, string>;

    constructor(modelQuery: Query<T[], T>, query: Record<string, string>) {
        this.modelQuery = modelQuery;
        this.query = query;
    }

    filter(): this {
        const filter = { ...this.query };
        const excludedFields = ['searchTerm', 'sort', 'fields', 'page', 'limit'];

        for (const field of excludedFields) {
            // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
            delete filter[field];
        }

        this.modelQuery = this.modelQuery.find(filter);
        return this;
    }

    search(searchableFields: string[]): this {
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


    sort(): this {
        const sortBy = this.query.sort || 'createdAt';
        this.modelQuery = this.modelQuery.sort(sortBy);
        return this;
    }


    select(): this {
        const fields = this.query.fields?.split(',').join(' ') || '';
        this.modelQuery = this.modelQuery.select(fields);
        return this;
    }

    paginate(): this {
        const page = Number(this.query.page) || 1;
        const limit = Number(this.query.limit) || 10;
        const skip = (page - 1) * limit;

        this.modelQuery = this.modelQuery.skip(skip).limit(limit);
        return this;
    }

    async getMeta() {
        const totalDocuments = await this.modelQuery.model.countDocuments();
        const page = Number(this.query.page) || 1;
        const limit = Number(this.query.limit) || 10;
        const totalPages = Math.ceil(totalDocuments / limit);

        return {
            page,
            limit,
            total: totalDocuments,
            totalPages,
        };
    }
}
