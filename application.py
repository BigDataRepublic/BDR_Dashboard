	What Is Elastic Beanstalk and Why Do I Need It?
	Getting Started
	How Does Elastic Beanstalk Work?
	Tutorials
	Managing Applications
	Managing Environments
	Environment Configuration
	Integrating AWS Services
	Tools
	Troubleshooting
	Working with Docker
	Working with Go
	Working with Java
	Working with .NET
	Working with Node.js
	Working with PHP
	Working with Python
		Installing Python
		Installing the AWS Elastic Beanstalk CLI
		Common Steps for Deploying Python Applications
		Deploying a Flask Application
		Deploying a Django Application
		Using Amazon RDS
		Customizing and Configuring a Python Container
		Using the Console
		Tools and Resources
	Working with Ruby
	Resources
	Document History
	Appendix

View the PDF for this guide.Go to the AWS Discussion Forum for this product.Go to the Kindle Store to download this guide in Kindle format.
Deploying a Flask Application

This tutorial walks through the deployment of a simple Flask website using AWS Elastic Beanstalk. It shares many steps with those in Common Steps for Deploying Python Applications. Common steps will often be referenced instead of reiterated; this topic will focus on the minimum setup necessary to deploy a Flask-based Python application on AWS Elastic Beanstalk.

Note

At the time of writing this topic, Flask 0.9 was found to be incompatible with Python 3.4. If you run into issues running Flask with Python 3.4, try using the Python 2.7.x release.

Topics

	Prerequisites
	Set up a virtual Python environment
	Install Flask
	Create a Flask application
	Run the application locally
	Configure your Flask application for AWS Elastic Beanstalk
	Deploy your site using AWS Elastic Beanstalk
	Stopping and Deleting your Environment
	Where do I go from here?

Prerequisites

Important

To use any Amazon Web Service (AWS), including AWS Elastic Beanstalk, you need to have an AWS account and credentials. To learn more and to sign up, visit https://aws.amazon.com/.

To follow this tutorial, you should have all of the Common Prerequisites for Python installed. In addition, the Flask framework will be installed as part of the tutorial.
Set up a virtual Python environment

Once you have the prerequisites installed, set up a virtual environment with virtualenv to install Flask and its dependencies. By using a virtual environment, you can discern exactly which packages are needed by your application so that the required packages are installed on the EC2 instances that are running your application.

Note

For an overview of setting up a virtual Python environment, see Setting up a virtual Python environment in Common Steps for Deploying Python Applications.

To set up your virtual environment

	Open a command-line window and type:

	virtualenv -p python2.7 /tmp/eb_flask_app

	Once your virtual environment is ready, start it by typing:

	. /tmp/eb_flask_app/bin/activate

You will see (eb_flask_app) prepended to your command prompt, indicating that you're in a virtual environment.
Install Flask

Now that the virtual environment has been created and is active, you should install Flask in the environment.

Use pip to install Flask by typing:

pip install Flask

To verify that Flask has been installed, type:

pip freeze

This will list Flask and its dependencies. For example:

Flask==0.10.1
itsdangerous==0.24
Jinja2==2.7.3
MarkupSafe==0.23
Werkzeug==0.10.1

Create a Flask application

Next, create an application that you'll deploy using AWS Elastic Beanstalk. We'll create a "Hello World" RESTful web service.

To create the Hello World Flask application

	Create a directory for your project. Use eb_flask_app to match the environment:

	mkdir eb_flask_app

	With your favorite text editor, create a new text file in this directory called application.py. Add the following contents:

	from flask import Flask

	# print a nice greeting.
	def say_hello(username = "World"):
		return '<p>Hello %s!</p>\n' % username

	# some bits of text for the page.
	header_text = '''
		<html>\n<head> <title>EB Flask Test</title> </head>\n<body>'''
	instructions = '''
		<p><em>Hint</em>: This is a RESTful web service! Append a username
		to the URL (for example: <code>/Thelonious</code>) to say hello to
		someone specific.</p>\n'''
	home_link = '<p><a href="/">Back</a></p>\n'
	footer_text = '</body>\n</html>'

	# EB looks for an 'application' callable by default.
	application = Flask(__name__)

	# add a rule for the index page.
	application.add_url_rule('/', 'index', (lambda: header_text +
		say_hello() + instructions + footer_text))

	# add a rule when the page is accessed with a name appended to the site
	# URL.
	application.add_url_rule('/<username>', 'hello', (lambda username:
		header_text + say_hello(username) + home_link + footer_text))

	# run the app.
	if __name__ == "__main__":
		# Setting debug to True enables debug output. This line should be
		# removed before deploying a production app.
		application.debug = True
		application.run()