module.exports = function( grunt ) {

  'use strict';

  grunt.initConfig({
    jshint : {
      options : {
        curly    : true,
        eqeqeq   : true,
        loopfunc : true,
        forin    : false,
        immed    : true,
        latedef  : true,
        newcap   : true,
        noarg    : true,
        sub      : true,
        undef    : true,
        boss     : true,
        eqnull   : true,
        node     : true,
        es5      : true,
        supernew : true,
        laxbreak : true,
        strict   : false,
        expr     : true,
        globals: {

        }
      },

      files : [
        '**/*.js'
      ]
    },

    watch : {
      jshint : {
        files : [
          '**/*.js',        ],
        tasks : ['jshint']
      }
    },

    clean : {
      test : ['test/deploys/instance1']
    }

  });

  // Loading of NPM tasks
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');

};
