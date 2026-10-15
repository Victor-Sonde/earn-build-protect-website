import { makeRouteHandler } from '@keystatic/next/route-handler';
import config from '@keystatic-config';
import { adminEnabled } from '@/lib/admin';

const notFound = () => new Response('Not found', { status: 404 });
const handlers = adminEnabled ? makeRouteHandler({ config }) : { GET: notFound, POST: notFound };

export const { GET, POST } = handlers;
