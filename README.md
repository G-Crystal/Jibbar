#Pre-requisite to run the app:

You need to have npm installed in your computer

#Installation:

npm install

#How to run:

npm run dev

#Code structure

####Customizable directives: app/components/builder/customizable
####List: app/components/dashboard/templates
####Builder: app/components/dashboard/templates/builder/:templateId

#About the task

We have a range of email templates in our application. All templates have some customizable attributes in it's elements.
Based on the customizable attributes our email editor(builder) will make the elements customizable by the users of the application.
For example: `<td customizable editable>` will be rendered as an editable section to our user and on click of Edit button an input box
will appear. In addition, our editor will generate a textarea for `<td customizable editable multiline>`.
Here, customizable, editable, multiline are custom attributes and you will find the definitions of these in 
app/components/builder/customizable/customizable.directive.js
Many other customizable attributes are availabe at the directive.

We have another attribute `use-rte` and we want to add a rich text editor for the element having `use-rte` attribute.

For rich text editor please add http://textangular.com/ this plugin.

If you go to app/components/builder/customizable/customizable.html then you will see that for $ctrl.multiline its generating textarea.

Samely we want the editor to generate `text-angular` instead of `textarea` if $ctrl.useRte is true.

#Credentials to login the application

username: fed@jibbar.com
password: fed123456

