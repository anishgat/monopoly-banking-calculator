from flask import Flask, redirect, render_template, request, session
from flask_session import Session
from cs50 import SQL
import locale
from functools import wraps

app = Flask(__name__)

app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

db = SQL("sqlite:///bank.db")

locale.setlocale(locale.LC_ALL, 'en_CA.UTF-8' )

start_balance = 15000000

def reset():
    db.execute("UPDATE users SET balance = 0")

def game_required(f):
    """
    Decorate routes to require login.

    https://flask.palletsprojects.com/en/latest/patterns/viewdecorators/
    """

    @wraps(f)
    def decorated_function(*args, **kwargs):
        if session.get("user_id") is None:
            return redirect("/")
        return f(*args, **kwargs)

    return decorated_function

@app.route("/", methods=["GET", "POST"])
def index():
    session.clear()
    if request.method == "POST":
        global players
        players = {}
        reset()
        for player_num, item in enumerate(request.form):  # Start from 1st index to exclude the no. of players input
            players[player_num + 1] = request.form.get(item)
        for player in players:
            db.execute("UPDATE users SET balance = ? WHERE id = ?", start_balance, player)
        
        session["user_id"] = 1
        
        return redirect("/calculator")

    return render_template("index.html")

@app.route("/calculator", methods=["GET", "POST"])
@game_required
def calculator():
    if request.method == "POST":
        player_id = request.form.get("player")
        multiplication_factor = request.form.get("multiplication_factor")
        value = request.form.get("display_box")
        sign = request.form.get("sign")

        if not player_id or not multiplication_factor or not value:
            return redirect("/calculator")

        # To ensure the value in the display box can be converted to a floating point number
        try:
            change_in_value = float(sign + value) * float(multiplication_factor)
        except:
            return redirect("/calculator")
        
        if abs(change_in_value) > 20000000:
            return redirect("/calculator")
        old_value = db.execute("SELECT balance FROM users WHERE id = ?", player_id)[0]["balance"]
        new_value = old_value + change_in_value

        if new_value < 0:
            return redirect("/calculator")

        db.execute("UPDATE users SET balance = ? WHERE id = ?", new_value, player_id)
    
    balances = {}
    for player in players:
        balance = db.execute("SELECT balance FROM users WHERE id = ?", player)[0]["balance"]
        balances[player] = locale.currency(int(balance), grouping=True)[:-3] # Exclude the 2 decimal places in the money value
    return render_template("calculator.html", players=players, balances=balances)
