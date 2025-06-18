
import type { Asset } from '@/lib/types';

export const mockClientAssets: Record<string, { clientName: string; industry: string; logoUrl?: string; dataAiHint?: string; assets: Asset[] }> = {
  'bk001': {
    clientName: 'Innovatech Corp',
    industry: 'Technology',
    logoUrl: 'https://placehold.co/80x80.png',
    dataAiHint: 'tech logo',
    assets: [
      { id: 'inno-1', name: 'Innovatech Primary Logo', type: 'image', path: '/Logos/', status: 'completed', needsAttention: false, lastModified: '2023-10-26T10:00:00Z', size: '1.2 MB', previewUrl: 'https://placehold.co/100x100.png', dataAiHint: 'abstract tech', downloadUrl: '#', createdAt: '2023-01-15T00:00:00Z' },
      { id: 'inno-2', name: 'Innovatech Brand Guidelines', type: 'pdf', path: '/', status: 'completed', needsAttention: false, lastModified: '2023-11-15T14:30:00Z', size: '5.5 MB', downloadUrl: '#', createdAt: '2023-01-20T00:00:00Z' },
      { id: 'inno-3', name: 'Innovatech Product One-Pager', type: 'document', path: '/Marketing Materials/', status: 'in-progress', needsAttention: true, lastModified: '2023-12-01T09:15:00Z', size: '2.1 MB', downloadUrl: '#', createdAt: '2023-10-01T00:00:00Z' },
      { id: 'inno-4', name: 'Old Social Media Graphics', type: 'folder', path: '/Social Media/Old/', status: 'completed', needsAttention: true, lastModified: '2023-09-01T00:00:00Z', createdAt: '2023-08-01T00:00:00Z', children: [
        { id: 'inno-4a', name: 'Twitter Post Q1.jpg', type: 'image', path: '/Social Media/Old/', status: 'completed', needsAttention: true, lastModified: '2023-09-01T00:00:00Z', size: '300KB', previewUrl: 'https://placehold.co/100x100.png', dataAiHint: 'social media', downloadUrl: '#', createdAt: '2023-08-01T00:00:00Z'}
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
      { id: 'eco-2', name: 'Sustainability Report 2023', type: 'pdf', path: '/Reports/', status: 'completed', needsAttention: false, lastModified: '2023-11-20T14:30:00Z', size: '10.2 MB', downloadUrl: '#', createdAt: '2023-02-20T00:00:00Z' },
    ],
  },
  'bk003': { 
    clientName: 'HealthBridge Inc.', 
    industry: 'Healthcare', 
    logoUrl: 'https://placehold.co/80x80.png', 
    dataAiHint: 'medical cross', 
    assets: [
      { id: 'hb-1', name: 'Patient Intake Form', type: 'pdf', path: '/Forms/', status: 'completed', needsAttention: true, lastModified: '2023-11-05T10:00:00Z', size: '900 KB', previewUrl: 'https://placehold.co/100x100.png', dataAiHint: 'form document', downloadUrl: '#', createdAt: '2023-02-15T00:00:00Z' },
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
      { id: 'gt-1', name: 'Travel Itinerary Template', type: 'document', path: '/Templates/', status: 'in-progress', needsAttention: true, lastModified: '2023-12-01T09:15:00Z', size: '2.1 MB', downloadUrl: '#', createdAt: '2023-10-01T00:00:00Z' },
    ]
  },
};
