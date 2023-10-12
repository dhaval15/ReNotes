import loglevel from 'loglevel';

if (process.env.NODE_ENV === 'production') {
	loglevel.setLevel('silent');
} else {
	loglevel.setLevel('debug');
}

export const logger = loglevel;

