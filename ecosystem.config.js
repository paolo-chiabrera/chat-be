module.exports = {
  'apps' : [{
    'name': 'chat3000',
    'script'    : 'bin/www',
    'instances' : 1,
    'exec_mode' : 'fork',
    'env': {
      'PORT': 3000
    }
  },{
    'name': 'chat3001',
    'script'    : 'bin/www',
    'instances' : 1,
    'exec_mode' : 'fork',
    'env': {
      'PORT': 3001
    }
  }]
};
