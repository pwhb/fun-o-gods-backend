import mongoose from 'mongoose';
const DEFAULT_LIMIT = 10;

interface QueryKey {
  type: QueryType;
  key: string;
  field?: string;
  searchedFields?: string[];
}

export enum QueryType {
  String,
  Boolean,
  ObjectId,
  Date,
  Regex,
  Any,
}
const exclude = ['page', 'size', 'sort_by', 'select'];

function getFilter(query: any, queryConf?: QueryKey[]) {
  const or: any[] = [];
  const and: any[] = [];
  const filter: any = {};

  for (const key of Object.keys(query).filter((v) => !exclude.includes(v))) {
    const config =
      queryConf && queryConf.length && queryConf.find((v) => v.key === key);
    if (config) {
      const filterKey = config.field ? config.field : key;

      switch (config.type) {
        case QueryType.String: {
          filter[filterKey] = query[key];
          break;
        }
        case QueryType.Boolean: {
          if (query[key] === 'true') {
            filter[filterKey] = true;
          } else if (query[key] === 'false') {
            filter[filterKey] = false;
          }
          break;
        }
        case QueryType.ObjectId: {
          filter[filterKey] = new mongoose.Types.ObjectId(query[key] as string);
          break;
        }
        case QueryType.Date: {
          if (!!query[`${key}.from`]) {
            const from = new Date(query[`${key}.from`]).getTime();
            and.push({
              [filterKey]: {
                $gte: from,
              },
            });
          }

          if (!!query[`${key}.to`]) {
            const to = new Date(query[`${key}.to`]).getTime();
            and.push({
              [filterKey]: {
                $lt: to + 1000 * 60 * 60 * 24,
              },
            });
          }
          break;
        }
        case QueryType.Regex: {
          if (config.searchedFields && config.searchedFields.length) {
            for (const searchedKey of config.searchedFields) {
              or.push({
                [searchedKey]: { $regex: query[key], $options: 'i' },
              });
            }
          } else {
            or.push({
              [key]: { $regex: query[key], $options: 'i' },
            });
          }
          break;
        }
      }
    } else {
      filter[key] = query[key];
    }
  }

  if (and.length && or.length) {
    filter['$and'] = [...and, { $or: or }];
  } else if (or.length) {
    filter['$or'] = or;
  } else if (and.length) {
    filter['$and'] = and;
  }

  return filter;
}

function getSort(sort_by?: any) {
  const sort: any = {};
  if (sort_by) {
    const split = sort_by.split(',');
    for (const key of split) {
      const trimmed = key.trim();
      const field = trimmed.replace('-', '');
      sort[field] = trimmed[0] === '-' ? -1 : 1;
    }
  } else {
    sort['createdAt'] = -1;
  }
  return sort;
}

function getSelect(select?: any) {
  const projection: any = {};
  if (select) {
    const split = select.split(',');
    for (const key of split) {
      const trimmed = key.trim();
      const field = trimmed.replace('-', '');
      projection[field] = trimmed[0] === '-' ? -1 : 1;
    }
  }
  return projection;
}
export function parseQuery(query: any, queryConf?: QueryKey[]) {
  const page = query.page ? parseInt(query.page as string) : 0;
  const size = query.size ? parseInt(query.size as string) : DEFAULT_LIMIT;
  const skip = page * size;

  const filter = getFilter(query, queryConf);
  const sort = getSort(query.sort_by as string);
  const projection = getSelect(query.select as string);
  return { page, limit: size, skip, filter, sort, projection };
}
