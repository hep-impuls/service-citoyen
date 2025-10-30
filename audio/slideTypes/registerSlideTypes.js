import { BaseSlideType } from './baseSlideType.js';
import { TitleSlideType } from './titleSlideType.js';
import { ClassicBulletPointSlideType } from './classicBulletPointSlideType.js';
import { OnlyTextSlideType } from './onlyTextSlideType.js';
import { QuoteSlideType } from './quoteSlideType.js';
import { AVsBSlideType } from './aVsBSlideType.js';  // Added this import
import { TableOfContentSlideType } from './tableOfContentSlideType.js';
import { OnlyImageSlideType } from './onlyImageSlideType.js';
import { ReflectiveQuestionSlideType } from './reflectiveQuestionSlideType.js';
import { ConceptMapSlideType } from './conceptMapSlideType.js';
import { ExampleSlideType } from './exampleSlideType.js';
import { QuestionPromptSlideType } from './questionPromptSlideType.js';
import { VisualMetaphorSlideType } from './visualMetaphorSlideType.js';
import { KeyPointsSlideType } from './keyPointsSlideType.js';
import { TimelineSlideType } from './timelineSlideType.js';
import { KeyDefinitionSlideType } from './keyDefinitionSlideType.js';
import { SlideTypeRegistry } from './slideTypeRegistry.js';

// Create a global registry instance
const slideTypeRegistry = new SlideTypeRegistry();

// Register all slide types
slideTypeRegistry.register('title', TitleSlideType);
slideTypeRegistry.register('classic_bullet_point', ClassicBulletPointSlideType);
slideTypeRegistry.register('only_text', OnlyTextSlideType);
slideTypeRegistry.register('quote', QuoteSlideType);
slideTypeRegistry.register('a_vs_b', AVsBSlideType);
slideTypeRegistry.register('table_of_content', TableOfContentSlideType);
slideTypeRegistry.register('only_image', OnlyImageSlideType);
slideTypeRegistry.register('reflective_question', ReflectiveQuestionSlideType);
slideTypeRegistry.register('concept_map', ConceptMapSlideType);
slideTypeRegistry.register('example', ExampleSlideType);
slideTypeRegistry.register('question_prompt', QuestionPromptSlideType);
slideTypeRegistry.register('visual_metaphor', VisualMetaphorSlideType);
slideTypeRegistry.register('key_points', KeyPointsSlideType);
slideTypeRegistry.register('timeline', TimelineSlideType);
slideTypeRegistry.register('key_definition', KeyDefinitionSlideType);

export { slideTypeRegistry };