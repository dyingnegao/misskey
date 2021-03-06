<template>
<div class="mk-poll" :data-is-voted="isVoted">
	<ul>
		<li v-for="choice in poll.choices" :key="choice.id" @click="vote(choice.id)" :class="{ voted: choice.voted }" :title="!isVoted ? $t('vote-to').replace('{}', choice.text) : ''">
			<div class="backdrop" :style="{ 'width': (showResult ? (choice.votes / total * 100) : 0) + '%' }"></div>
			<span>
				<template v-if="choice.isVoted"><fa icon="check"/></template>
				<mfm :text="choice.text" :should-break="false" :plain-text="true" :custom-emojis="note.emojis"/>
				<span class="votes" v-if="showResult">({{ $t('vote-count').replace('{}', choice.votes) }})</span>
			</span>
		</li>
	</ul>
	<p v-if="total > 0">
		<span>{{ $t('total-users').replace('{}', total) }}</span>
		<span>・</span>
		<a v-if="!isVoted" @click="toggleShowResult">{{ showResult ? $t('vote') : $t('show-result') }}</a>
		<span v-if="isVoted">{{ $t('voted') }}</span>
	</p>
</div>
</template>

<script lang="ts">
import Vue from 'vue';
import i18n from '../../../i18n';
import { sum } from '../../../../../prelude/array';
export default Vue.extend({
	i18n: i18n('common/views/components/poll.vue'),
	props: ['note'],
	data() {
		return {
			showResult: false
		};
	},
	computed: {
		poll(): any {
			return this.note.poll;
		},
		total(): number {
			return sum(this.poll.choices.map(x => x.votes));
		},
		isVoted(): boolean {
			return this.poll.choices.some(c => c.isVoted);
		}
	},
	created() {
		this.showResult = this.isVoted;
	},
	methods: {
		toggleShowResult() {
			this.showResult = !this.showResult;
		},
		vote(id) {
			if (this.poll.choices.some(c => c.isVoted)) return;
			this.$root.api('notes/polls/vote', {
				noteId: this.note.id,
				choice: id
			}).then(() => {
				for (const c of this.poll.choices) {
					if (c.id == id) {
						c.votes++;
						Vue.set(c, 'isVoted', true);
					}
				}
				this.showResult = true;
			});
		}
	}
});
</script>

<style lang="stylus" scoped>
.mk-poll
	> ul
		display block
		margin 0
		padding 0
		list-style none

		> li
			display block
			margin 4px 0
			padding 4px 8px
			width 100%
			color var(--pollChoiceText)
			border solid 1px var(--pollChoiceBorder)
			border-radius 4px
			overflow hidden
			cursor pointer

			&:hover
				background rgba(#000, 0.05)

			&:active
				background rgba(#000, 0.1)

			> .backdrop
				position absolute
				top 0
				left 0
				height 100%
				background var(--primary)
				transition width 1s ease

			> span
				> [data-icon]
					margin-right 4px

				> .votes
					margin-left 4px

	> p
		color var(--text)

		a
			color inherit

	&[data-is-voted]
		> ul > li
			cursor default

			&:hover
				background transparent

			&:active
				background transparent

</style>
