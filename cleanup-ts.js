const fs = require('fs');

const replaceInFile = (file, replacements) => {
  if (!fs.existsSync(file)) return;
  let content = fs.readFileSync(file, 'utf8');
  replacements.forEach(([regex, replacement]) => {
    content = content.replace(regex, replacement);
  });
  fs.writeFileSync(file, content, 'utf8');
};

// 1. Models
replaceInFile('backend/src/models/Task.js', [
  [/export type TaskPriority = 'low' \| 'medium' \| 'high';\nexport type TaskStatus = 'pending' \| 'in-progress' \| 'completed';\n\nexport interface ITask \{[\s\S]*?\}/, '']
]);
replaceInFile('backend/src/models/Category.js', [
  [/export interface ICategory \{[\s\S]*?\}/, '']
]);

// 2. Error Handler
replaceInFile('backend/src/middleware/errorHandler.js', [
  [/import \{ Request, Response, NextFunction \} from 'express';\nimport \{ ZodError \} from 'zod';\n/, ''],
  [/\(req: Request, res: Response\)/g, '(req, res)'],
  [/\(err: unknown, req: Request, res: Response, next: NextFunction\)/g, '(err, req, res, next)']
]);

// 3. Controllers
const stripControllerTypes = [
  [/import \{ Response \} from 'express';\n/, ''],
  [/import \{ AuthedRequest \} from '\.\.\/middleware\/auth';\n/, ''],
  [/\(req: AuthedRequest, res: Response\)/g, '(req, res)']
];
replaceInFile('backend/src/controllers/category.controller.js', stripControllerTypes);
replaceInFile('backend/src/controllers/task.controller.js', stripControllerTypes);

// 4. Async Handler
replaceInFile('backend/src/utils/asyncHandler.js', [
  [/import \{ Request, Response, NextFunction, RequestHandler \} from 'express';\n/, ''],
  [/\(req: Request, res: Response, next: NextFunction\)/g, '(req, res, next)'],
  [/export const asyncHandler = \(fn: RequestHandler\): RequestHandler => \{/g, 'export const asyncHandler = (fn) => {']
]);

// 5. Frontend Components
replaceInFile('frontend/src/components/SearchBar/SearchBar.jsx', [
  [/interface SearchBarProps \{[\s\S]*?\}\n/, ''],
  [/: React\.FC<SearchBarProps>/g, '']
]);
replaceInFile('frontend/src/components/TaskStatusSelector/TaskStatusSelector.jsx', [
  [/interface TaskStatusSelectorProps \{[\s\S]*?\}\n/, ''],
  [/: React\.FC<TaskStatusSelectorProps>/g, '']
]);

// 6. DB Config
replaceInFile('backend/src/config/db.js', [
  [/\(\): Promise<void>/g, '()']
]);

console.log('TypeScript types stripped manually.');
