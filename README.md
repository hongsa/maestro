## Classting Data Dashboard

This dashboard displays statistics and patterns of Classting data which is based on logs sent from clients.


- [SB Admin for Angular](https://github.com/start-angular/sb-admin-angular) is used for base theme.
- But the apllication structure is modified to "Folders-by-Feature Structure" instead of "Folders-by-Type Structure".
- If you're unfamiliar with this structure, then please read this [AngularJS Style Guide](https://github.com/johnpapa/angular-styleguide).
- [Dreamfactory](https://www.dreamfactory.com/) is used for some of backend works (auth, remote web services, DB).
- Log data is fetched from [Elasticsearch](https://www.elastic.co/products/elasticsearch).


## Installation
####1. Clone this project or Download that ZIP file

```sh
$ git clone http://{your-stash-id}@stash.classting.net/scm/op/da-dashboard.git
```


####2.  Make sure you have [bower](http://bower.io/), [grunt-cli](https://www.npmjs.com/package/grunt-cli) and  [npm](https://www.npmjs.org/) installed globally
 
 
```sh
$ sudo apt-get install npm
$ sudo npm install -g grunt-cli
$ sudo npm install -g bower
```


####3. On the command prompt run the following commands

```sh
$ cd {project-directory}
```
- bower install is ran from the postinstall

```sh
$ npm install 
```
- a shortcut for `grunt serve` to run this project

```sh
$ npm start
```
- a shortcut for `grunt serve:dist` to minify the files for deployment and run this project

```sh
$ npm run dist 
```


**Note:**
If you get this following error, 


```text
Error: EACCES, permission denied '.config/configstore/insight-bower.yml'
You don't have access to this file.
```


change owner of .config

```sh
sudo chown -R [user name] ~/.config
```


### Automation tools

- [Grunt](http://gruntjs.com/)