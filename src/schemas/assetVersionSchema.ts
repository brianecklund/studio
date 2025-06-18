
import {defineField, defineType} from 'sanity'
import {History} from 'lucide-react'

export default defineType({
  name: 'assetVersion',
  title: 'Asset Version',
  type: 'object', // Changed from 'document' to 'object' to be embeddable
  icon: History,
  fields: [
    defineField({
      name: 'versionNumber',
      title: 'Version Number',
      type: 'number',
      validation: (Rule) => Rule.required().positive().integer(),
    }),
    defineField({
      name: 'file',
      title: 'File',
      type: 'file', // Using Sanity's file type
      // For images, you might use 'image' type instead or in addition
    }),
    defineField({
      name: 'previewImage', // If you want a separate preview image for non-image files
      title: 'Preview Image (Optional)',
      type: 'image',
      options: {
        hotspot: true,
      },
      hidden: ({parent}) => parent?.file?.asset?.mimeType?.startsWith('image/'), // Hide if main file is image
    }),
    defineField({
      name: 'uploadedAt',
      title: 'Uploaded At',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'uploadedBy',
      title: 'Uploaded By (User/Role)',
      type: 'string',
      description: 'Name or role of the uploader, e.g., "Admin", "Designer Jane"',
    }),
    defineField({
      name: 'notes',
      title: 'Version Notes',
      type: 'text',
      rows: 2,
    }),
  ],
  preview: {
    select: {
      versionNumber: 'versionNumber',
      fileName: 'file.asset.originalFilename',
      uploadedAt: 'uploadedAt',
    },
    prepare({versionNumber, fileName, uploadedAt}) {
      const date = uploadedAt ? new Date(uploadedAt).toLocaleDateString() : '';
      return {
        title: `V${versionNumber || '?'} - ${fileName || 'Untitled'}`,
        subtitle: date,
      }
    },
  },
})
