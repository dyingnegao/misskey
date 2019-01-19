import $ from 'cafy';
import AccessToken from '../../../../models/access-token';
import { pack } from '../../../../models/app';
import define from '../../define';

export const meta = {
	requireCredential: true,

	secure: true,

	params: {
		limit: {
			validator: $.num.optional.range(1, 100),
			default: 10,
		},

		offset: {
			validator: $.num.optional.min(0),
			default: 0,
		},

		sort: {
			validator: $.str.optional.or('desc|asc'),
			default: 'desc',
		}
	}
};

export default define(meta, (ps, user) => AccessToken.find({ userId: user._id }, {
		limit: ps.limit,
		skip: ps.offset,
		sort: { _id: ps.sort == 'asc' ? 1 : -1 }
	})
	.then(x => Promise.all(x.map(x => pack(x.appId, user, { detail: true })))));
