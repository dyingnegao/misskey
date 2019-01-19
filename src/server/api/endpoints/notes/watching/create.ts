import $ from 'cafy'; import ID, { transform } from '../../../../../misc/cafy-id';
import Note from '../../../../../models/note';
import define from '../../../define';
import watch from '../../../../../services/note/watch';
import { error } from '../../../../../prelude/promise';

export const meta = {
	stability: 'stable',

	desc: {
		'ja-JP': '指定した投稿をウォッチします。',
		'en-US': 'Watch a note.'
	},

	requireCredential: true,

	kind: 'account-write',

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
	.then(x =>
		x === null ? error('note not found') :
		watch(user._id, x)));
