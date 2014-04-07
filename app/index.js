'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var colors = require('colors');
var _s = require('underscore.string');


var JerseyAngularGenerator = module.exports = function JerseyAngularGenerator(args, options, config) {
    yeoman.generators.Base.apply(this, arguments);

    this.on('end', function() {
        this.installDependencies({skipInstall: options['skip-install']});
    });

    this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));
};

util.inherits(JerseyAngularGenerator, yeoman.generators.Base);

JerseyAngularGenerator.prototype.askFor = function askFor() {
    var cb = this.async();
    var maxArgs = 5;
    var lengthArgs = process.argv.length;

    if (lengthArgs >= 4 && process.argv.length <= maxArgs) {
        console.log("Project name : ".bold + process.argv[3]);
        var path = "projects/" + process.argv[3] + "/";
        if(lengthArgs == 5) {
            path = process.argv[4];
        }
        console.log("Project path : ".bold + path);
        var prompts = [];
        this.prompt(prompts, function() {
            this.baseName = process.argv[3];
            this.groupArtifactName = "com.cgi.javaforge";
            cb();
        }.bind(this));
    } else if(lengthArgs > maxArgs) {
        console.log("> " + "Error :".red.bold + " too many arguments. Expected syntax : yo jersey-angular-master [optional]projectName [optional]projectPath");
    } else {
        console.log("> " + "Warning :".red.bold + " expected at least 1 parameter to autolaunch. Will launch normal Yeoman instance.");
        console.log(this.yeoman);
        var prompts = [{
                type: 'input',
                name: 'baseName',
                message: '(1/2) What is the name of your application?',
                default: 'myJerseyAngularApp'
            },
            {
                type: 'input',
                name: 'groupArtifactName',
                message: '(2/2) What is the group id of your application?',
                default: 'com.cgi.javaforge'
            }
        ];
        this.prompt(prompts, function(props) {
            this.baseName = props.baseName;
            this.groupArtifactName = props.groupArtifactName;
            cb();
        }.bind(this));
    }
};

