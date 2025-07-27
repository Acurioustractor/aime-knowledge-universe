/**
 * Knowledge Graph for AIME Content Connections
 * 
 * Maps relationships between different types of content to create
 * a comprehensive knowledge graph that enhances search and discovery
 */

import { getDatabase } from './database/connection';
import { detectIndigenousContext, extractKeyTerms } from './search-enhancement';

export interface KnowledgeNode {
  id: string;
  type: 'knowledge' | 'business_case' | 'tool' | 'video' | 'hoodie' | 'content' | 'concept';
  title: string;
  description: string;
  metadata: {
    category?: string;
    topics?: string[];
    concepts?: string[];
    indigenous_context?: boolean;
    difficulty_level?: string;
    created_at?: string;
  };
}

export interface KnowledgeEdge {
  from_id: string;
  to_id: string;
  relationship_type: 
    | 'references' 
    | 'implements' 
    | 'explains' 
    | 'builds_on' 
    | 'similar_to' 
    | 'part_of' 
    | 'leads_to'
    | 'prerequisite_for'
    | 'cultural_connection';
  strength: number; // 0-1
  description: string;
  metadata?: Record<string, any>;
}

export interface GraphPath {
  nodes: KnowledgeNode[];
  edges: KnowledgeEdge[];
  total_strength: number;
  path_type: 'learning' | 'cultural' | 'thematic' | 'progression';
  description: string;
}

export interface ContentConnection {
  connected_content: KnowledgeNode;
  relationship: KnowledgeEdge;
  path_distance: number;
  connection_strength: number;
}

export class KnowledgeGraphEngine {
  private db: any;
  private nodes: Map<string, KnowledgeNode> = new Map();
  private edges: Map<string, KnowledgeEdge[]> = new Map();
  private conceptNodes: Map<string, KnowledgeNode> = new Map();
  
  constructor() {
    this.initialize();
  }
  
  private async initialize() {
    this.db = await getDatabase();
  }
  
  /**
   * Build the complete knowledge graph from AIME content
   */
  async buildKnowledgeGraph(): Promise<void> {
    await this.initialize();
    console.log('🕸️ Building AIME knowledge graph...');
    
    // Load all content as nodes
    await this.loadContentNodes();
    
    // Extract and create concept nodes
    await this.extractConceptNodes();
    
    // Create edges between content
    await this.createContentConnections();
    
    // Create concept-to-content edges
    await this.createConceptConnections();
    
    // Create Indigenous knowledge pathways
    await this.createIndigenousPathways();
    
    console.log(`✅ Knowledge graph built with ${this.nodes.size} nodes and ${this.getTotalEdges()} edges`);
  }
  
  /**
   * Load all AIME content as graph nodes
   */
  private async loadContentNodes(): Promise<void> {
    console.log('📚 Loading content nodes...');
    
    // Load knowledge documents
    const knowledgeDocs = await this.db.all(`
      SELECT id, title, content, document_type, metadata, created_at
      FROM knowledge_documents
      WHERE validation_status = 'approved' OR validation_status IS NULL
    `);
    
    knowledgeDocs.forEach(doc => {
      const node: KnowledgeNode = {
        id: `knowledge_${doc.id}`,
        type: 'knowledge',
        title: doc.title,
        description: doc.content.substring(0, 300) + '...',
        metadata: {
          category: doc.document_type,
          concepts: this.extractConcepts(doc.content),
          indigenous_context: detectIndigenousContext(doc.content).hasIndigenousContent,
          created_at: doc.created_at
        }
      };
      this.nodes.set(node.id, node);
    });
    
    // Load business cases
    const businessCases = await this.db.all(`
      SELECT id, title, description, content, category, created_at
      FROM business_cases
    `);
    
    businessCases.forEach(bc => {
      const node: KnowledgeNode = {
        id: `business_case_${bc.id}`,
        type: 'business_case',
        title: bc.title,
        description: bc.description,
        metadata: {
          category: bc.category,
          concepts: this.extractConcepts(bc.content || bc.description),
          indigenous_context: detectIndigenousContext(bc.content || bc.description).hasIndigenousContent,
          created_at: bc.created_at
        }
      };
      this.nodes.set(node.id, node);
    });
    
    // Load tools
    const tools = await this.db.all(`
      SELECT id, title, description, tags, themes, topics, created_at
      FROM tools
    `);
    
    tools.forEach(tool => {
      const node: KnowledgeNode = {
        id: `tool_${tool.id}`,
        type: 'tool',
        title: tool.title,
        description: tool.description,
        metadata: {
          topics: JSON.parse(tool.topics || '[]'),
          concepts: this.extractConcepts(tool.description),
          created_at: tool.created_at
        }
      };
      this.nodes.set(node.id, node);
    });
    
    // Load videos
    const videos = await this.db.all(`
      SELECT id, title, description, category, created_at
      FROM content
      WHERE content_type = 'video'
    `);
    
    videos.forEach(video => {
      const node: KnowledgeNode = {
        id: `video_${video.id}`,
        type: 'video',
        title: video.title,
        description: video.description,
        metadata: {
          category: video.category,
          concepts: this.extractConcepts(video.description),
          created_at: video.created_at
        }
      };
      this.nodes.set(node.id, node);
    });
    
    // Load hoodies
    const hoodies = await this.db.all(`
      SELECT id, name, description, category, subcategory, created_at
      FROM hoodies
    `);
    
    hoodies.forEach(hoodie => {
      const node: KnowledgeNode = {
        id: `hoodie_${hoodie.id}`,
        type: 'hoodie',
        title: hoodie.name,
        description: hoodie.description || `${hoodie.category} hoodie`,
        metadata: {
          category: hoodie.category,
          concepts: this.extractConcepts(hoodie.description || hoodie.name),
          created_at: hoodie.created_at
        }
      };
      this.nodes.set(node.id, node);
    });
    
    console.log(`📊 Loaded ${this.nodes.size} content nodes`);
  }
  
