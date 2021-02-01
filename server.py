# GameScore server
# Nathan J. McNany, 2021

# Setup
from flask import Flask, render_template
app = Flask(__name__)
app.config["SEND_FILE_MAX_AGE_DEFAULT"] = 0  # Always do a complete refresh (for now)

# Cleanup function
@app.teardown_appcontext
def cleanup(exception):
    # Do something, Taipu
    pass

# /home/ (default route)
@app.route("/home/")
@app.route("/")
def homePage():
    # Do something, Taipu
    return render_template("home.html")
