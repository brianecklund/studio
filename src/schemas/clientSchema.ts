
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
    // Add more client-specific fields here if needed
  ],
  preview: {
    select: {
      title: 'name',
      media: 'logo',
    },
  },
})