  /**
   * Extract and create concept nodes from content
   */
  private async extractConceptNodes(): Promise<void> {
    console.log('🧠 Extracting concept nodes...');
    
    const conceptCounts = new Map<string, number>();
    const conceptConnections = new Map<string, Set<string>>();
    
    // Count concept occurrences across all content
    this.nodes.forEach(node => {
      const concepts = node.metadata.concepts || [];
      concepts.forEach(concept => {
        conceptCounts.set(concept, (conceptCounts.get(concept) || 0) + 1);
        
        if (!conceptConnections.has(concept)) {
          conceptConnections.set(concept, new Set());
        }
        conceptConnections.get(concept)!.add(node.id);
      });
    });
    
    // Create concept nodes for frequently mentioned concepts
    conceptCounts.forEach((count, concept) => {
      if (count >= 3) { // Concept appears in at least 3 pieces of content
        const conceptNode: KnowledgeNode = {
          id: `concept_${concept.replace(/\s+/g, '_').toLowerCase()}`,
          type: 'concept',
          title: concept,
          description: `Core concept appearing in ${count} pieces of content`,
          metadata: {
            frequency: count,
            connected_content_count: conceptConnections.get(concept)?.size || 0
          }
        };
        
        this.conceptNodes.set(conceptNode.id, conceptNode);
        this.nodes.set(conceptNode.id, conceptNode);
      }
    });
    
    console.log(`🔗 Created ${this.conceptNodes.size} concept nodes`);
  }
  
  /**
   * Create connections between content based on similarity and relationships
   */
  private async createContentConnections(): Promise<void> {
    console.log('🔗 Creating content connections...');
    
    const contentNodes = Array.from(this.nodes.values()).filter(node => node.type !== 'concept');
    
    for (let i = 0; i < contentNodes.length; i++) {
      const nodeA = contentNodes[i];
      const edgesFromA: KnowledgeEdge[] = [];
      
      for (let j = i + 1; j < contentNodes.length; j++) {
        const nodeB = contentNodes[j];
        
        // Calculate semantic similarity
        const similarity = this.calculateNodeSimilarity(nodeA, nodeB);
        
        if (similarity > 0.3) {
          // Determine relationship type
          const relationshipType = this.inferRelationshipType(nodeA, nodeB, similarity);
          
          // Create bidirectional edges
          const edgeAtoB: KnowledgeEdge = {
            from_id: nodeA.id,
            to_id: nodeB.id,
            relationship_type: relationshipType,
            strength: similarity,
            description: this.generateRelationshipDescription(nodeA, nodeB, relationshipType)
          };
          
          const edgeBtoA: KnowledgeEdge = {
            from_id: nodeB.id,
            to_id: nodeA.id,
            relationship_type: relationshipType,
            strength: similarity,
            description: this.generateRelationshipDescription(nodeB, nodeA, relationshipType)
          };
          
          edgesFromA.push(edgeAtoB);
          
          if (!this.edges.has(nodeB.id)) {
            this.edges.set(nodeB.id, []);
          }
          this.edges.get(nodeB.id)!.push(edgeBtoA);
        }
      }
      
      if (edgesFromA.length > 0) {
        this.edges.set(nodeA.id, edgesFromA);
      }
    }
    
    console.log(`🔗 Created ${this.getTotalEdges()} content connections`);
  }
  
