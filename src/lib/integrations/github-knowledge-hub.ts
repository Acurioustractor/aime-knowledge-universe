/**
 * AIME Knowledge Hub GitHub Integration
 * 
 * Fetches and processes documents from the AIME Knowledge Hub repository
 * to create a unified knowledge system that feeds into the hoodie stock exchange
 */

interface GitHubFile {
  name: string;
  path: string;
  sha: string;
  size: number;
  download_url: string;
  type: 'file' | 'dir';
}

interface GitHubContent {
  name: string;
  path: string;
  content: string;
  encoding: string;
  size: number;
  sha: string;
}

interface KnowledgeDocument {
  id: string;
  github_path: string;
  title: string;
  content: string;
  markdown_content: string;
  document_type: string;
  metadata: {
    author?: string;
    date?: string;
    tags?: string[];
    validation_status?: string;
    cultural_sensitivity?: string;
  };
  chunks: KnowledgeChunk[];
  created_at: string;
  updated_at: string;
}

interface KnowledgeChunk {
  id: string;
  document_id: string;
  chunk_index: number;
  chunk_content: string;
  chunk_type: string; // paragraph, heading, code, quote
  validation_scores: {
    staff?: number;
    community?: number;
    elder?: number;
    expert?: number;
    consensus?: number;
  };
  relationships: string[];
  concepts: string[];
}

const AIME_KNOWLEDGE_HUB_REPO = 'Acurioustractor/aime-knowledge-hub';
const GITHUB_API_BASE = 'https://api.github.com';
const GITHUB_RAW_BASE = 'https://raw.githubusercontent.com';

export class AIMEKnowledgeHubIntegration {
  private apiKey: string;
  
  constructor() {
    this.apiKey = process.env.GITHUB_TOKEN || '';
    if (!this.apiKey) {
      console.warn('⚠️ GITHUB_TOKEN not configured for AIME Knowledge Hub integration');
    }
  }

  /**
   * Fetch all documents from the AIME Knowledge Hub repository
   */
  async fetchAllDocuments(): Promise<KnowledgeDocument[]> {
    console.log('🔍 Fetching AIME Knowledge Hub documents...');
    
    try {
      const documents: KnowledgeDocument[] = [];
      
      // Fetch development docs
      const devDocs = await this.fetchDirectoryDocuments('Docs/development');
      documents.push(...devDocs);
      
      // Fetch any other document directories
      const rootFiles = await this.fetchDirectoryDocuments('');
      const readmeFiles = rootFiles.filter(doc => doc.title.toLowerCase().includes('readme'));
      documents.push(...readmeFiles);
      
      console.log(`✅ Retrieved ${documents.length} documents from AIME Knowledge Hub`);
      return documents;
    } catch (error) {
      console.error('❌ Failed to fetch AIME Knowledge Hub documents:', error);
      throw error;
    }
  }

