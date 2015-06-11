from flask import Flask
import json
import mysql.connector

mysqlConnection = mysql.connector.connect(user='BDR', password='BDRforlife',
	host='bdr.cckczjviguyp.us-east-1.rds.amazonaws.com',
	port=3306,
	database='BDR')

app = Flask(__name__)

add_skill = ("INSERT INTO skillMatrix "
	"(skill_name, skill_group_name) "
	"VALUES (%s, %s)")

@app.route('/skills')
def send_partials():
	cursor = mysqlConnection.cursor()
	query = ("SELECT * FROM skillMatrix")
	try:
		cursor.execute(query)
	except mysql.connector.Error as error:
		print(error.msg)
	else:
		print("Query succeeded")
	result = []
	for name, group in cursor:
		print name, group
		result.append({"name": name, "group": group})
	cursor.close()
	print result
	return json.dumps(result)
    
if __name__ == '__main__':
	app.run(debug=True)