  /**
   * Create connections between concepts and content
   */
  private async createConceptConnections(): Promise<void> {
    console.log('🧩 Creating concept-content connections...');
    
    this.conceptNodes.forEach(conceptNode => {
      const conceptEdges: KnowledgeEdge[] = [];
      
      this.nodes.forEach(contentNode => {
        if (contentNode.type === 'concept') return;
        
        const concepts = contentNode.metadata.concepts || [];
        const conceptTitle = conceptNode.title.toLowerCase();
        
        // Check if content contains this concept
        const containsConcept = concepts.some(concept => 
          concept.toLowerCase().includes(conceptTitle) || 
          conceptTitle.includes(concept.toLowerCase())
        );
        
        if (containsConcept) {
          const edge: KnowledgeEdge = {
            from_id: conceptNode.id,
            to_id: contentNode.id,
            relationship_type: 'explains',
            strength: 0.8,
            description: `${contentNode.title} explains the concept of ${conceptNode.title}`
          };
          
          conceptEdges.push(edge);
          
          // Create reverse edge
          if (!this.edges.has(contentNode.id)) {
            this.edges.set(contentNode.id, []);
          }
          
          const reverseEdge: KnowledgeEdge = {
            from_id: contentNode.id,
            to_id: conceptNode.id,
            relationship_type: 'references',
            strength: 0.8,
            description: `${contentNode.title} references the concept of ${conceptNode.title}`
          };
          
          this.edges.get(contentNode.id)!.push(reverseEdge);
        }
      });
      
      if (conceptEdges.length > 0) {
        this.edges.set(conceptNode.id, conceptEdges);
      }
    });
    
    console.log('✅ Created concept-content connections');
  }
  
  /**
   * Create special pathways for Indigenous knowledge
   */
  private async createIndigenousPathways(): Promise<void> {
    console.log('🌿 Creating Indigenous knowledge pathways...');
    
    const indigenousNodes = Array.from(this.nodes.values()).filter(node => 
      node.metadata.indigenous_context === true
    );
    
    // Create stronger connections between Indigenous content
    for (let i = 0; i < indigenousNodes.length; i++) {
      const nodeA = indigenousNodes[i];
      
      for (let j = i + 1; j < indigenousNodes.length; j++) {
        const nodeB = indigenousNodes[j];
        
        // Create cultural connection
        const culturalEdge: KnowledgeEdge = {
          from_id: nodeA.id,
          to_id: nodeB.id,
          relationship_type: 'cultural_connection',
          strength: 0.9,
          description: `Both content pieces share Indigenous knowledge perspectives`
        };
        
        if (!this.edges.has(nodeA.id)) {
          this.edges.set(nodeA.id, []);
        }
        this.edges.get(nodeA.id)!.push(culturalEdge);
        
        // Reverse edge
        const reverseCulturalEdge: KnowledgeEdge = {
          from_id: nodeB.id,
          to_id: nodeA.id,
          relationship_type: 'cultural_connection',
          strength: 0.9,
          description: `Both content pieces share Indigenous knowledge perspectives`
        };
        
        if (!this.edges.has(nodeB.id)) {
          this.edges.set(nodeB.id, []);
        }
        this.edges.get(nodeB.id)!.push(reverseCulturalEdge);
      }
    }
    
    console.log(`🌿 Created Indigenous pathways connecting ${indigenousNodes.length} nodes`);
  }
  
  /**
   * Find connected content for a given node
   */
  async findConnectedContent(nodeId: string, maxDistance: number = 2, limit: number = 10): Promise<ContentConnection[]> {
    const connections: ContentConnection[] = [];
    const visited = new Set<string>();
    const queue: Array<{nodeId: string, distance: number, path: KnowledgeEdge[]}> = [];
    
    // Start BFS from the given node
    queue.push({ nodeId, distance: 0, path: [] });
    visited.add(nodeId);
    
    while (queue.length > 0 && connections.length < limit) {
      const current = queue.shift()!;
      
      if (current.distance > 0 && current.distance <= maxDistance) {
        const connectedNode = this.nodes.get(current.nodeId);
        if (connectedNode) {
          const lastEdge = current.path[current.path.length - 1];
          connections.push({
            connected_content: connectedNode,
            relationship: lastEdge,
            path_distance: current.distance,
            connection_strength: this.calculatePathStrength(current.path)
          });
        }
      }
      
      if (current.distance < maxDistance) {
        const edges = this.edges.get(current.nodeId) || [];
        
        edges.forEach(edge => {
          if (!visited.has(edge.to_id)) {
            visited.add(edge.to_id);
            queue.push({
              nodeId: edge.to_id,
              distance: current.distance + 1,
              path: [...current.path, edge]
            });
          }
        });
      }
    }
    
    return connections
      .sort((a, b) => b.connection_strength - a.connection_strength)
      .slice(0, limit);
  }
  
