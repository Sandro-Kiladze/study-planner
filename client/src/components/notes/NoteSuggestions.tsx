import React from 'react';
import { Assignment } from '../../../../shared/src/index';

interface NoteSuggestionsProps {
  assignment: Assignment;
  onSelectTemplate: (template: { title: string; content: string; tags: string[] }) => void;
}

export const NoteSuggestions: React.FC<NoteSuggestionsProps> = ({
  assignment,
  onSelectTemplate
}) => {
  const getAssignmentTemplates = () => {
    const baseTemplates = [
      {
        title: `${assignment.title} - Research Notes`,
        content: `# Research Notes for ${assignment.title}\n\n## Key Points\n- \n\n## Sources\n- \n\n## Next Steps\n- `,
        tags: ['research', 'planning']
      },
      {
        title: `${assignment.title} - Progress Log`,
        content: `# Progress Log for ${assignment.title}\n\n## Completed\n- \n\n## In Progress\n- \n\n## Blockers\n- \n\n## Next Session\n- `,
        tags: ['progress', 'tracking']
      },
      {
        title: `${assignment.title} - Ideas & Brainstorming`,
        content: `# Ideas for ${assignment.title}\n\n## Initial Thoughts\n- \n\n## Potential Approaches\n- \n\n## Questions to Explore\n- `,
        tags: ['brainstorming', 'ideas']
      }
    ];

    // Add specific templates based on assignment type (inferred from title/description)
    const title = assignment.title.toLowerCase();
    const description = assignment.description?.toLowerCase() || '';
    
    if (title.includes('essay') || title.includes('paper') || description.includes('essay')) {
      baseTemplates.push({
        title: `${assignment.title} - Essay Outline`,
        content: `# Essay Outline: ${assignment.title}\n\n## Thesis Statement\n\n\n## Introduction\n- Hook:\n- Background:\n- Thesis:\n\n## Body Paragraphs\n### Paragraph 1\n- Topic sentence:\n- Evidence:\n- Analysis:\n\n### Paragraph 2\n- Topic sentence:\n- Evidence:\n- Analysis:\n\n## Conclusion\n- Restate thesis:\n- Summary:\n- Final thought:`,
        tags: ['essay', 'outline', 'writing']
      });
    }

    if (title.includes('presentation') || title.includes('present') || description.includes('present')) {
      baseTemplates.push({
        title: `${assignment.title} - Presentation Notes`,
        content: `# Presentation: ${assignment.title}\n\n## Slide Outline\n1. Title Slide\n2. Agenda\n3. Main Content\n4. Conclusion\n5. Q&A\n\n## Key Messages\n- \n\n## Visual Elements\n- \n\n## Speaking Notes\n- `,
        tags: ['presentation', 'slides', 'speaking']
      });
    }

    if (title.includes('code') || title.includes('programming') || title.includes('software')) {
      baseTemplates.push({
        title: `${assignment.title} - Code Planning`,
        content: `# Code Planning: ${assignment.title}\n\n## Requirements\n- \n\n## Architecture\n- \n\n## Implementation Steps\n1. \n\n## Testing Plan\n- \n\n## Code Snippets\n\`\`\`\n// Add code here\n\`\`\``,
        tags: ['coding', 'programming', 'planning']
      });
    }

    return baseTemplates;
  };

  const templates = getAssignmentTemplates();

  return (
    <div className="note-suggestions">
      <h4>Quick Start Templates</h4>
      <div className="template-grid">
        {templates.map((template, index) => (
          <div 
            key={index}
            className="template-card"
            onClick={() => onSelectTemplate(template)}
          >
            <h5>{template.title}</h5>
            <div className="template-tags">
              {template.tags.map(tag => (
                <span key={tag} className="tag tag--small">{tag}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};