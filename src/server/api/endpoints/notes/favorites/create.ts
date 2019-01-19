import $ from 'cafy'; import ID, { transform } from '../../../../../misc/cafy-id';
import Favorite from '../../../../../models/favorite';
import Note from '../../../../../models/note';
import define from '../../../define';

export const meta = {
	stability: 'stable',

	desc: {
		'ja-JP': '指定した投稿をお気に入りに登録します。',
		'en-US': 'Favorite a note.'
	},

	requireCredential: true,

	kind: 'favorite-write',

	params: {
		noteId: {
			validator: $.type(ID),
			transform: transform,
			desc: {
				'ja-JP': '対象の投稿のID',
				'en-US': 'Target note ID.'
			}
		}
	}
};

export default define(meta, (ps, user) => Note.findOne({ _id: ps.noteId })
	.then(async x => {
		if (x === null) throw 'note not found';
		if (await Favorite.findOne({
			noteId: x._id,
			userId: user._id
		}) !== null) throw 'already favorited';
		await Favorite.insert({
			createdAt: new Date(),
			noteId: x._id,
			userId: user._id
		});
	}));
