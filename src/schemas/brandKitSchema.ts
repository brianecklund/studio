
import {defineField, defineType} from 'sanity'
import {Briefcase} from 'lucide-react'

export default defineType({
  name: 'brandKit',
  title: 'Brand Kit',
  type: 'document',
  icon: Briefcase,
  fields: [
    defineField({
      name: 'client',
      title: 'Client',
      type: 'reference',
      to: [{type: 'client'}],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'kitName',
      title: 'Brand Kit Name',
      type: 'string',
      description: 'e.g., Primary Brand Kit, Campaign X Kit',
      initialValue: 'Primary Brand Kit',
      validation: (Rule) => Rule.required(),
    }),
    // We might reference assets here later or manage them via client reference
    // For now, this structure links a kit to a client.
    // Assets will likely be queried based on client or kit.
  ],
  preview: {
    select: {
      title: 'kitName',
      clientName: 'client.name',
      media: 'client.logo',
    },
    prepare({title, clientName, media}) {
      return {
        title: title,
        subtitle: clientName ? `For: ${clientName}` : 'No client assigned',
        media,
      }
    },
  },
})
