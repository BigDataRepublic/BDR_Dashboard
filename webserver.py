from flask import Flask, request, send_from_directory, render_template
import mysql.connector

mysqlConnection = mysql.connector.connect(user='BDR', password='BDRforlife',
	host='bdr.cckczjviguyp.us-east-1.rds.amazonaws.com',
	port=3306,
	database='BDR')
mysqlConnection.close()

app = Flask(__name__, static_url_path='')

@app.route('/')
def homepage():
    return render_template('index.html')
    
@app.route('/css/<path:path>')
def send_css(path):
    return send_from_directory('css', path)
    
@app.route('/js/<path:path>')
def send_js(path):
    return send_from_directory('js', path)
    
@app.route('/lib/<path:path>')
def send_lib(path):
    return send_from_directory('lib', path)
    
@app.route('/partials/<path:path>')
def send_partials(path):
    return send_from_directory('partials', path)
    
if __name__ == '__main__':
	app.run(debug=True)