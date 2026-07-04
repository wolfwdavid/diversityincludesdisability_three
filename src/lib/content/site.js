/**
 * @typedef {Object} NavItem
 * @property {string} label
 * @property {string} href  Route path (pass through resolve() at use site)
 *
 * @typedef {Object} SocialLink
 * @property {string} label
 * @property {string} href
 */

/** Site-wide metadata. Extended with real marketing copy in Phase 3. */
export const site = {
	name: 'Diversity Includes Disability',
	shortName: 'DID',
	person: 'Eman Rimawi-Doster',
	tagline: 'Intersectional disability equity — training, consulting, speaking, and modeling.',
	email: 'emanrimawi@gmail.com'
};

/** Primary navigation. Order matters — used in header and footer. @type {NavItem[]} */
export const navItems = [
	{ label: 'About', href: '/about/' },
	{ label: 'Services', href: '/services/' },
	{ label: 'Speaking', href: '/speaking/' },
	{ label: 'Contact', href: '/contact/' },
	{ label: 'Accessibility', href: '/accessibility/' }
];

/** @type {SocialLink[]} */
export const socials = [
	{ label: 'LinkedIn', href: 'https://www.linkedin.com/' },
	{ label: 'Instagram', href: 'https://www.instagram.com/' },
	{ label: 'Facebook', href: 'https://www.facebook.com/emanrimawiandtheworld/' }
];
