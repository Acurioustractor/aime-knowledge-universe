/**
 * Concept Clustering System
 * 
 * Automatically groups related concepts and creates knowledge pathways
 */

import { ContentItem, ConceptCluster } from '@/lib/database/enhanced-supabase';

export interface ConceptNode {
  id: string;
  name: string;
  weight: number;
  contentIds: string[];
  connections: string[];
}

export interface LearningPathway {
  id: string;
  name: string;
  description: string;
  concepts: string[];
  estimatedDuration: number; // in minutes
  difficulty: number; // 1-5
  prerequisites: string[];
}

/**
 * Concept Clustering Engine
 * Analyzes content to identify concept clusters and learning pathways
 */
export class ConceptClusteringEngine {
  /**
   * Analyze content collection to identify concept clusters
   */
  async identifyConceptClusters(content: ContentItem[]): Promise<ConceptCluster[]> {
    // Extract all concepts from content
    const conceptNodes = this.extractConceptNodes(content);
    
    // Calculate concept relationships
    const conceptGraph = this.buildConceptGraph(conceptNodes, content);
    
    // Identify clusters using community detection
    const clusters = this.detectCommunities(conceptGraph);
    
    // Convert to ConceptCluster format
    return this.formatClusters(clusters, content);
  }

  /**
   * Extract concept nodes from content collection
   */
  private extractConceptNodes(content: ContentItem[]): ConceptNode[] {
    const conceptMap = new Map<string, ConceptNode>();

    for (const item of content) {
      const concepts = [
        ...item.key_concepts,
        ...item.themes,
        ...item.tags.filter(tag => tag.length > 2)
      ];

      for (const concept of concepts) {
        const normalizedConcept = this.normalizeConcept(concept);
        
        if (!conceptMap.has(normalizedConcept)) {
          conceptMap.set(normalizedConcept, {
            id: normalizedConcept,
            name: concept,
            weight: 0,
            contentIds: [],
            connections: []
          });
        }

        const node = conceptMap.get(normalizedConcept)!;
        node.weight += 1;
        if (!node.contentIds.includes(item.id)) {
          node.contentIds.push(item.id);
        }
      }
    }

    return Array.from(conceptMap.values()).filter(node => node.weight >= 2);
  }

  /**
   * Build concept relationship graph
   */
  private buildConceptGraph(conceptNodes: ConceptNode[], content: ContentItem[]): Map<string, Set<string>> {
    const graph = new Map<string, Set<string>>();
    
    // Initialize graph
    for (const node of conceptNodes) {
      graph.set(node.id, new Set());
    }

    // Find co-occurring concepts
    for (const item of content) {
      const itemConcepts = [
        ...item.key_concepts,
        ...item.themes,
        ...item.tags.filter(tag => tag.length > 2)
      ].map(c => this.normalizeConcept(c));

      // Connect concepts that appear together
      for (let i = 0; i < itemConcepts.length; i++) {
        for (let j = i + 1; j < itemConcepts.length; j++) {
          const concept1 = itemConcepts[i];
          const concept2 = itemConcepts[j];
          
          if (graph.has(concept1) && graph.has(concept2)) {
            graph.get(concept1)!.add(concept2);
            graph.get(concept2)!.add(concept1);
          }
        }
      }
    }

    return graph;
  }

  /**
   * Detect communities in concept graph using simple clustering
   */
  private detectCommunities(graph: Map<string, Set<string>>): string[][] {
    const visited = new Set<string>();
    const communities: string[][] = [];

    for (const [node, connections] of graph.entries()) {
      if (visited.has(node)) continue;

      const community = this.expandCommunity(node, graph, visited);
      if (community.length >= 2) {
        communities.push(community);
      }
    }

    return communities;
  }

  /**
   * Expand community using breadth-first search
   */
  private expandCommunity(
    startNode: string,
    graph: Map<string, Set<string>>,
    visited: Set<string>
  ): string[] {
    const community: string[] = [];
    const queue: string[] = [startNode];
    const localVisited = new Set<string>();

    while (queue.length > 0) {
      const node = queue.shift()!;
      
      if (localVisited.has(node)) continue;
      
      localVisited.add(node);
      visited.add(node);
      community.push(node);

      const connections = graph.get(node) || new Set();
      
      // Add strongly connected nodes to community
      for (const neighbor of connections) {
        if (!localVisited.has(neighbor) && !visited.has(neighbor)) {
          const neighborConnections = graph.get(neighbor) || new Set();
          
          // Check if neighbor is strongly connected to this community
          const sharedConnections = Array.from(connections).filter(c => neighborConnections.has(c));
          const connectionStrength = sharedConnections.length / Math.max(connections.size, neighborConnections.size);
          
          if (connectionStrength > 0.3) {
            queue.push(neighbor);
          }
        }
      }
    }

    return community;
  }

