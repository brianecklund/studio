
import {defineField, defineType} from 'sanity'
import {FileText, Folder as FolderIcon, Image as ImageIcon, Video as VideoIcon, Archive as ArchiveIcon, AlertTriangle} from 'lucide-react'

const assetTypeOptions = [
  {title: 'Folder', value: 'folder', icon: FolderIcon},
  {title: 'PDF', value: 'pdf', icon: FileText},
  {title: 'Image', value: 'image', icon: ImageIcon},
  {title: 'Video', value: 'video', icon: VideoIcon},
  {title: 'Document (Word, Pages, etc.)', value: 'document', icon: FileText},
  {title: 'Archive (ZIP, RAR)', value: 'archive', icon: ArchiveIcon},
  {title: 'Other', value: 'other', icon: FileText},
]

export default defineType({
  name: 'asset',
  title: 'Asset',
  type: 'document',
  icon: FileText, // Default icon, can be dynamic
  fields: [
    defineField({
      name: 'name',
      title: 'Asset Name',
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
      name: 'client',
      title: 'Client',
      type: 'reference',
      to: [{type: 'client'}],
      validation: (Rule) => Rule.required(),
    }),
    // Optional: Link to a specific brand kit if a client has multiple
    defineField({
      name: 'brandKit',
      title: 'Brand Kit (Optional)',
      type: 'reference',
      to: [{type: 'brandKit'}],
    }),
    defineField({
      name: 'assetType',
      title: 'Asset Type',
      type: 'string',
      options: {
        list: assetTypeOptions,
        layout: 'radio', // or 'dropdown'
      },
      initialValue: 'image',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'file',
      title: 'Asset File',
      type: 'file',
      description: 'Upload the asset file here. For images, this can be the primary image file.',
      hidden: ({document}) => document?.assetType === 'folder',
    }),
    defineField({
      name: 'previewImage', // For non-image assets or if you want a specific thumbnail
      title: 'Custom Preview Image (Optional)',
      type: 'image',
      options: {
        hotspot: true,
      },
      description: "Optional. If the asset is not an image, or you want a specific preview.",
      // Hide if assetType is image AND a file is already uploaded (as it would be the preview)
      // This logic might need refinement based on workflow
      hidden: ({document}) => document?.assetType === 'image' && !!document?.file,
    }),
    defineField({
      name: 'path',
      title: 'File Path / Folder Location',
      type: 'string',
      description: 'e.g., /Logos/Primary/ or /Campaign Materials/Summer 2024/',
      initialValue: '/',
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          {title: 'Waiting for Upload/Info', value: 'waiting'},
          {title: 'In Progress / Review', value: 'in-progress'},
          {title: 'Completed / Approved', value: 'completed'},
        ],
        layout: 'radio',
      },
      initialValue: 'waiting',
    }),
    defineField({
      name: 'needsAttention',
      title: 'Needs Client/Admin Attention?',
      type: 'boolean',
      initialValue: false,
      icon: AlertTriangle,
    }),
    defineField({
      name: 'clientRequestDetails',
      title: 'Client Request/Feedback Details',
      type: 'text',
      rows: 3,
      hidden: ({document}) => !document?.needsAttention,
    }),
    defineField({
      name: 'versions',
      title: 'Version History',
      type: 'array',
      of: [{type: 'assetVersion'}],
      hidden: ({document}) => document?.assetType === 'folder',
    }),
    // For folders
    defineField({
      name: 'parentFolder',
      title: 'Parent Folder (Optional)',
      type: 'reference',
      to: [{type: 'asset', options: {filter: 'assetType == "folder"'}}], // Filter to only allow folder assets
      description: 'If this asset is inside another folder.',
      hidden: ({document}) => document?.assetType !== 'folder' && !document?.path?.includes('/'), // Basic logic
    }),
    // Note: Actual children of folders are typically handled by querying assets with a matching 'path' or 'parentFolder' reference.
    // Sanity doesn't have a direct "children" array that self-references in this way easily for documents.
  ],
  preview: {
    select: {
      title: 'name',
      type: 'assetType',
      status: 'status',
      clientName: 'client.name',
      fileUrl: 'file.asset.url', // For images
      previewImageUrl: 'previewImage.asset.url', // For custom previews
    },
    prepare({title, type, status, clientName, fileUrl, previewImageUrl}) {
      const assetTypeConf = assetTypeOptions.find(opt => opt.value === type);
      return {
        title: title,
        subtitle: `${clientName || 'No Client'} - ${status || 'No Status'}`,
        media: assetTypeConf?.icon || FileText, // Use icon from options, or default
        // media: type === 'image' && fileUrl ? <img src={fileUrl} alt={title} /> : (previewImageUrl ? <img src={previewImageUrl} alt={title} /> : assetTypeConf?.icon || FileText),
      }
    },
  },
})