  /**
   * Find learning pathways between concepts
   */
  async findLearningPathways(fromNodeId: string, toNodeId: string): Promise<GraphPath[]> {
    const paths: GraphPath[] = [];
    const maxDepth = 4;
    
    const findPathsRecursive = (
      currentId: string, 
      targetId: string, 
      currentPath: KnowledgeNode[], 
      currentEdges: KnowledgeEdge[],
      visited: Set<string>,
      depth: number
    ) => {
      if (depth > maxDepth) return;
      if (currentId === targetId && currentPath.length > 1) {
        paths.push({
          nodes: [...currentPath],
          edges: [...currentEdges],
          total_strength: this.calculatePathStrength(currentEdges),
          path_type: this.inferPathType(currentPath, currentEdges),
          description: this.generatePathDescription(currentPath, currentEdges)
        });
        return;
      }
      
      const edges = this.edges.get(currentId) || [];
      
      edges.forEach(edge => {
        if (!visited.has(edge.to_id)) {
          const nextNode = this.nodes.get(edge.to_id);
          if (nextNode) {
            visited.add(edge.to_id);
            findPathsRecursive(
              edge.to_id,
              targetId,
              [...currentPath, nextNode],
              [...currentEdges, edge],
              visited,
              depth + 1
            );
            visited.delete(edge.to_id);
          }
        }
      });
    };
    
    const startNode = this.nodes.get(fromNodeId);
    if (startNode) {
      const visited = new Set([fromNodeId]);
      findPathsRecursive(fromNodeId, toNodeId, [startNode], [], visited, 0);
    }
    
    return paths
      .sort((a, b) => b.total_strength - a.total_strength)
      .slice(0, 5); // Return top 5 paths
  }
  
  /**
   * Helper methods
   */
  private extractConcepts(text: string): string[] {
    const keyTerms = Array.from(extractKeyTerms(text));
    
    // Add AIME-specific concepts
    const aimeTerms = [
      'indigenous', 'mentoring', 'leadership', 'systems', 'transformation',
      'education', 'youth', 'community', 'culture', 'innovation', 'custodianship',
      'relational economics', 'imagination', 'joy', 'seven generation thinking'
    ];
    
    const concepts: string[] = [];
    
    aimeTerms.forEach(term => {
      if (text.toLowerCase().includes(term)) {
        concepts.push(term);
      }
    });
    
    // Add key terms that aren't too common
    keyTerms.forEach(term => {
      if (term.length > 4 && !concepts.includes(term)) {
        concepts.push(term);
      }
    });
    
    return concepts.slice(0, 10); // Limit to 10 concepts per content
  }
  
  private calculateNodeSimilarity(nodeA: KnowledgeNode, nodeB: KnowledgeNode): number {
    let similarity = 0;
    
    // Concept overlap
    const conceptsA = new Set(nodeA.metadata.concepts || []);
    const conceptsB = new Set(nodeB.metadata.concepts || []);
    const commonConcepts = new Set([...conceptsA].filter(c => conceptsB.has(c)));
    const totalConcepts = new Set([...conceptsA, ...conceptsB]);
    
    if (totalConcepts.size > 0) {
      similarity += (commonConcepts.size / totalConcepts.size) * 0.6;
    }
    
    // Category similarity
    if (nodeA.metadata.category === nodeB.metadata.category) {
      similarity += 0.2;
    }
    
    // Indigenous context bonus
    if (nodeA.metadata.indigenous_context && nodeB.metadata.indigenous_context) {
      similarity += 0.2;
    }
    
    return Math.min(similarity, 1.0);
  }
  
  private inferRelationshipType(nodeA: KnowledgeNode, nodeB: KnowledgeNode, similarity: number): KnowledgeEdge['relationship_type'] {
    if (nodeA.metadata.indigenous_context && nodeB.metadata.indigenous_context) {
      return 'cultural_connection';
    }
    
    if (nodeA.type === 'knowledge' && nodeB.type === 'business_case') {
      return 'implements';
    }
    
    if (nodeA.type === 'business_case' && nodeB.type === 'tool') {
      return 'implements';
    }
    
    if (nodeA.type === 'video' && (nodeB.type === 'knowledge' || nodeB.type === 'business_case')) {
      return 'explains';
    }
    
    if (similarity > 0.7) {
      return 'similar_to';
    }
    
    return 'references';
  }
  
