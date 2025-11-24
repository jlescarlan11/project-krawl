// Script to trace util._extend deprecation warning
process.on('warning', (warning) => {
  if (warning.name === 'DeprecationWarning' && warning.message.includes('util._extend')) {
    console.error('\n=== DEPRECATION WARNING FOUND ===');
    console.error('Message:', warning.message);
    console.error('\nStack trace:');
    console.error(warning.stack);
    console.error('\n=== END ===\n');
  }
});

// Load Next.js which will trigger the warning
require('next');