JerseyAngularGenerator.prototype.app = function app() {
    this.template('_package.json', 'package.json');
    this.template('_bower.json', 'bower.json');
    this.template('bowerrc', '.bowerrc');
    this.template('_pom.xml', 'pom.xml');

    // Create Java resource files
    this.packageAppName = _s.camelize(this.baseName.toLowerCase());
    var packageFolder = this.groupArtifactName.replace(/\./g, '/');
    var srcDir = 'src/main/java/';
    this.mkdir(srcDir);
    var resourceDir = 'src/main/resources/';
    this.mkdir(resourceDir);
    var testDir = 'src/test/java/';
    this.mkdir(testDir);
    var testResourceDir = 'src/test/resources/';
    this.mkdir(testResourceDir);
    //Service Rest
    this.template(srcDir + '/web/rest/_Account.java', srcDir + '/web/rest/Account.java');
    //Service security
    this.template(srcDir + '/security/_AjaxAuthenticationFailureHandler.java', srcDir + '/security/AjaxAuthenticationFailureHandler.java');
    this.template(srcDir + '/security/_AjaxAuthenticationSuccessHandler.java', srcDir + '/security/AjaxAuthenticationSuccessHandler.java');
    this.template(srcDir + '/security/_AjaxLogoutSuccessHandler.java', srcDir + '/security/AjaxLogoutSuccessHandler.java');
    this.template(srcDir + '/security/_Http401UnauthorizedEntryPoint.java', srcDir + '/security/Http401UnauthorizedEntryPoint.java');
    this.template(srcDir + '/domain/_UserBean.java', srcDir + '/domain/UserBean.java');
    this.template(srcDir + '/security/_SecurityUtils.java', srcDir + '/security/SecurityUtils.java');

    this.template(resourceDir + '_logback.xml', resourceDir + 'logback.xml');
    this.template(resourceDir + '/META-INF/_persistence.xml', resourceDir + '/META-INF/persistence.xml');
    this.copy(resourceDir + 'ehcache.xml', resourceDir + 'ehcache.xml');


    // Create Webapp
    var webappDir = 'src/main/webapp/';
    this.mkdir(webappDir);
    this.mkdir(webappDir + 'WEB-INF');
    this.template(webappDir + 'WEB-INF/_web.xml', webappDir + 'WEB-INF/web.xml');
    this.template(webappDir + 'WEB-INF/security/_applicationContext-security.xml', webappDir + 'WEB-INF/security/applicationContext-security.xml');
    var webappResourcesDir = webappDir + 'resources/';
    this.mkdir(webappResourcesDir);

    // Images
    this.copy(webappResourcesDir + 'images/glyphicons-halflings.png', webappResourcesDir + 'images/glyphicons-halflings.png');
    this.copy(webappResourcesDir + 'images/glyphicons-halflings-white.png', webappResourcesDir + 'images/glyphicons-halflings-white.png');
    this.copy(webappResourcesDir + 'styles/bootstrap.css', webappResourcesDir + 'styles/bootstrap.css');
    this.copy(webappResourcesDir + 'styles/main.css', webappResourcesDir + 'styles/main.css');
    // Fonts
    this.copy(webappResourcesDir + 'fonts/glyphicons-halflings-regular.eot', webappResourcesDir + 'fonts/glyphicons-halflings-regular.eot');
    this.copy(webappResourcesDir + 'fonts/glyphicons-halflings-regular.svg', webappResourcesDir + 'fonts/glyphicons-halflings-regular.svg');
    this.copy(webappResourcesDir + 'fonts/glyphicons-halflings-regular.ttf', webappResourcesDir + 'fonts/glyphicons-halflings-regular.ttf');
    this.copy(webappResourcesDir + 'fonts/glyphicons-halflings-regular.woff', webappResourcesDir + 'fonts/glyphicons-halflings-regular.woff');
    // CSS
    this.copy(webappResourcesDir + 'styles/documentation.css', webappResourcesDir + 'styles/documentation.css');
    // Angular JS views
    this.angularAppName = _s.camelize(this.baseName) + 'App';
    //I18N
    this.template(webappResourcesDir + 'i18n/_en.json', webappResourcesDir + 'i18n/en.json');
    this.template(webappResourcesDir + 'i18n/_fr.json', webappResourcesDir + 'i18n/fr.json');
    // Index page  
    this.indexFile = this.readFileAsString(path.join(this.sourceRoot(), webappDir + '_index.html'));
    this.indexFile = this.engine(this.indexFile, this);
    var bowerComponentRepository = 'resources/jslib/';
    this.indexFile = this.appendScripts(this.indexFile, 'resources/scripts/scripts.js', [
        bowerComponentRepository + 'jquery/jquery.js',
        bowerComponentRepository + 'angular/angular.js',
        bowerComponentRepository + 'angular-route/angular-route.js',
        bowerComponentRepository + 'angular-resource/angular-resource.js',
        bowerComponentRepository + 'angular-cookies/angular-cookies.js',
        bowerComponentRepository + 'angular-sanitize/angular-sanitize.js',
        bowerComponentRepository + 'angular-translate/angular-translate.js',
        bowerComponentRepository + 'angular-translate-storage-cookie/angular-translate-storage-cookie.js',
        bowerComponentRepository + 'angular-translate-loader-static-files/angular-translate-loader-static-files.js',
        'resources/scripts/app.js',
        'resources/scripts/controllers.js',
        'resources/scripts/services.js',
        'resources/scripts/directives.js',
        bowerComponentRepository + 'sass-bootstrap/js/affix.js',
        bowerComponentRepository + 'sass-bootstrap/js/alert.js',
        bowerComponentRepository + 'sass-bootstrap/js/dropdown.js',
        bowerComponentRepository + 'sass-bootstrap/js/tooltip.js',
        bowerComponentRepository + 'sass-bootstrap/js/modal.js',
        bowerComponentRepository + 'sass-bootstrap/js/transition.js',
        bowerComponentRepository + 'sass-bootstrap/js/button.js',
        bowerComponentRepository + 'sass-bootstrap/js/popover.js',
        bowerComponentRepository + 'sass-bootstrap/js/carousel.js',
        bowerComponentRepository + 'sass-bootstrap/js/scrollspy.js',
        bowerComponentRepository + 'sass-bootstrap/js/collapse.js',
        bowerComponentRepository + 'sass-bootstrap/js/tab.js'
    ]);
    this.write(webappDir + 'index.html', this.indexFile);
    //Other pages
    this.copy(webappDir + 'views/index.html', webappDir + 'views/index.html');
    this.copy(webappDir + 'views/login.html', webappDir + 'views/login.html');
    this.copy(webappDir + 'views/profil.html', webappDir + 'views/profil.html');

    // JavaScript
    this.template(webappResourcesDir + 'scripts/_app.js', webappResourcesDir + 'scripts/app.js');
    this.template(webappResourcesDir + 'scripts/_controllers.js', webappResourcesDir + 'scripts/controllers.js');
    this.template(webappResourcesDir + 'scripts/_services.js', webappResourcesDir + 'scripts/services.js');
    this.template(webappResourcesDir + 'scripts/_directives.js', webappResourcesDir + 'scripts/directives.js');

    // Static html resources
    this.copy(webappDir + '404.html', webappDir + '404.html');
    this.copy(webappDir + '500.html', webappDir + '500.html');


};

JerseyAngularGenerator.prototype.projectfiles = function projectfiles() {
    this.copy('editorconfig', '.editorconfig');
    this.copy('jshintrc', '.jshintrc');
};
