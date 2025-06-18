
import {defineField, defineType} from 'sanity'
import {Users} from 'lucide-react'

export default defineType({
  name: 'client',
  title: 'Client',
  type: 'document',
  icon: Users,
  fields: [
    defineField({
      name: 'name',
      title: 'Client Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'clientEmail',
      title: 'Client Contact Email',
      type: 'string',
      description: 'Primary contact email for the client. This is for informational purposes and not directly used for login in this basic setup.',
      validation: (Rule) => Rule.email().optional(),
    }),
    defineField({
      name: 'status',
      title: 'Client Status',
      type: 'string',
      options: {
        list: [
          {title: 'Active', value: 'active'},
          {title: 'Inactive', value: 'inactive'},
          {title: 'Pending', value: 'pending'},
        ],
        layout: 'radio',
      },
      initialValue: 'pending',
      description: 'Controls the general status of the client in the system.',
    }),
    defineField({
      name: 'industry',
      title: 'Industry',
      type: 'string',
    }),
    defineField({
      name: 'logo',
      title: 'Client Logo',
      type: 'image',
      options: {
        hotspot: true, // Enables image cropping
      },
    }),
    defineField({
      name: 'adminNotes',
      title: 'Admin Notes & Settings',
      type: 'text',
      rows: 5,
      description: 'Internal notes or specific settings for this client, visible only to admins in Sanity Studio.',
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'clientEmail',
      status: 'status',
      media: 'logo',
    },
    prepare({title, subtitle, status, media}) {
      return {
        title: title,
        subtitle: `${subtitle || ''} - Status: ${status || 'N/A'}`,
        media,
      }
    },
  },
})
