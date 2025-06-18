
import type { Asset, AssetVersion } from '@/lib/types';

const sampleVersions: AssetVersion[] = [
  { id: 'v1', versionNumber: 1, uploadedAt: '2023-10-01T10:00:00Z', uploadedBy: 'Admin User', notes: 'Initial upload.', fileName: 'innovatech_logo_v1.png', fileSize: '1.1 MB', downloadUrl: '#', previewUrl: 'https://placehold.co/100x100.png', dataAiHint: 'logo version' },
  { id: 'v2', versionNumber: 2, uploadedAt: '2023-10-15T12:30:00Z', uploadedBy: 'Designer Jane', notes: 'Slight color adjustment.', fileName: 'innovatech_logo_v2.png', fileSize: '1.15 MB', downloadUrl: '#', previewUrl: 'https://placehold.co/100x100.png', dataAiHint: 'logo design' },
];

export const mockClientAssets: Record<string, { clientName: string; industry: string; logoUrl?: string; dataAiHint?: string; assets: Asset[] }> = {
  'bk001': {
    clientName: 'Innovatech Corp',
    industry: 'Technology',
    logoUrl: 'https://placehold.co/80x80.png',
    dataAiHint: 'tech logo',
    assets: [
      { 
        id: 'inno-1', 
        name: 'Innovatech Primary Logo', 
        type: 'image', 
        path: '/Logos/', 
        status: 'completed', 
        needsAttention: false, 
        lastModified: '2023-10-26T10:00:00Z', 
        size: '1.2 MB', 
        previewUrl: 'https://placehold.co/100x100.png', 
        dataAiHint: 'abstract tech', 
        downloadUrl: '#', 
        createdAt: '2023-01-15T00:00:00Z',
        versions: sampleVersions,
      },
      { 
        id: 'inno-2', 
        name: 'Innovatech Brand Guidelines', 
        type: 'pdf', 
        path: '/', 
        status: 'completed', 
        needsAttention: false, 
        lastModified: '2023-11-15T14:30:00Z', 
        size: '5.5 MB', 
        downloadUrl: '#', 
        createdAt: '2023-01-20T00:00:00Z',
        versions: [{ id: 'bg-v1', versionNumber: 1, uploadedAt: '2023-11-15T14:30:00Z', uploadedBy: 'Content Team', fileName: 'brand_guidelines_final.pdf', fileSize: '5.5MB', downloadUrl: '#'}]
      },
      { 
        id: 'inno-3', 
        name: 'Innovatech Product One-Pager', 
        type: 'document', 
        path: '/Marketing Materials/', 
        status: 'in-progress', 
        needsAttention: true, 
        lastModified: '2023-12-01T09:15:00Z', 
        size: '2.1 MB', 
        downloadUrl: '#', 
        createdAt: '2023-10-01T00:00:00Z',
        clientRequestDetails: "Client says: 'The stats on page 2 are outdated. Please update with the latest Q4 figures. Also, can we change the main image to something more futuristic?'",
        versions: [{ id: 'op-v1', versionNumber: 1, uploadedAt: '2023-10-01T00:00:00Z', uploadedBy: 'Marketing Team', fileName: 'one_pager_draft.docx', fileSize: '2.0MB', downloadUrl: '#'}]
      },
      { 
        id: 'inno-4', 
        name: 'Old Social Media Graphics', 
        type: 'folder', 
        path: '/Social Media/Old/', 
        status: 'completed', 
        needsAttention: true, // Folder itself marked for attention
        lastModified: '2023-09-01T00:00:00Z', 
        createdAt: '2023-08-01T00:00:00Z', 
        clientRequestDetails: "Client requests this entire folder of old graphics to be archived or reviewed for deletion as they are no longer relevant.",
        children: [
          { 
            id: 'inno-4a', 
            name: 'Twitter Post Q1.jpg', 
            type: 'image', 
            path: '/Social Media/Old/', 
            status: 'completed', 
            needsAttention: true, // Child asset also marked
            lastModified: '2023-09-01T00:00:00Z', 
            size: '300KB', 
            previewUrl: 'https://placehold.co/100x100.png', 
            dataAiHint: 'social media', 
            downloadUrl: '#', 
            createdAt: '2023-08-01T00:00:00Z',
            clientRequestDetails: "This specific graphic is using an old tagline. Please remove or update.",
          }
      ]},
    ],
  },
  'bk002': {
    clientName: 'EcoSolutions Ltd.',
    industry: 'Sustainability',
    logoUrl: 'https://placehold.co/80x80.png',
    dataAiHint: 'nature logo',
    assets: [
      { id: 'eco-1', name: 'EcoSolutions Leaf Logo', type: 'image', path: '/Logos/', status: 'completed', needsAttention: false, lastModified: '2023-11-05T10:00:00Z', size: '900 KB', previewUrl: 'https://placehold.co/100x100.png', dataAiHint: 'leaf environment', downloadUrl: '#', createdAt: '2023-02-15T00:00:00Z' },
      { 
        id: 'eco-2', 
        name: 'Sustainability Report 2023', 
        type: 'pdf', 
        path: '/Reports/', 
        status: 'completed', 
        needsAttention: true, 
        lastModified: '2023-11-20T14:30:00Z', 
        size: '10.2 MB', 
        downloadUrl: '#', 
        createdAt: '2023-02-20T00:00:00Z',
        clientRequestDetails: "Client found a typo on page 5, paragraph 3. Please correct 'enviromental' to 'environmental'.",
        versions: [
            { id: 'sr-v1', versionNumber: 1, uploadedAt: '2023-11-18T10:00:00Z', uploadedBy: 'Research Team', fileName: 'sustainability_report_2023_draft.pdf', fileSize: '10.1 MB', downloadUrl: '#' },
            { id: 'sr-v2', versionNumber: 2, uploadedAt: '2023-11-20T14:30:00Z', uploadedBy: 'Final Review', fileName: 'sustainability_report_2023_final.pdf', fileSize: '10.2 MB', downloadUrl: '#' }
        ]
      },
    ],
  },
  'bk003': { 
    clientName: 'HealthBridge Inc.', 
    industry: 'Healthcare', 
    logoUrl: 'https://placehold.co/80x80.png', 
    dataAiHint: 'medical cross', 
    assets: [
      { id: 'hb-1', name: 'Patient Intake Form', type: 'pdf', path: '/Forms/', status: 'completed', needsAttention: true, lastModified: '2023-11-05T10:00:00Z', size: '900 KB', previewUrl: 'https://placehold.co/100x100.png', dataAiHint: 'form document', downloadUrl: '#', createdAt: '2023-02-15T00:00:00Z', clientRequestDetails: "Needs updated privacy policy section." }
    ] 
  },
  'bk004': { 
    clientName: 'QuantumLeap AI', 
    industry: 'Artificial Intelligence', 
    logoUrl: 'https://placehold.co/80x80.png', 
    dataAiHint: 'abstract brain', 
    assets: [] 
  },
  'bk005': { 
    clientName: 'Artisan Foods Co.', 
    industry: 'Food & Beverage', 
    logoUrl: 'https://placehold.co/80x80.png', 
    dataAiHint: 'wheat grain', 
    assets: [] 
  },
  'bk006': { 
    clientName: 'Globetrotter Agency', 
    industry: 'Travel', 
    logoUrl: 'https://placehold.co/80x80.png', 
    dataAiHint: 'globe compass', 
    assets: [
      { id: 'gt-1', name: 'Travel Itinerary Template', type: 'document', path: '/Templates/', status: 'in-progress', needsAttention: true, lastModified: '2023-12-01T09:15:00Z', size: '2.1 MB', downloadUrl: '#', createdAt: '2023-10-01T00:00:00Z', clientRequestDetails: "Add a section for emergency contact information." }
    ]
  },
};
