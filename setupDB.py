import mysql.connector
from mysql.connector import errorcode

mysqlConnection = mysql.connector.connect(user='BDR', password='BDRforlife',
	host='bdr.cckczjviguyp.us-east-1.rds.amazonaws.com',
	port=3306,
	database='BDR')
	
query = mysqlConnection.cursor()

#Creating tables

tables = {}
tables['skillMatrix'] = (
	"	DROP TABLE IF EXISTS `skillMatrix`;"
	"	CREATE TABLE `skillMatrix` ("
    "  `skill_name` varchar(100) NOT NULL,"
    "  `skill_group_name` varchar(100) NOT NULL,"
    "  PRIMARY KEY (`skill_name`, `skill_group_name`)"
    ") ENGINE=InnoDB")
    
tables['skillGroups'] = (
	"	DROP TABLE IF EXISTS `skillGroups`;"
	"	CREATE TABLE `skillGroups` ("
	"  `skill_group_name` varchar(100) NOT NULL,"
	"  PRIMARY KEY (`skill_group_name`)"
	") ENGINE=InnoDB")
    
tables['accounts'] = (
	"	DROP TABLE IF EXISTS `accounts`;"
	"	CREATE TABLE `accounts` ("
	"  `user_name` varchar(100) NOT NULL,"
	"  `password` varchar(100) NOT NULL,"
	"  PRIMARY KEY (`user_name`)"
	") ENGINE=InnoDB")
	
tables['scorings'] = (
	"	DROP TABLE IF EXISTS `scorings`;"
	"	CREATE TABLE `scorings` ("
	"  `user_name` varchar(100) NOT NULL,"
	"  `skill_name` varchar(100) NOT NULL,"
	"  `score` int(10) NOT NULL,"
	"  PRIMARY KEY (`user_name`, `skill_name`)"
	") ENGINE=InnoDB")
	
#Data insert functions
add_skill = ("INSERT INTO skillMatrix "
	"(skill_name, skill_group_name) "
	"VALUES (%s, %s)")

add_skillGroup = ("INSERT INTO skillGroups "
	"(skill_group_name) "
	"VALUES (%s)")

add_account = ("INSERT INTO accounts "
	"(user_name, password) "
	"VALUES (%s, %s)")

add_scoring = ("INSERT INTO scorings "
	"(user_name, skill_name, score) "
	"VALUES (%s, %s, %s)")

skill_data = []
skill_data.append(("angularjs", "frontend"))
skill_data.append(("javascript", "frontend"))
skill_data.append(("javascript", "frontend"))
skill_data.append(("html", "frontend"))

for name, tableQuery in tables.iteritems():
	try:
		print("Creating table ",name)
		query.execute(tableQuery, multi=True)
	except mysql.connector.Error as error:
		if error.errno == errorcode.ER_TABLE_EXISTS_ERROR:
			print("already exists.")
		else:
			print(error.msg)
	else:
			print("OK")
			
query.close()
query = mysqlConnection.cursor()
			
for skill in skill_data:
	try:
		print "Adding ", skill
		query.execute(add_skill, skill)
		mysqlConnection.commit()
		query.close()
		query = mysqlConnection.cursor()
	except mysql.connector.Error as error:
		print(error.msg)
	else:
		print("OK")
		
query.close()
mysqlConnection.close()