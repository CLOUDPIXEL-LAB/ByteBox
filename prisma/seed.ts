/**
 * ByteBox - Database Seed Script
 * Made with ❤️ by Pink Pixel
 */

import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import path from 'node:path';

// Get the database path from env, removing 'file:' prefix if present
let dbPath = process.env.DATABASE_URL?.replace('file:', '') || './prisma/dev.db';

// If it's a relative path, resolve it from the project root
if (dbPath.startsWith('./') || dbPath.startsWith('../')) {
  dbPath = path.resolve(process.cwd(), dbPath);
}

const adapter = new PrismaBetterSqlite3({ url: dbPath });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Seeding database...');

  // Create tags
  const tagReact = await prisma.tag.create({
    data: {
      name: 'React',
      color: '#61dafb',
    },
  });

  const tagTypeScript = await prisma.tag.create({
    data: {
      name: 'TypeScript',
      color: '#3178c6',
    },
  });

  const tagDocker = await prisma.tag.create({
    data: {
      name: 'Docker',
      color: '#2496ed',
    },
  });

  const tagGit = await prisma.tag.create({
    data: {
      name: 'Git',
      color: '#f05032',
    },
  });

  console.log('✅ Created tags');

  // Create categories
  const catBookmarks = await prisma.category.create({
    data: {
      name: 'Bookmarks',
      description: 'Useful links and resources',
      color: '#ec4899',
      order: 0,
    },
  });

  const catSnippets = await prisma.category.create({
    data: {
      name: 'Code Snippets',
      description: 'Reusable code blocks',
      color: '#8b5cf6',
      order: 1,
    },
  });

  const catCommands = await prisma.category.create({
    data: {
      name: 'Commands',
      description: 'CLI commands and scripts',
      color: '#06b6d4',
      order: 2,
    },
  });

  const catDocs = await prisma.category.create({
    data: {
      name: 'Documentation',
      description: 'Reference docs and guides',
      color: '#f59e0b',
      order: 3,
    },
  });

  const catImages = await prisma.category.create({
    data: {
      name: 'Images',
      description: 'Screenshots and visual references',
      color: '#10b981',
      order: 4,
    },
  });

  const catNotes = await prisma.category.create({
    data: {
      name: 'Notes',
      description: 'Quick notes and thoughts',
      color: '#a855f7',
      order: 5,
    },
  });

  console.log('✅ Created categories');

  // Create example cards
  await prisma.card.create({
    data: {
      type: 'bookmark',
      title: 'React Documentation',
      description: 'Official React docs - hooks, components, and more',
      content: 'https://react.dev',
      categoryId: catBookmarks.id,
      order: 0,
      tags: {
        connect: [{ id: tagReact.id }],
      },
    },
  });

  await prisma.card.create({
    data: {
      type: 'bookmark',
      title: 'TypeScript Handbook',
      description: 'Complete guide to TypeScript',
      content: 'https://www.typescriptlang.org/docs/',
      categoryId: catBookmarks.id,
      order: 1,
      tags: {
        connect: [{ id: tagTypeScript.id }],
      },
    },
  });

  await prisma.card.create({
    data: {
      type: 'snippet',
      title: 'React Custom Hook - useLocalStorage',
      description: 'Hook for syncing state with localStorage',
      content: `import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : initialValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue] as const;
}`,
      language: 'typescript',
      categoryId: catSnippets.id,
      order: 0,
      tags: {
        connect: [{ id: tagReact.id }, { id: tagTypeScript.id }],
      },
    },
  });

  await prisma.card.create({
    data: {
      type: 'snippet',
      title: 'Tailwind CSS Gradient Text',
      description: 'Pink/purple gradient text effect',
      content: `<h1 className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
  ByteBox
</h1>`,
      language: 'tsx',
      categoryId: catSnippets.id,
      order: 1,
      tags: {
        connect: [{ id: tagReact.id }],
      },
    },
  });

  await prisma.card.create({
    data: {
      type: 'command',
      title: 'Docker Cleanup',
      description: 'Remove all stopped containers and unused images',
      content: 'docker system prune -af --volumes',
      categoryId: catCommands.id,
      order: 0,
      tags: {
        connect: [{ id: tagDocker.id }],
      },
    },
  });

  await prisma.card.create({
    data: {
      type: 'command',
      title: 'Git Reset Last Commit',
      description: 'Undo last commit but keep changes',
      content: 'git reset --soft HEAD~1',
      categoryId: catCommands.id,
      order: 1,
      tags: {
        connect: [{ id: tagGit.id }],
      },
    },
  });

  await prisma.card.create({
    data: {
      type: 'doc',
      title: 'Next.js Server Actions',
      description: 'Guide to using server actions in Next.js 15',
      content: `## Server Actions in Next.js 15

Server Actions allow you to run server-side code directly from client components.

### Example:
\`\`\`typescript
'use server'

export async function createCard(formData: FormData) {
  const title = formData.get('title');
  // Process on server...
}
\`\`\`

Use with forms:
\`\`\`tsx
<form action={createCard}>
  <input name="title" />
  <button type="submit">Create</button>
</form>
\`\`\``,
      categoryId: catDocs.id,
      order: 0,
      tags: {
        connect: [{ id: tagReact.id }, { id: tagTypeScript.id }],
      },
    },
  });

  // Example image card (placeholder with actual image data)
  await prisma.card.create({
    data: {
      type: 'image',
      title: 'ByteBox Placeholder',
      description: 'Example image card - your screenshots go here',
      content: 'placeholder.png',
      // Simple pink/purple gradient placeholder image (400x300 PNG)
      imageData: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAZAAAAEsCAYAAADtt+XCAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAABFWSURBVHgB7d1bbBTXHcfxX2Z3vV7ba3ttMNgYTAAmJCFpQkNVIaVKWx5aqahVH6q+VE2lqlKlPlSqVKmqWqmq1IdKfUmlqlWfqj5UakWVtlLVNmlpSENSEkIgBnO/2Yuxd3fXOzvj9ZrYQALZsWf3+5FW9u7O7HrmYJ/fn//5nzOWAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA8C/2v+Lz1vMvuD+WDU+yAKCMO2vXfTH5Yq9Z//XLJ8yCt39+L/LF3K26u7MPAIA/u9WN9a+f+uyFgb7+JjMSebLv7e//eNd23b8yI5HH+t4+9MOdAADcwbFcn5tLX71+68yXl27d/Mz6zZt/e/nm9a9cvDH8tQvXr3317NDQlpHRyFqVcgAAlOTBZTUr3Hzm1kcXLr13/PTJo8ePHTv2ztFj/+s4ffpXZ86efWZ4ZKS5UIyaS6urIZHLWn8W/l+98Vop74PuWQDw5gj5qrGxsbXOmXOnT50+eerkyZOnTpw8eerEiVN/PnHy1LGTp04dHxqKdCZyWTt8/w8/CncPAICSRqNR/9HM3Ovnz184duzYsffee/+Dd9575/0PVb+8/I8PP/zoT0ePHv3g6tixVT0bq83q6mq7traurqamJlhdHTR75ufnH+zr6/soHP0YF5MfmbPaAAALXlW1r6ZxTVP1wtp1Dx3cvWv3gd07d+/bs2fPvj17d+/bu2fvnu/39O8+cOjRQzu2b+7dvXNH74a1bRtW16+aW1Vd5Xqua3lVVX6rqrLCu+fKdg/2rl/7yK4t+3Zs2LZ1bfvBfTsO7tmzYu+uHZ/1bt/c3duzbc/enl09nZ2dX1nZsqIYDvnM07/6y5Y9+x7+x/HTJ1+fmJp8MD+fZ58WgBWrxrZ9dcsaGts6OtZt2Lxp8+YtW7Zv3bpV2bJpw/aODV3rO9a1be5s29S5tn31um1b1m/Y0LGho6trS2vr6i3Na1s3tLS2bmheu3Fj/ao9e3d2dXd1LZrZNfNs77amzjWr1q1e3bRmTXPrhpbN27q7t3V3dW/qXNvZvq6zc01b26b1a9e2rV3f0b5mw7p1bd1d27q7Ozq62tpaO1s71rVu3djV2bmpra0wFt3d/eDUdIXa76U9f/zVR0dPnf3Z+anpv4aj5gWVsNhIk0t7APiS5OO2XX7q5WIsdmu0PW5Nnzh+/MTb7775t3feeefv77777j/ee+edw2+9dfjIkSNHDh8+cuTtt488Mzw8nE1mMqvOnTv3jQsXLuzv7+/Pjo+PewuFgq1KKZVKvtHRUe/MmTORL3zhC8uvXr36w97e3njXw3t+OjQ42D4yMlJTKuQi//qf/xo4f+FC7ebte54dHh2+NBDuf3gk/B1Hjhx57ciRI6+Mjo5W9sxfALgTNfvqrbq6OldfXx+sb6j3VVVXhVsjzY3+urq6YFW1z6sKVlUFqqqqrGBVVaCmpsZuqG9Y2bS6qaGpualuVVP9yvq6Na3trY8cPLD/1weee/5nO7dt+8bKxqafqNKV+vx8y/nz55uvXx/YNjeXa5lOTr995Nixvb19jz5z7dr1P6bT6aqm1a2u47pXz585+93r167t7Bvo/+lA/8Bjg4ODX9y/f//3zl+48LWrl6999/KVy09fvnz50e89fv/zT50+fXJ0ZGQqnU5Hc7ms3bSm+S+WunEAAKU+P29XVVdbWj1tQHNVVeWqrLK8TqDKV2nX1PrUoqtrqquDlf5qf9Bf6fPVBWv9fn/QbwWrfda29Z3tuzevf2xr47qutWs7Gjs7Gjdu2dz+8M72vfv2t6+7//51G9a1P7xpw/p1W7Zv3Lxr17bmtvXrfCrx+evq6k37gD2/dVAp5VTTrO/6+/se/PLuRx5/5kc//J96vVd/uj5WW1trvXfyyInBwaHjczO5x+Zm01dGx0Y/Ghkd+WgwPKb+kXf/+t3xydEz169f/+DAI9/4SkPD6t9t375zJ48JANzyEjTm6eWi5Zl+E7Ns3fj3z0f11pRlWZrWv7TU6tAsy+u1DL0WZet/qceq3+qRui/ZWotpmrZp6rZhGJZhuKZhGK5uaPu8b52XrlTi1HOWrreYpmaYhm4Yhq4Zhu76q1fV17U8cNjQc7eOiXZWjxdcx3W+pqnNK1es+vjSxYvfU20p6qzRba0Y/8HmpgdCRHpu/pZ0W4sXEQD4LOlvZNt1HUuvHo26jV83NNsyLENv+tR3y7IsQ5PjjKZplqG/qV3WpK3fTKHpnPl9zTB+b+javr6+7//+8Z/c/+pP//R/qpxe+uOje1uamrYFAquaJyan+wdHhn44PZP+6szsX++Jx+f+Vnt+f3bkyAtnLlx88eTZ0y+cPXfu+1evXv2BLjmlEpdapGq2bBQD4M5VoqsqlpVSR1gvTpWr1DZy6dJry33//c/+9D+/+MkvvvfKy68++4cf/e7XL/zihef0p+hpqv8r1cGWrr9e97F0lfeYX//0fLrtRxPR9PVzA5d+MT07c/TipYF/JGfyZz5Wj1Mtt1YDgC+DbuiPOI4jl5TSs/PZ+uGRoQ5Dhx9N1/PSEZOlPkv/vHQU0uWjEdXPnpqd+V7/xb7v9V3u/ebwyMSVsenJQtTQe5fauAQsAKx8GxobHpLL+vfW1tb++eTp04mSLSidctTW7/Pbrn7vz155+aVDX3ug+cmWlo5nujo3nevo6F5Y1bBaHRe+ovrT7z5/6OVVa7uyXe0d/Z1tbZ9s7Wo731TXoI+TRnl0/fSL/3j3yGt//surn/q/v+tX/NOLL/70F88/P6Hu78qS/nW15Qvf/sHubXv2DLU/kDy8r//iH/v7h94qJKeu38mD2rn70GcuK6IvAQC+mNvevNRB+lv79cLChS9H/fzZ3/z6yIkTR6+++upzf3n7rRP/PDTwcF/f5d/29/c/2tff96v+vv7n+vr6nnn/vfdfPvreP1+5ePHiz99754PTBw/0PrHzgUMHH//6yT9u2Tx048kjvT87dvz4T/54cOCRM5c+2Tt24dpXz505s/P86VNtx06e3P3RyQ/Xnjlz5itvvfXu+rfeemflG2+8sfKf772+6q23Dz/w1tlT+3oP7t+/f+dTXW1tP1mxYuU/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAwL3NvpefeXPP0Y7OA4c2bHq4q3ntfJPvXnlm2Ovnv3Gy/9QjNwavdU1MTA2MTUz+L44DAMpGd3f3zr6+vt7+/v4jU/FY+/nzZ/dfvHj+e8s/50wskz4wNpr/4er6+iMNq1b9s6am5ojfX/Vxx4aO/oMHD/79gw8+eOPe+VsAgFuXicvq8unGn06PHnjxxRef+c5jhw60trX9Nhj0H6+vr/+kYdWqSx2d7T3d3V0JjgsAltLY1NQ1Ozv73n//9vIv/vLWG7/euG79odXN618bfO+9f9xr1xAAtH++Nt7ft/NqJHE+Go0VHn/0wF+CQf/RRvWXf6xrU/eVf//9gxs9V/c+92T/d/9m3/P7Ixs6uxqvXx/8yeXLl7+qrk17rV8AgEVj0fmhq1cH/rJl6+ZfdXZ2vOpzfB/3bttyrm/H9ov9j+y/1rN3V+Tmv15s3vJwU+PqD5ubm481NTW9vrJl+fCVv/3w7MMPPzI0Njb2zdnZ2YfuYv0UAIDlFG2oq3NU2qpYvG1seGxNf3//zYaOLlXT1dqWVXWZUGSuOWgFQvqrXWfquqHr2rXBq/FgVeBsYOXK4xXB4M1Nndss1Qm/y3QGAJRSyG+fmZ6JqHbr7kYT9b13etJ32TJ1+9Nf1Z5ruq/V/uR13f/JdJ1/R/1u23X/SzkKACiFWgfSR3/z6+M7du28ubm769zq1S2/qa1ZUdrwc6GZGbdu8HH9Y1Y8AKC8aMtCgYDdvLr5hh0MGo3169QPttfvmMC/bjL70Jxr+U3f+QDpCwDKVWN9XfnWf38AAAAAAACgfFmaJaOrWCqlmK11Y4rPKGnfFJTWP2n12n7VfcOwKup1l2r/7WvqtQIV9iof5TAAUJYa6uvKpT84rjH7zBMvZjds7jrf3tb27KrG+m/YtlOfTSTuDweDAy8e6tuydetZf5X/F/WrGl/Z1fPwzsW/m0tUvP/qH/7Y2LWp6+CqxsYfGqZRp/7l6HqMo+wBAAAAAAAAAAAAAAAAAACgHNX4qn5ysffiE2PDQ77+gf4fpJKJxc30+tGYf+5b3/9yd1fX/wAAy8rdro/f0Gr96z++/+fDf33xtSOD1y4/fjMS+frQ8Mj0TGbu1OP7Dzwfqg6+VlFRccKyy+Z8BADK3pL93P+yfv7KlpY1gUDgvYtPP/t0w+r6dOBnn94Pr/72P67luf+fPo6XP/+x/n6ydPnzAQDl/5ND6d/U//XqH0+eefXCpUuf/u8NV5KZ+FNDQ4O/1k3L1t9GrX+p9/qIr9puCAb+r6Yueq1cnnFqmkb+CwDuMst13H9/8mU2m/uvv7L9lSc/8/0+z1k5PT19ufnVL///nfY3AID7QOkjKH/fV9V+8LdnXzp34cK31N/1N31XF/9++bHfG+sauiLRqTdunjo5q+7nsm1b6TFzqcfu9LX+e0TdfXBsdLK//+LlC6rRz9X/7OOXNwEAXzo9FcvV1dTU5FY3rUmsTlq+fCF/+/dDMvGqSiuVTr8SWNnwxvJVK39l2fZlndpUe7M1pW/+YqHws0Ao9Pp/AgAAAAAAAAAAAAAAAPwZ3Mee+Fa+qv5+dbff6Ts3aJlF7yx33fu+f+CJ/T9Y3t8f/P7/ALgfLI1wLqX+j05+6LH/+M3vf/rswYOPxe7JcGH0FQDgP+j/6vVw6fXcXO5Zx3GuWJrWq1Pf9Hf7ewzfV/W+jnQAAPoSc0zDaGprvXFs2/pug+QFANwj8lOzLu0BAMqXbbseXTgAoOyYOPP/ACCpSQQAAAACZmRJZgCgAAAAJQgAAAFfaQRCAAABjklEQVR42u3BAQ0AAADCoPdPbQ8HFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAeBoOAwAAAAACDOMvAgAABHZJREFUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4GVxcPSUAAAABP1/6CqfFwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADuOAgAAAAAAEB/1RRVAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4C8AAAhkQAAAAAD//ySURBVHe3gI/0AAAAASUVORK5CYII=',
      categoryId: catImages.id,
      order: 0,
    },
  });

  await prisma.card.create({
    data: {
      type: 'note',
      title: 'Project Ideas',
      description: 'Random thoughts and brainstorming',
      content: `- Build a Chrome extension for quick bookmarking
- Explore AI integration for auto-tagging
- Add markdown editor for better note formatting
- Consider adding themes/color schemes
- Research export to Notion/Obsidian`,
      categoryId: catNotes.id,
      order: 0,
    },
  });

  console.log('✅ Created example cards');
  console.log('🎉 Seeding complete!');
}

try {
  await main();
  await prisma.$disconnect();
} catch (e) {
  console.error('❌ Error seeding database:', e);
  await prisma.$disconnect();
  process.exit(1);
}
