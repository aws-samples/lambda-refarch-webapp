module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    // Begin grunt-phantomas config
    // https://github.com/stefanjudis/grunt-phantomas/blob/master/README.md
    phantomas: {
      index: {
        options: {
          indexPath  : './phantomas/index/',
          // phantomas options passed directly to exec
          // https://github.com/macbre/phantomas
          options: {
            timeout: 30,
            'film-strip': false
          },
          url: 'http://serverless-blog.s3-website-us-east-1.amazonaws.com',
          buildUi: true,
          numberOfRuns: 30
        }
      },
      login: {
        options: {
          indexPath: './phantomas/login/',
          options: {},
          url: 'https://n3a93skkc9.execute-api.us-east-1.amazonaws.com/prod/login',
          buildUi: true
        }
      }
    }
    // End grunt-phantomas config
  });

  grunt.loadNpmTasks('grunt-phantomas');
  grunt.registerTask('default', ['phantomas:index']);
};