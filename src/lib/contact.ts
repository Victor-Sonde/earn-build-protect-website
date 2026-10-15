import { z } from 'zod';

export const enquiryTypes = {
  general: 'General enquiry',
  guest: 'Podcast guest suggestion',
  media: 'Media enquiry',
  commercial: 'Commercial collaboration',
} as const;
export type EnquiryType = keyof typeof enquiryTypes;

/** Shared by the form and the server route, so both enforce exactly the same rules. */
export const contactSchema = z.object({
  name: z.string().trim().min(2, 'Enter your name').max(100, 'Name must be 100 characters or fewer'),
  email: z.string().trim().max(200).pipe(z.email('Enter an email address in the format name@example.com')),
  enquiryType: z.enum(['general', 'guest', 'media', 'commercial'], { error: 'Choose what your message is about' }),
  message: z
    .string()
    .trim()
    .min(20, 'Write a message of at least 20 characters')
    .max(4000, 'Message must be 4,000 characters or fewer'),
  consent: z.literal(true, { error: 'Confirm that we can use your details to reply' }),
});

export type ContactInput = z.infer<typeof contactSchema>;
