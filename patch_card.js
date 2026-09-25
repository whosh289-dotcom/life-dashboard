const fs = require('fs');
const file = 'src/components/documents/DocumentCard.jsx';
let content = fs.readFileSync(file, 'utf8');

// Replace the motion.div opening tag to add onClick and cursor-pointer
content = content.replace(
    /className=\{\`bg-card rounded-2xl border p-5 hover:shadow-md transition-all duration-300 \$\{/g,
    \`onClick={() => doc.file_url && window.open(doc.file_url, '_blank')}
      className={\\\`bg-card rounded-2xl border p-5 hover:shadow-md transition-all duration-300 \${doc.file_url ? 'cursor-pointer hover:border-primary/50' : ''} \${\`
);

// Add stopPropagation to DropdownMenuTrigger to prevent opening file when clicking menu
content = content.replace(
    /<DropdownMenuTrigger asChild>/,
    `<DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>`
);

fs.writeFileSync(file, content);
