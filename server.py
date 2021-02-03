# GameScore server
# Nathan J. McNany, Joshua Benjamin 2021

import mysql.connector
import secrets

# Setup
from flask import Flask, render_template, request, url_for, flash, redirect, Response,make_response
app = Flask(__name__)
app.config["SEND_FILE_MAX_AGE_DEFAULT"] = 0  # Always do a complete refresh (for now)


#Establish DB Connection
mydb = mysql.connector.connect(
  host="10.31.105.16",
  user="GameScore",
  password="password",
  database="gamescore"
)

#Test DB Connection, will print out number in console
mycursor = mydb.cursor()

mycursor.execute("SELECT userID from appuser")

myresult = mycursor.fetchall()

for x in myresult:
  print(x)


# Cleanup function
@app.teardown_appcontext
def cleanup(exception):
    # Do something, Taipu
    pass

#Routes
@app.route("/profile/")
def profileGET():
    return render_template("profile.html")

@app.route("/join/")
def joinGET():
    return render_template("join.html")

@app.route("/play/")
def playGET():
    return render_template("play.html")

@app.route("/mytemplates/")
def myTemplatesGET():
    return render_template("mytemplates.html")

@app.route("/postgame/")
def postGameGET():
    return render_template("postgame.html")

@app.route("/logout/")
def logoutGET():
    #Clear Auth Cookies
    response = make_response(redirect('/home/'))
    response.set_cookie('credHash',"",max_age=0)
    response.set_cookie('username',"",max_age=0) 
    return response

@app.route('/createaccount/')
def createAccountGET():
    return render_template('createaccount.html')

@app.route('/createaccount/', methods=['POST'])
def createAccountPost():
    #Get Values
    username = request.form.get('username')
    password = request.form.get('password')
    email = request.form.get('email')

    #Check DB for dupe email
    mycursor = mydb.cursor(prepared=True)
    stmtCheckEmail = (
        "select userID from appuser where email = %s"
    )
    mycursor.execute(stmtCheckEmail,(email,))
    myresult = mycursor.fetchone()

    #If email not already in DB, create account updating DB
    if myresult == None:
        mycursor = mydb.cursor(prepared=True)
        stmtAddUser = ( "INSERT INTO AppUser(username,userPassword,email) VALUES(%s,SHA1(%s),%s)")
        mycursor.execute(stmtAddUser,(username,password,email,))
        mydb.commit()
        return redirect(url_for('login'))
    else:
        return redirect(url_for('createAccountGET'))
    
    return redirect(url_for('homePage'))


@app.route('/login/')
def login():
    #Check Cookies
    credHash = request.cookies.get('credHash')
    username = request.cookies.get('username')

    #Check if user exists with that username and that credHash
    mycursor = mydb.cursor(prepared=True)
    stmt = ("select userID from appuser where credHash = %s AND username = %s")
    mycursor.execute(stmt,(credHash,username,))
    myresult = mycursor.fetchone()

    if(myresult!=None):
        return redirect(url_for('homePage'))
    else:
        return render_template('login.html')

@app.route('/login/', methods=['POST'])
def login_post():
    #Get Form Info
    username = request.form.get('username')
    password = request.form.get('password')
    remember = True if request.form.get('remember') else False

    #Check to see if username/password combo exists
    mycursor = mydb.cursor(prepared=True)
    stmt = ("select userID from appuser where userPassword = SHA1(%s) AND username = %s")
    mycursor.execute(stmt,(password,username,))
    myresult = mycursor.fetchone()

    if myresult == None:
        response = make_response(redirect('/login'))
        return response
    else: #Add cookies, and add credHash to DB
        response = make_response(redirect('/home/'))

        token = secrets.token_hex(32)
        response.set_cookie('credHash',token)
        response.set_cookie('username', username)

        mycursor = mydb.cursor(prepared=True)
        stmt = ("update appuser SET credHash = %s where userPassword = SHA1(%s) AND username = %s")
        mycursor.execute(stmt,(token,password,username,))
        mydb.commit()
        return response
    
    return redirect(url_for('homePage'))

# /home/ (default route)
@app.route("/home/")
@app.route("/")
def homePage():
    # Do something, Taipu
    return render_template("home.html")