  /**
   * Format clusters for database storage
   */
  private formatClusters(communities: string[][], content: ContentItem[]): ConceptCluster[] {
    const clusters: ConceptCluster[] = [];

    for (let i = 0; i < communities.length; i++) {
      const community = communities[i];
      const clusterName = this.generateClusterName(community);
      
      // Find content items that contain concepts from this cluster
      const relatedContentIds = new Set<string>();
      let totalComplexity = 0;
      let philosophyDomain: string | undefined;

      for (const item of content) {
        const itemConcepts = [
          ...item.key_concepts,
          ...item.themes,
          ...item.tags
        ].map(c => this.normalizeConcept(c));

        const overlap = community.filter(concept => itemConcepts.includes(concept));
        
        if (overlap.length > 0) {
          relatedContentIds.add(item.id);
          totalComplexity += item.complexity_level || 1;
          
          if (!philosophyDomain && item.philosophy_domain) {
            philosophyDomain = item.philosophy_domain;
          }
        }
      }

      const avgComplexity = Math.round(totalComplexity / relatedContentIds.size) || 1;

      clusters.push({
        id: `cluster-${i + 1}`,
        name: clusterName,
        description: `Concept cluster containing: ${community.slice(0, 5).join(', ')}`,
        philosophy_domain: philosophyDomain,
        content_ids: Array.from(relatedContentIds),
        centrality_score: this.calculateCentralityScore(community, relatedContentIds.size),
        complexity_level: Math.min(Math.max(avgComplexity, 1), 5),
        prerequisite_clusters: [],
        learning_pathway_position: i + 1,
        estimated_learning_time: this.estimateLearningTime(relatedContentIds.size, avgComplexity),
        practical_applications: this.identifyPracticalApplications(community, content),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    }

    // Identify prerequisite relationships between clusters
    this.identifyPrerequisiteRelationships(clusters);

    return clusters;
  }

  /**
   * Generate meaningful cluster name from concepts
   */
  private generateClusterName(concepts: string[]): string {
    // Sort by concept frequency/importance
    const sortedConcepts = concepts.slice().sort();
    
    // Take the most representative concepts
    const primaryConcepts = sortedConcepts.slice(0, 3);
    
    // Create readable name
    if (primaryConcepts.length === 1) {
      return this.capitalizeWords(primaryConcepts[0]);
    } else if (primaryConcepts.length === 2) {
      return `${this.capitalizeWords(primaryConcepts[0])} & ${this.capitalizeWords(primaryConcepts[1])}`;
    } else {
      return `${this.capitalizeWords(primaryConcepts[0])}, ${this.capitalizeWords(primaryConcepts[1])} & More`;
    }
  }

  /**
   * Calculate centrality score for cluster
   */
  private calculateCentralityScore(concepts: string[], contentCount: number): number {
    // Simple centrality based on concept count and content coverage
    const conceptWeight = Math.min(concepts.length / 10, 1); // Normalize to 0-1
    const contentWeight = Math.min(contentCount / 20, 1); // Normalize to 0-1
    
    return (conceptWeight + contentWeight) / 2;
  }

  /**
   * Estimate learning time for cluster
   */
  private estimateLearningTime(contentCount: number, complexity: number): number {
    // Base time per content item, adjusted by complexity
    const baseTimePerItem = 15; // minutes
    const complexityMultiplier = 1 + (complexity - 1) * 0.3;
    
    return Math.round(contentCount * baseTimePerItem * complexityMultiplier);
  }

  /**
   * Identify practical applications for concepts
   */
  private identifyPracticalApplications(concepts: string[], content: ContentItem[]): string[] {
    const applications = new Set<string>();

    for (const item of content) {
      if (item.content_type === 'tool' || item.content_type === 'story') {
        const itemConcepts = [
          ...item.key_concepts,
          ...item.themes,
          ...item.tags
        ].map(c => this.normalizeConcept(c));

        const overlap = concepts.filter(concept => itemConcepts.includes(concept));
        
        if (overlap.length > 0) {
          // Extract application context from title or description
          const context = this.extractApplicationContext(item);
          if (context) {
            applications.add(context);
          }
        }
      }
    }

    return Array.from(applications).slice(0, 5);
  }

  /**
   * Extract application context from content item
   */
  private extractApplicationContext(item: ContentItem): string | null {
    const title = item.title.toLowerCase();
    const description = (item.description || '').toLowerCase();
    
    // Look for application keywords
    const applicationKeywords = [
      'classroom', 'school', 'education', 'teaching', 'learning',
      'organization', 'business', 'workplace', 'team',
      'community', 'group', 'workshop', 'training',
      'policy', 'government', 'leadership', 'management'
    ];

    for (const keyword of applicationKeywords) {
      if (title.includes(keyword) || description.includes(keyword)) {
        return this.capitalizeWords(keyword);
      }
    }

    // Fallback to content type
    return item.content_type === 'tool' ? 'Practical Implementation' : 'Real-world Example';
  }

  /**
   * Identify prerequisite relationships between clusters
   */
  private identifyPrerequisiteRelationships(clusters: ConceptCluster[]): void {
    for (let i = 0; i < clusters.length; i++) {
      for (let j = 0; j < clusters.length; j++) {
        if (i === j) continue;

        const cluster1 = clusters[i];
        const cluster2 = clusters[j];

        // Check if cluster1 is a prerequisite for cluster2
        if (this.isPrerequisite(cluster1, cluster2)) {
          cluster2.prerequisite_clusters.push(cluster1.id);
        }
      }
    }
  }

  /**
   * Determine if one cluster is a prerequisite for another
   */
  private isPrerequisite(prerequisite: ConceptCluster, target: ConceptCluster): boolean {
    // Simple heuristic: lower complexity clusters are prerequisites for higher complexity
    if (prerequisite.complexity_level < target.complexity_level) {
      // Check for shared content or philosophy domain
      const sharedContent = prerequisite.content_ids.filter(id => target.content_ids.includes(id));
      const sameDomain = prerequisite.philosophy_domain === target.philosophy_domain;
      
      return sharedContent.length > 0 || sameDomain;
    }

    return false;
  }

  /**
   * Generate learning pathways from concept clusters
   */
  generateLearningPathways(clusters: ConceptCluster[]): LearningPathway[] {
    const pathways: LearningPathway[] = [];

    // Group clusters by philosophy domain
    const domainClusters = new Map<string, ConceptCluster[]>();
    
    for (const cluster of clusters) {
      const domain = cluster.philosophy_domain || 'general';
      if (!domainClusters.has(domain)) {
        domainClusters.set(domain, []);
      }
      domainClusters.get(domain)!.push(cluster);
    }

    // Create pathways for each domain
    for (const [domain, domainClusterList] of domainClusters.entries()) {
      // Sort clusters by complexity and prerequisites
      const sortedClusters = this.sortClustersForPathway(domainClusterList);
      
      const pathway: LearningPathway = {
        id: `pathway-${domain}`,
        name: `${this.capitalizeWords(domain)} Learning Pathway`,
        description: `Structured learning path through ${domain} concepts`,
        concepts: sortedClusters.map(c => c.id),
        estimatedDuration: sortedClusters.reduce((sum, c) => sum + (c.estimated_learning_time || 0), 0),
        difficulty: Math.max(...sortedClusters.map(c => c.complexity_level)),
        prerequisites: []
      };

      pathways.push(pathway);
    }

    return pathways;
  }

  /**
   * Sort clusters for optimal learning pathway
   */
  private sortClustersForPathway(clusters: ConceptCluster[]): ConceptCluster[] {
    const sorted: ConceptCluster[] = [];
    const remaining = [...clusters];

    while (remaining.length > 0) {
      // Find clusters with no unmet prerequisites
      const available = remaining.filter(cluster => {
        return cluster.prerequisite_clusters.every(prereqId => 
          sorted.some(sortedCluster => sortedCluster.id === prereqId)
        );
      });

      if (available.length === 0) {
        // Break circular dependencies by taking lowest complexity
        const fallback = remaining.sort((a, b) => a.complexity_level - b.complexity_level)[0];
        sorted.push(fallback);
        remaining.splice(remaining.indexOf(fallback), 1);
      } else {
        // Sort available by complexity and centrality
        available.sort((a, b) => {
          if (a.complexity_level !== b.complexity_level) {
            return a.complexity_level - b.complexity_level;
          }
          return b.centrality_score - a.centrality_score;
        });

        const next = available[0];
        sorted.push(next);
        remaining.splice(remaining.indexOf(next), 1);
      }
    }

    return sorted;
  }

  /**
   * Normalize concept for consistent matching
   */
  private normalizeConcept(concept: string): string {
    return concept.toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');
  }

  /**
   * Capitalize words for display
   */
  private capitalizeWords(text: string): string {
    return text.split(/[-\s]+/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }
}

// Singleton instance
export const conceptClusteringEngine = new ConceptClusteringEngine();