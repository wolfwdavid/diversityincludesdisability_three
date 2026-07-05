/**
 * The four service offerings (names are from the live site; descriptions are
 * professional draft copy grounded in Eman's real expertise — confirm wording
 * with Eman before launch).
 *
 * @typedef {Object} Service
 * @property {string} slug        Anchor id on the Services page
 * @property {string} title
 * @property {string} summary     One-line plain-language summary (used on Home)
 * @property {string[]} body      Paragraphs of detail
 * @property {string[]} outcomes  "What you get" bullet points
 * @property {string} forWho      Who it's for
 * @property {string} icon        Key into the inline icon set
 */

/** @type {Service[]} */
export const services = [
	{
		slug: 'training',
		title: 'Training & Facilitation',
		summary:
			'Interactive disability-equity training that centers intersectionality and lived experience.',
		body: [
			'Intersectional disability equity and inclusion workshops for teams, boards, and public institutions. Sessions move past checklists to the attitudes, policies, and everyday practices that decide whether disabled people can actually participate.',
			'Every session is built around your context — grounded in the social model of disability and in Eman’s work organizing for accessible transit, voting rights, and health equity in New York City.'
		],
		outcomes: [
			'A shared vocabulary for disability, access, and intersectionality',
			'Concrete, prioritized changes your team can act on',
			'Facilitated discussion that makes space for disabled voices'
		],
		forWho: 'Nonprofits, government offices, employers, and community organizations.',
		icon: 'people'
	},
	{
		slug: 'consulting',
		title: 'Disability Consulting',
		summary: 'Practical guidance to build access into your programs, events, and policies.',
		body: [
			'One-on-one and organizational consulting to make your programs, hiring, events, and communications genuinely accessible — not just technically compliant.',
			'Eman brings the perspective of a disabled organizer who has spent years inside the systems that shape disabled people’s lives, from paratransit to independent living services.'
		],
		outcomes: [
			'An honest audit of where access is breaking down',
			'A realistic roadmap with quick wins and longer-term work',
			'Accessible event and communications practices your team can reuse'
		],
		forWho: 'Organizations planning events, programs, or policy changes.',
		icon: 'compass'
	},
	{
		slug: 'modeling',
		title: 'Modeling for Representation',
		summary: 'Authentic disabled representation for campaigns that mean it.',
		body: [
			'Modeling and creative collaboration that puts real disabled presence — not a stereotype — in front of your audience. Representation that reflects disabled people as full, multidimensional human beings.',
			'Eman is Black, Palestinian, a bilateral amputee, and an artist. Her presence tells a more truthful story than disability stock imagery ever can.'
		],
		outcomes: [
			'Campaign imagery with authentic disabled representation',
			'Collaboration that respects disability culture and dignity',
			'Storytelling that resonates with disabled audiences'
		],
		forWho: 'Brands, agencies, and campaigns committed to real representation.',
		icon: 'camera'
	},
	{
		slug: 'speaking',
		title: 'Speaking & Panels',
		summary: 'Keynotes and panels on disability justice, delivered with power and clarity.',
		body: [
			'Keynotes, panels, and moderated conversations on disability justice, intersectionality, accessible transit, and lived experience — as a speaker, poet, and organizer.',
			'Eman has trained public officials, testified on transit and access, and spoken on stages and podcasts about the reality of being disabled at the intersection of race, gender, and disability.'
		],
		outcomes: [
			'A compelling, plain-spoken talk tailored to your audience',
			'Q&A and panel moderation that keeps disability at the center',
			'Accessible presentation materials (captions, transcripts on request)'
		],
		forWho: 'Conferences, universities, panels, and community events.',
		icon: 'mic'
	}
];
