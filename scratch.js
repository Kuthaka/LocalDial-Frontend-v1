const fs = require('fs');
let content = fs.readFileSync('src/app/(auth)/business/signup/page.tsx', 'utf8');

// Replace input outlines
content = content.replace(/focus:ring-2 focus:ring-\[#111844\]/g, 'focus:ring-4 focus:ring-[#104825]/10 focus:border-[#104825] transition-all');

// Replace the blue 'Save and Continue' buttons
content = content.replace(/bg-\[#0a84e3\] hover:bg-\[#0971c2\]/g, 'bg-[#104825] hover:bg-[#0c361c] shadow-[0_8px_30px_rgba(16,72,37,0.2)] hover:shadow-[0_8px_30px_rgba(16,72,37,0.3)] hover:-translate-y-0.5 active:translate-y-0');

// Replace blue text links (+ Add Mobile Number etc)
content = content.replace(/text-\[#0a84e3\]/g, 'text-[#104825]');

// Replace day selection active state
content = content.replace(/bg-\[#111844\] text-white border-\[#111844\]/g, 'bg-[#104825] text-white border-[#104825] shadow-md');

// Also update the timing confirmation modal colors
content = content.replace(/text-slate-800/g, 'text-[#1c2331]');

fs.writeFileSync('src/app/(auth)/business/signup/page.tsx', content);