  /**
   * Fetch documents from a specific directory
   */
  private async fetchDirectoryDocuments(directory: string): Promise<KnowledgeDocument[]> {
    const url = `${GITHUB_API_BASE}/repos/${AIME_KNOWLEDGE_HUB_REPO}/contents/${directory}`;
    
    const response = await fetch(url, {
      headers: this.getHeaders()
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    }

    const files: GitHubFile[] = await response.json();
    const documents: KnowledgeDocument[] = [];

    for (const file of files) {
      if (file.type === 'file' && (file.name.endsWith('.md') || file.name.endsWith('.txt'))) {
        try {
          const document = await this.fetchAndProcessDocument(file);
          documents.push(document);
        } catch (error) {
          console.error(`Failed to process document ${file.name}:`, error);
        }
      }
    }

    return documents;
  }

  /**
   * Fetch and process a single document
   */
  private async fetchAndProcessDocument(file: GitHubFile): Promise<KnowledgeDocument> {
    console.log(`📄 Processing document: ${file.name}`);
    
    // Fetch raw content
    const contentResponse = await fetch(file.download_url!);
    const rawContent = await contentResponse.text();
    
    // Extract metadata and content
    const { metadata, content } = this.parseMarkdownDocument(rawContent);
    
    // Generate chunks
    const chunks = this.createDocumentChunks(file.path, content);
    
    // Determine document type
    const documentType = this.determineDocumentType(file.name, content);
    
    const document: KnowledgeDocument = {
      id: `github-${file.sha}`,
      github_path: file.path,
      title: metadata.title || this.extractTitleFromPath(file.name),
      content: content,
      markdown_content: rawContent,
      document_type: documentType,
      metadata: metadata,
      chunks: chunks,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    return document;
  }

  /**
   * Parse markdown document to extract frontmatter and content
   */
  private parseMarkdownDocument(rawContent: string): { metadata: any; content: string } {
    const frontmatterRegex = /^---\\n([\\s\\S]*?)\\n---\\n([\\s\\S]*)$/;
    const match = rawContent.match(frontmatterRegex);
    
    if (match) {
      try {
        // Parse YAML frontmatter (basic implementation)
        const frontmatter = match[1];
        const content = match[2];
        
        const metadata: any = {};
        frontmatter.split('\\n').forEach(line => {
          const colonIndex = line.indexOf(':');
          if (colonIndex > 0) {
            const key = line.substring(0, colonIndex).trim();
            const value = line.substring(colonIndex + 1).trim().replace(/['"]/g, '');
            metadata[key] = value;
          }
        });
        
        return { metadata, content };
      } catch (error) {
        console.warn('Failed to parse frontmatter, using raw content');
      }
    }
    
    // No frontmatter, extract title from first heading
    const titleMatch = rawContent.match(/^#\\s+(.+)$/m);
    const title = titleMatch ? titleMatch[1] : undefined;
    
    return {
      metadata: title ? { title } : {},
      content: rawContent
    };
  }

  /**
   * Create searchable chunks from document content
   */
  private createDocumentChunks(documentPath: string, content: string): KnowledgeChunk[] {
    const chunks: KnowledgeChunk[] = [];
    
    // Split by headings and paragraphs
    const sections = content.split(/\\n(?=#+\\s)/); // Split on headings
    
    sections.forEach((section, index) => {
      const lines = section.trim().split('\\n').filter(line => line.trim());
      
      if (lines.length === 0) return;
      
      // Determine chunk type
      const firstLine = lines[0];
      let chunkType = 'paragraph';
      if (firstLine.startsWith('#')) chunkType = 'heading';
      else if (firstLine.startsWith('```')) chunkType = 'code';
      else if (firstLine.startsWith('>')) chunkType = 'quote';
      
      // Extract concepts (simple keyword extraction)
      const concepts = this.extractConcepts(section);
      
      const chunk: KnowledgeChunk = {
        id: `${documentPath}-chunk-${index}`,
        document_id: documentPath,
        chunk_index: index,
        chunk_content: section,
        chunk_type: chunkType,
        validation_scores: {
          consensus: 0 // Start with neutral validation
        },
        relationships: [],
        concepts: concepts
      };
      
      chunks.push(chunk);
    });
    
    return chunks;
  }

  /**
   * Extract key concepts from text (basic implementation)
   */
  private extractConcepts(text: string): string[] {
    // AIME-specific concepts and terminology
    const aimeTerms = [
      'mentoring', 'indigenous knowledge', 'systems change', 'relational economics',
      'joy corps', 'iksl', 'custodial', 'validation', 'wisdom', 'transformation',
      'presidents program', 'embassy', 'toolshed', 'imagination', 'kindness',
      'death', 'sun', 'nature', 'mentorclass', 'hoodie economics'
    ];
    
    const concepts: string[] = [];
    const lowerText = text.toLowerCase();
    
    aimeTerms.forEach(term => {
      if (lowerText.includes(term)) {
        concepts.push(term);
      }
    });
    
    // Extract capitalized terms (potential proper nouns/concepts)
    const capitalizedMatches = text.match(/\\b[A-Z][a-z]+(?:\\s+[A-Z][a-z]+)*\\b/g) || [];
    const filteredCapitalized = capitalizedMatches
      .filter(term => term.length > 3 && !['The', 'This', 'That', 'With', 'From'].includes(term))
      .slice(0, 5); // Limit to 5 concepts
    
    concepts.push(...filteredCapitalized);
    
    return [...new Set(concepts)]; // Remove duplicates
  }

  /**
   * Determine document type based on filename and content
   */
  private determineDocumentType(filename: string, content: string): string {
    const lower = filename.toLowerCase();
    const contentLower = content.toLowerCase();
    
    if (lower.includes('readme')) return 'overview';
    if (lower.includes('roadmap')) return 'strategy';
    if (lower.includes('guide')) return 'guide';
    if (lower.includes('validator')) return 'process';
    if (lower.includes('migration')) return 'technical';
    if (contentLower.includes('validation') && contentLower.includes('knowledge')) return 'methodology';
    if (contentLower.includes('indigenous') || contentLower.includes('cultural')) return 'cultural';
    
    return 'knowledge';
  }

  /**
   * Extract title from file path
   */
  private extractTitleFromPath(filename: string): string {
    return filename
      .replace(/\\.(md|txt)$/, '')
      .replace(/[_-]/g, ' ')
      .replace(/\\b\\w/g, l => l.toUpperCase());
  }

  /**
   * Get headers for GitHub API requests
   */
  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'AIME-Wiki-Integration'
    };
    
    if (this.apiKey) {
      headers['Authorization'] = `token ${this.apiKey}`;
    }
    
    return headers;
  }

  /**
   * Check for document updates by comparing SHAs
   */
  async checkForUpdates(existingDocuments: { github_path: string; sha: string }[]): Promise<string[]> {
    const updatedPaths: string[] = [];
    
    try {
      const allFiles = await this.fetchAllRepositoryFiles();
      
      for (const file of allFiles) {
        const existing = existingDocuments.find(doc => doc.github_path === file.path);
        if (!existing || existing.sha !== file.sha) {
          updatedPaths.push(file.path);
        }
      }
    } catch (error) {
      console.error('Failed to check for updates:', error);
    }
    
    return updatedPaths;
  }

  /**
   * Fetch all repository files (for update checking)
   */
  private async fetchAllRepositoryFiles(): Promise<GitHubFile[]> {
    const url = `${GITHUB_API_BASE}/repos/${AIME_KNOWLEDGE_HUB_REPO}/git/trees/main?recursive=1`;
    
    const response = await fetch(url, {
      headers: this.getHeaders()
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const data = await response.json();
    return data.tree.filter((item: any) => 
      item.type === 'blob' && (item.path.endsWith('.md') || item.path.endsWith('.txt'))
    );
  }
}

// Export types for use in other modules
export type { KnowledgeDocument, KnowledgeChunk };