  private generateRelationshipDescription(nodeA: KnowledgeNode, nodeB: KnowledgeNode, type: KnowledgeEdge['relationship_type']): string {
    const relationshipDescriptions = {
      'references': `"${nodeA.title}" references concepts from "${nodeB.title}"`,
      'implements': `"${nodeA.title}" provides practical implementation of "${nodeB.title}"`,
      'explains': `"${nodeA.title}" explains the concepts in "${nodeB.title}"`,
      'builds_on': `"${nodeA.title}" builds upon the foundation of "${nodeB.title}"`,
      'similar_to': `"${nodeA.title}" covers similar topics to "${nodeB.title}"`,
      'part_of': `"${nodeA.title}" is part of the broader topic of "${nodeB.title}"`,
      'leads_to': `"${nodeA.title}" naturally leads to "${nodeB.title}"`,
      'prerequisite_for': `"${nodeA.title}" is a prerequisite for understanding "${nodeB.title}"`,
      'cultural_connection': `"${nodeA.title}" and "${nodeB.title}" share Indigenous knowledge perspectives`
    };
    
    return relationshipDescriptions[type] || `"${nodeA.title}" is connected to "${nodeB.title}"`;
  }
  
  private calculatePathStrength(edges: KnowledgeEdge[]): number {
    if (edges.length === 0) return 0;
    
    // Average edge strength with decay for longer paths
    const avgStrength = edges.reduce((sum, edge) => sum + edge.strength, 0) / edges.length;
    const lengthPenalty = Math.pow(0.8, edges.length - 1);
    
    return avgStrength * lengthPenalty;
  }
  
  private inferPathType(nodes: KnowledgeNode[], edges: KnowledgeEdge[]): GraphPath['path_type'] {
    const hasIndigenous = nodes.some(node => node.metadata.indigenous_context);
    const hasProgression = edges.some(edge => 
      edge.relationship_type === 'leads_to' || edge.relationship_type === 'prerequisite_for'
    );
    const hasCultural = edges.some(edge => edge.relationship_type === 'cultural_connection');
    
    if (hasCultural) return 'cultural';
    if (hasProgression) return 'progression';
    if (hasIndigenous) return 'cultural';
    
    return 'thematic';
  }
  
  private generatePathDescription(nodes: KnowledgeNode[], edges: KnowledgeEdge[]): string {
    if (nodes.length < 2) return 'Single node path';
    
    const start = nodes[0].title;
    const end = nodes[nodes.length - 1].title;
    const pathLength = nodes.length - 1;
    
    return `Learning pathway from "${start}" to "${end}" through ${pathLength} connections`;
  }
  
  private getTotalEdges(): number {
    return Array.from(this.edges.values()).reduce((total, edges) => total + edges.length, 0);
  }
  
  /**
   * Get graph statistics
   */
  getGraphStatistics() {
    const nodesByType = new Map<string, number>();
    Array.from(this.nodes.values()).forEach(node => {
      nodesByType.set(node.type, (nodesByType.get(node.type) || 0) + 1);
    });
    
    const edgesByType = new Map<string, number>();
    Array.from(this.edges.values()).flat().forEach(edge => {
      edgesByType.set(edge.relationship_type, (edgesByType.get(edge.relationship_type) || 0) + 1);
    });
    
    return {
      total_nodes: this.nodes.size,
      total_edges: this.getTotalEdges(),
      nodes_by_type: Object.fromEntries(nodesByType),
      edges_by_type: Object.fromEntries(edgesByType),
      concept_nodes: this.conceptNodes.size,
      average_connections_per_node: this.getTotalEdges() / this.nodes.size
    };
  }
}

/**
 * Global knowledge graph instance
 */
let knowledgeGraph: KnowledgeGraphEngine | null = null;

export async function getKnowledgeGraph(): Promise<KnowledgeGraphEngine> {
  if (!knowledgeGraph) {
    knowledgeGraph = new KnowledgeGraphEngine();
    // Graph will be built when first used
  }
  return knowledgeGraph;
}

/**
 * Initialize knowledge graph with AIME content
 */
export async function initializeKnowledgeGraph(): Promise<KnowledgeGraphEngine> {
  const graph = await getKnowledgeGraph();
  await graph.buildKnowledgeGraph();
  return graph;
}